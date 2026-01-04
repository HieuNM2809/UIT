@echo off
REM SonarQube Analysis Script for Windows
REM This script runs SonarQube analysis using Docker

echo ========================================
echo SonarQube Analysis - StudyMate Project
echo ========================================
echo.

REM Get script directory (sonarqube folder)
set SCRIPT_DIR=%~dp0
set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

REM Get project root directory (parent of sonarqube folder)
cd /d "%~dp0\.."
set PROJECT_ROOT=%CD%

echo Script Directory: %SCRIPT_DIR%
echo Project Root: %PROJECT_ROOT%
echo.

REM Check if sonar-project.properties exists in sonarqube folder first, then project root
set SONAR_CONFIG_FILE=
if exist "%SCRIPT_DIR%\sonar-project.properties" (
    set SONAR_CONFIG_FILE=%SCRIPT_DIR%\sonar-project.properties
    echo Found sonar-project.properties in sonarqube folder
) else if exist "%PROJECT_ROOT%\sonar-project.properties" (
    set SONAR_CONFIG_FILE=%PROJECT_ROOT%\sonar-project.properties
    echo Found sonar-project.properties in project root
) else (
    echo ERROR: sonar-project.properties not found!
    echo Looking in:
    echo   - %SCRIPT_DIR%\sonar-project.properties
    echo   - %PROJECT_ROOT%\sonar-project.properties
    echo.
    echo Please copy sonarqube\sonar-project.properties.example to sonar-project.properties
    echo and update the SONAR_TOKEN.
    pause
    exit /b 1
)
echo Using config file: %SONAR_CONFIG_FILE%
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if SonarQube container is running
docker ps | findstr "studymate-sonarqube" >nul 2>&1
if errorlevel 1 (
    echo WARNING: SonarQube container is not running!
    echo Starting SonarQube...
    docker-compose up -d sonarqube
    echo Waiting for SonarQube to be ready...
    timeout /t 30 /nobreak >nul
)

REM Convert Windows path to Docker-compatible path
set DOCKER_PATH=%PROJECT_ROOT:\=/%

REM Read settings from sonar-project.properties
echo Reading settings from sonar-project.properties...
echo.

REM Read project key
for /f "tokens=2 delims==" %%a in ('findstr /C:"sonar.projectKey=" "%SONAR_CONFIG_FILE%"') do set SONAR_PROJECT_KEY=%%a
if "%SONAR_PROJECT_KEY%"=="" (
    echo ERROR: sonar.projectKey not found in sonar-project.properties!
    pause
    exit /b 1
)

REM Read host URL
for /f "tokens=2 delims==" %%a in ('findstr /C:"sonar.host.url=" "%SONAR_CONFIG_FILE%"') do set SONAR_HOST_URL=%%a
if "%SONAR_HOST_URL%"=="" (
    echo ERROR: sonar.host.url not found in sonar-project.properties!
    pause
    exit /b 1
)

REM Read token
for /f "tokens=2 delims==" %%a in ('findstr /C:"sonar.login=" "%SONAR_CONFIG_FILE%"') do set SONAR_TOKEN=%%a
if "%SONAR_TOKEN%"=="" (
    echo ERROR: sonar.login not found in sonar-project.properties!
    pause
    exit /b 1
)

REM Read sources (default to . if not specified)
for /f "tokens=2 delims==" %%a in ('findstr /C:"sonar.sources=" "%SONAR_CONFIG_FILE%"') do set SONAR_SOURCES=%%a
if "%SONAR_SOURCES%"=="" set SONAR_SOURCES=.

REM Note: Other settings like exclusions, encoding, etc. will be automatically read
REM from sonar-project.properties file by sonar-scanner

REM Convert host URL for Docker (localhost -> host.docker.internal)
set SONAR_HOST_URL_DOCKER=%SONAR_HOST_URL%
set SONAR_HOST_URL_DOCKER=%SONAR_HOST_URL_DOCKER:localhost=host.docker.internal%
set SONAR_HOST_URL_DOCKER=%SONAR_HOST_URL_DOCKER:127.0.0.1=host.docker.internal%

echo Settings loaded:
echo   Project Key: %SONAR_PROJECT_KEY%
echo   Host URL: %SONAR_HOST_URL% (Docker: %SONAR_HOST_URL_DOCKER%)
echo   Sources: %SONAR_SOURCES%
echo   Token: %SONAR_TOKEN:~0,20%...
echo.

echo Starting SonarQube analysis...
echo.

REM Run SonarQube scanner in Docker with settings from properties file
docker run --rm ^
  -v "%PROJECT_ROOT%:/usr/src" ^
  -w /usr/src ^
  sonarsource/sonar-scanner-cli ^
  -Dsonar.projectKey=%SONAR_PROJECT_KEY% ^
  -Dsonar.sources=%SONAR_SOURCES% ^
  -Dsonar.host.url=%SONAR_HOST_URL_DOCKER% ^
  -Dsonar.login=%SONAR_TOKEN%

if errorlevel 1 (
    echo.
    echo ========================================
    echo Analysis FAILED!
    echo ========================================
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo Analysis COMPLETED successfully!
    echo ========================================
    echo.
    echo View report at: %SONAR_HOST_URL%/dashboard?id=%SONAR_PROJECT_KEY%
    echo.
    start %SONAR_HOST_URL%/dashboard?id=%SONAR_PROJECT_KEY%
)

pause

