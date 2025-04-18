@echo off
REM Batch script to build the backend project
REM Usage: build-backend.cmd [NODE_PATH]

echo ======================================
echo Building Backend Project
echo ======================================

set NODE_DIR=%~1
echo Node.js directory: %NODE_DIR%
echo Current directory: %CD%

cd backend
echo Changed to directory: %CD%

echo.
echo Running npm ci...
call "%NODE_DIR%\npm.cmd" ci
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm ci failed with exit code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo.
echo Running npm run build...
call "%NODE_DIR%\npm.cmd" run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm run build failed with exit code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo.
echo Backend build completed successfully
echo ====================================== 