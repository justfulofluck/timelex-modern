#!/bin/bash
# Backend Startup Script

echo "🐍 Starting Django Backend..."
cd backend-timelex || { echo "❌ Backend directory not found"; exit 1; }

# Check for venv (renamed to timelex by user)
if [ ! -d "timelex" ]; then
    echo "⚠️  Virtual environment not found. Creating it..."
    python3 -m venv timelex
fi

# Activate Virtual Environment
source timelex/bin/activate

# Install dependencies if needed
if ! pip freeze | grep -q "django-cors-headers"; then
     echo "📦 Installing missing dependencies..."
     pip install -r requirements.txt
fi

# Run migrations (attempt)
echo "🔄 Checking database migrations..."
python manage.py migrate --noinput > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Migrations failed. Check your database credentials in backend-timelex/.env"
else
    echo "✅ Database is up to date."
fi

# Start server
echo "🚀 Backend running at http://0.0.0.0:8000"
exec python manage.py runserver 0.0.0.0:8000
