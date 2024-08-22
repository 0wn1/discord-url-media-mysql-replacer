@echo off
title Task Manager
setlocal

openfiles >nul 2>&1
if %errorlevel% neq 0 (
    echo Please run this script as administrator.
    pause
    exit /b
)

:menu
cls
echo ========================================================================================
echo                                    TASK MANAGER
echo ========================================================================================
echo 1. Install Modules (Run 'npm install' to install dependencies)
echo 2. Start Bot (Run 'node index.js' immediately)
echo 3. Create Task (Schedule to execute this bot script every day at this exact time)
echo 4. Remove Task (Delete the scheduled task)
echo 5. Exit (Close this window)
echo ========================================================================================
set /p choice="Choose an option (1-5): "

if "%choice%"=="1" goto installmodules
if "%choice%"=="2" goto startnode
if "%choice%"=="3" goto create
if "%choice%"=="4" goto remove
if "%choice%"=="5" goto end
goto menu

:installmodules
start cmd /c "cd /d %~dp0 && npm install && echo Modules installed successfully! && pause"
goto menu

:startnode
start cmd /c "cd /d %~dp0 && node index.js && pause"
goto menu

:create
set "taskname=Discord Bot"
set "taskcmd=node index.js"
set "taskdir=%~dp0"

schtasks /create /tn "%taskname%" /tr "cmd /c cd /d %taskdir% && %taskcmd%" /sc daily /f
:: echo Task '%taskname%' created successfully!
pause
goto menu

:remove
set "taskname=Discord Bot"

schtasks /delete /tn "%taskname%" /f
:: echo Task '%taskname%' removed successfully!
pause
goto menu

:end
endlocal
exit /b
