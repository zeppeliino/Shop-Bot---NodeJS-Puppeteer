@echo off
title NPM Installer for Puppeteer and fs
color 0a

echo ===================================================
echo          Willkommen im NPM Installer
echo ===================================================
echo.
echo Dieser Installer wird Puppeteer und fs installieren.
echo Bitte stelle sicher, dass Node.js und npm installiert sind.
echo © github.com/zeppeliino/
echo ===================================================
echo.

:: Warte auf Tastendruck zur Bestätigung
pause

:: Installation von Puppeteer
echo.
echo Installiere Puppeteer...
echo ===================================================
npm install puppeteer
if %errorlevel% neq 0 (
    echo Fehler: Die Installation von Puppeteer ist fehlgeschlagen!
    pause
    exit /b
)

:: Installation von fs
echo.
echo Installiere fs...
echo ===================================================
npm install fs
if %errorlevel% neq 0 (
    echo Fehler: Die Installation von fs ist fehlgeschlagen!
    pause
    exit /b
)

:: Erfolgsmeldung
echo.
echo Installation erfolgreich abgeschlossen!
echo ===================================================
pause
exit
