@echo off
rem Lets GitHub Desktop push through the organization proxy (see setup-git-proxy.ps1).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-git-proxy.ps1" %*
echo.
pause
