@echo off
chcp 1252 >nul
title Shop Bot LITE

:loop
cls
echo --------------------------------------------
echo          Shop Bot LITE
echo --------------------------------------------
echo Starte server.js...

:: Starte das Node.js-Skript
node server.js

