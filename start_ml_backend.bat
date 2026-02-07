@echo off
cd /d "%~dp0\ml"

echo Checking Python environment...

:: Check if venv exists and is valid
if exist ".venv" (
    call .venv\Scripts\activate >nul 2>&1
    python --version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Virtual environment appears broken. Recreating...
        if exist ".venv" rmdir /s /q ".venv"
    ) else (
        echo Virtual environment is valid.
    )
)

:: Create venv if missing (or deleted above)
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment. Ensure Python is installed and in your PATH.
        pause
        exit /b
    )
    
    call .venv\Scripts\activate
    echo Installing requirements...
    pip install -r requirements.txt
) else (
    echo Activating virtual environment...
    call .venv\Scripts\activate
)

echo Starting ML Server...
python app.py
if errorlevel 1 (
    echo [ERROR] Server stopped unexpectedly.
    pause
)
pause
