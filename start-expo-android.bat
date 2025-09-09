@echo off
echo Starting Safety Alert App for Android...
echo.
echo Make sure you have:
echo 1. Expo Go app installed on your Android device
echo 2. Your device connected to the same WiFi network
echo 3. Email server running (will start automatically)
echo.
echo Using LAN mode (no tunnel required)
echo.
cd /d "%~dp0"
npm run start
pause
