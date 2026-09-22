@echo off
echo ===================================
echo   MAX Messenger - Запуск сервера
echo ===================================
echo.
echo Запускаем dev-сервер...
echo.
cd /d "%~dp0"
call npm run dev
pause
