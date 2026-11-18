@echo off
setlocal EnableExtensions
title Santhosh Kumar K - Portfolio

rem ============================================================
rem  Double-click to open the portfolio in your browser.
rem  - Already running?  It just opens the page.
rem  - Code changed?     It rebuilds once (about 15 seconds).
rem  - Otherwise         the page opens in about 3 seconds.
rem  To stop the site, close the minimized "Portfolio server" window.
rem  This file can be copied to the Desktop; it still finds the project.
rem ============================================================

set "PORT=3100"
set "URL=http://localhost:%PORT%"
set "APP=%~dp0"
if not exist "%APP%package.json" set "APP=C:\Users\HP\Desktop\Mr Outfit\santhosh-portfolio\"
cd /d "%APP%" || goto :fail

echo.
echo    SANTHOSH KUMAR K  -  PORTFOLIO
echo    ------------------------------
echo.

rem 1. Already running? Just open it.
netstat -an | findstr /r /c:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  echo    The portfolio is already running.
  goto :open
)

rem 2. First run only: install dependencies.
if not exist "node_modules\" (
  echo    Installing dependencies - first run only...
  call npm install --no-audit --no-fund || goto :fail
)

rem 3. Build only when there is no build yet or the code changed since the last one.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$b='out\index.html'; if (-not (Test-Path $b)) { exit 1 }; $t=(Get-Item $b).LastWriteTime; $n=@(Get-ChildItem src,public -Recurse -File) + @(Get-Item package.json,next.config.ts) | Where-Object { $_.LastWriteTime -gt $t } | Select-Object -First 1; if ($n) { exit 1 } else { exit 0 }"
if errorlevel 1 (
  echo    Code changed since last time - rebuilding, about 15 seconds...
  call npm run build || goto :fail
)

rem 4. Start the site in its own minimized window.
echo    Starting the portfolio...
start "Portfolio server - close this window to stop" /min cmd /k "node scripts\serve-static.mjs -p %PORT%"

rem 5. Wait until it answers, up to 60 seconds.
call :wait_for_site 60
if errorlevel 1 (
  echo    The site did not start. Open the "Portfolio server" window to see why.
  goto :fail
)

:open
if "%NO_BROWSER%"=="1" goto :done
set "CHROME="
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LocalAppData%\Google\Chrome\Application\chrome.exe") do if not defined CHROME if exist "%%~P" set "CHROME=%%~P"
if defined CHROME (
  start "" "%CHROME%" "%URL%"
) else (
  start "" "%URL%"
)

:done
echo    Opened %URL%
echo    To stop it later, close the minimized "Portfolio server" window.
timeout /t 4 /nobreak >nul 2>&1
exit /b 0

:wait_for_site
rem Waits up to %1 seconds for the port to open (checked every 0.2 s), then for the first page.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$end=(Get-Date).AddSeconds(%1); $ip=[Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties(); while (-not ($ip.GetActiveTcpListeners() | Where-Object Port -eq %PORT%)) { if ((Get-Date) -gt $end) { exit 1 }; Start-Sleep -Milliseconds 200 }; try { $null=Invoke-WebRequest -UseBasicParsing -TimeoutSec 20 'http://127.0.0.1:%PORT%'; exit 0 } catch { exit 1 }"
exit /b %errorlevel%

:fail
echo.
echo    Something went wrong. See the messages above.
pause
exit /b 1
