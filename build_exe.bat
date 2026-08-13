@echo off
title Build Smart Hotel Management System - GSM_BY_US
echo ========================================================
echo   Smart Hotel Management System - Windows EXE Builder
echo   Developed By: Usama Saif (GSM_BY_US)
echo   WhatsApp: +92 347 7669235
echo ========================================================
echo.
echo [1/3] Checking and installing requirements...
pip install -r requirements.txt
pip install pyinstaller

echo.
echo [2/3] Compiling main.py to standalone EXE...
pyinstaller --noconsole --onefile --name="SmartHotelManagementSystem_GSM_BY_US" --collect-all customtkinter main.py

echo.
echo [3/3] Build finished!
echo Your standalone executable is located in the 'dist' folder.
echo Location: dist\SmartHotelManagementSystem_GSM_BY_US.exe
echo.
pause
