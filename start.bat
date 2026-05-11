@echo off
title Fastfood App — Launcher
color 0A

echo.
echo  ==========================================
echo    🍔  BURGER EXPRESS — Starting Up...
echo  ==========================================
echo.

:: ── Check Node.js ────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Download it from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: ── Check backend node_modules ────────────────────────────────
if not exist "%~dp0backend\node_modules" (
    echo  [INFO] node_modules not found. Installing backend dependencies...
    echo.
    cd /d "%~dp0backend"
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo.
        echo  [ERROR] npm install failed. Check your internet connection.
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)

:: ── Start Backend Server in a new window ─────────────────────
echo  [1/3] Starting backend server on http://localhost:3000 ...
start "Fastfood API Server" cmd /k "cd /d "%~dp0backend" && node server.js"

:: ── Wait for server to boot ───────────────────────────────────
echo  [2/3] Waiting for server to start...
timeout /t 3 /nobreak >nul

:: ── Open Frontend in browser via HTTP ────────────────────────
echo  [3/3] Opening app in browser...
start "" "http://localhost:3000"
timeout /t 1 /nobreak >nul
start "" "http://localhost:3000/dashboard"

:: ── Done ──────────────────────────────────────────────────────
echo.
echo  ==========================================
echo    ✅  All systems running!
echo  ------------------------------------------
echo    Customer  →  http://localhost:3000
echo    Dashboard →  http://localhost:3000/dashboard
echo    API       →  http://localhost:3000/api/orders
echo  ==========================================
echo.
echo  Close the "Fastfood API Server" window to stop the server.
echo.
pause
