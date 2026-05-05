@echo off
echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo Creating .env file from .env.example...
if not exist .env (
    copy .env.example .env
)

echo Running migrations...
python manage.py migrate

echo.
echo ✅ Setup completo!
echo.
echo Para iniciar o servidor, execute:
echo   .\venv\Scripts\activate.bat
echo   python manage.py runserver
echo.
echo Admin: http://localhost:8000/admin/
echo API: http://localhost:8000/api/
echo.
echo Criar super-usuário:
echo   python manage.py createsuperuser
echo.
