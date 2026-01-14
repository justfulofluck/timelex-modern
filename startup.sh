#!/bin/bash

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping Timelex services..."
    # Kill all child processes in the current process group
    trap - SIGINT SIGTERM # Clear the trap
    kill -- -$$ 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting Timelex Modern..."

# Start Backend
./backend.sh &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# Start Frontend
./frontend.sh &
FRONTEND_PID=$!

echo ""
echo "✅ Timelex is running!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services."

# Wait for both processes
wait
