#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "Starting Toxicity Analyzer..."
echo "Open in browser: http://localhost:8000"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
