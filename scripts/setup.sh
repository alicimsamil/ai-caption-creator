#!/bin/bash
set -e

echo "=== CaptionAI Setup ==="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Docker is required. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "Docker Compose is required. Please install Docker Compose first."
    exit 1
fi

echo "1. Starting services with Docker Compose..."
docker compose up -d

echo ""
echo "2. Waiting for Ollama to be ready..."
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
    sleep 2
    echo "   Waiting..."
done
echo "   Ollama is ready!"

echo ""
echo "3. Pulling Llama 3 model (this may take a while)..."
docker compose exec ollama ollama pull llama3

echo ""
echo "4. Running database migrations..."
cd web && npx prisma migrate deploy && cd ..

echo ""
echo "5. Seeding database with templates..."
cd web && npm run db:seed && cd ..

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "  Web App:    http://localhost:3000"
echo "  Ollama:     http://localhost:11434"
echo "  AI Service: http://localhost:8000"
echo "  PostgreSQL: localhost:5432"
echo ""
echo "Run 'docker compose logs -f' to view logs."
