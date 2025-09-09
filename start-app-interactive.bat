@echo off
echo Starting Safety Alert App (Interactive Mode)...
echo.
echo This will show the QR code and platform options.
echo Make sure Expo Go is installed on your Android device.
echo.
cd /d "%~dp0"
echo Starting email server in background...
start /B node ../Safety-Alert-Web-Dashboard/server/emailServer.js
timeout /t 3 /nobreak >nul
echo.
echo Starting Expo development server...
expo start --lan
pause
