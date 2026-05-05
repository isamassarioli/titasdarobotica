#!/bin/bash

echo "Creating virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Creating .env file from .env.example..."
if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "Running migrations..."
python manage.py migrate

echo ""
echo "✅ Setup completo!"
echo ""
echo "Para iniciar o servidor, execute:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Admin: http://localhost:8000/admin/"
echo "API: http://localhost:8000/api/"
echo ""
echo "Criar super-usuário:"
echo "  python manage.py createsuperuser"
echo ""
