#!/bin/bash
# Frontend Startup Script

echo "⚛️  Starting React Frontend..."
cd frontend-timelex || { echo "❌ Frontend directory not found"; exit 1; }

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start Vite
echo "🚀 Frontend running at http://localhost:5173"
exec npm run dev -- --host
