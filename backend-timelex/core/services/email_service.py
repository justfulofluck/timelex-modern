import yagmail
from django.conf import settings

class EmailService:
    def __init__(self):
        self.user = settings.EMAIL_HOST_USER
        self.password = settings.EMAIL_HOST_PASSWORD
        self.host = settings.EMAIL_HOST
        self.port = settings.EMAIL_PORT
        self.use_tls = settings.EMAIL_USE_TLS
        self.yag = None

    def connect(self):
        print(f"DEBUG: Attempting to connect to SMTP server: {self.host}:{self.port} (User: {self.user})")
        if not self.user or not self.password:
            print("DEBUG: missing credentials")
            return False, "Credentials missing"
            
        if not self.yag:
            try:
                # Map Django settings to Yagmail
                # Note: Yagmail defaults to SSL (465). For 587+TLS, we need explicit config.
                self.yag = yagmail.SMTP(
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port,
                    smtp_starttls=self.use_tls,
                    smtp_ssl=False # Explicitly disable implicit SSL if using TLS
                )
                print("DEBUG: Connection established successfully")
            except Exception as e:
                print(f"DEBUG: Connection failed: {e}")
                return False, str(e)
        return True, None

    def send_email(self, to, subject, contents):
        print(f"DEBUG: Preparing to send email to {to} with subject '{subject}'")
        success, error = self.connect()
        if not success:
            print(f"DEBUG: Failed to connect: {error}")
            return False, error
            
        try:
            self.yag.send(to=to, subject=subject, contents=contents)
            print(f"DEBUG: Email sent successfully to {to}")
            return True, None
        except Exception as e:
            print(f"DEBUG: Failed to send email: {e}")
            return False, str(e)
