#!/bin/bash
set -e

OLLAMA_URL="${OLLAMA_BASE_URL:-http://localhost:11434}"

echo "=== Pulling AI Models ==="
echo "Ollama URL: $OLLAMA_URL"
echo ""

echo "1. Pulling llama3 (recommended - 4.7GB)..."
docker compose exec ollama ollama pull llama3

echo ""
echo "2. Pulling mistral (alternative - 4.1GB)..."
docker compose exec ollama ollama pull mistral

echo ""
echo "=== Models Ready ==="
echo ""

echo "Available models:"
docker compose exec ollama ollama list
