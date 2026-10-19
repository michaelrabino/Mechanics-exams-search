@echo off
rem Generates natural-voice MP3 files for the explanations (see generate-audio.ps1).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0generate-audio.ps1" %*
echo.
pause
