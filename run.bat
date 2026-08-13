@echo off
title Smart Hotel Management System - GSM_BY_US
echo ========================================================
echo   Launching Smart Hotel Management System...
echo   Developer: Usama Saif (GSM_BY_US)
echo ========================================================
python main.py
if %errorlevel% neq 0 (
    echo.
    echo Missing dependencies? Installing now...
    pip install -r requirements.txt
    python main.py
)
pause
