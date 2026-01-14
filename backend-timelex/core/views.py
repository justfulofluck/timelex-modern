from rest_framework import viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Client, Project, Task
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer
from .services.email_service import EmailService

# ... EmailAuthToken code ...

from rest_framework.permissions import AllowAny

from django.utils.crypto import get_random_string

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        print(f"DEBUG: PasswordResetView received request for email: '{email}'")
        User = get_user_model()
        user = User.objects.filter(email__iexact=email).first()
        
        if user:
            print(f"DEBUG: User found: {user}")
            # Generate temporary password
            temp_password = get_random_string(length=12)
            user.set_password(temp_password)
            user.save()
            
            email_service = EmailService()
            subject = "Password Reset Request - Timelex"
            
            # Construct message string directly
            message_body = f"""Hello {user.username},

We received a request to reset your password.
Your new temporary password is:

{temp_password}

Please login and change your password immediately.

Best,
Timelex TVA"""

            print(f"DEBUG: Generated temporary password for {email}: {temp_password}")

            success, error = email_service.send_email(email, subject, message_body)
            if success:
                return Response({'message': 'A new password has been sent to your email.'})
            else:
                return Response({'error': f'Failed to send email: {error}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # If user not found, we can either return generic success (security) or error (if requested).
        # User asked "check if email exists... if it does... send". 
        # I'll return a generic message to be safe but debug prints show the truth.
        return Response({'message': 'If an account exists with this email, a reset password has been sent.'})


class EmailAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        User = get_user_model()
        
        try:
            # Case-insensitive lookup
            user = User.objects.filter(email__iexact=email).first()
            if user is None or not user.check_password(password):
                return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        role = 'admin'
        client_id = None
        if hasattr(user, 'client_profile'):
            role = 'client'
            client_id = user.client_profile.id

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'role': role,
            'client_id': client_id
        })


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def perform_create(self, serializer):
        email = serializer.validated_data.pop('email', None)
        password = serializer.validated_data.pop('password', None)
        
        client = serializer.save()
        
        if email and password:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            # Create user if email/pass provided
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(username=email, email=email, password=password)
                client.user = user
                client.save()

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

from rest_framework.permissions import IsAuthenticated

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'Old and new passwords are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({'error': 'Wrong old password.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully.'})
