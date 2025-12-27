@echo off
echo ============================================
echo  StudyMate Setup Script (Windows)
echo ============================================
echo.

echo 📋 Checking requirements...

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

:: Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or running!
    echo Please install Docker Desktop from https://docker.com/
    pause
    exit /b 1
)

echo ✅ Docker version:
docker --version

echo.
echo 📦 Installing Node.js dependencies...
call npm install

echo.
echo ⚙️ Setting up environment...
if not exist .env (
    copy env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please review and update .env file if needed
) else (
    echo ℹ️  .env file already exists
)

echo.
echo 📁 Creating required directories...
if not exist uploads mkdir uploads
if not exist logs mkdir logs
if not exist public\uploads mkdir public\uploads

echo.
echo 🐳 Starting database containers...
call docker-compose up -d

echo.
echo ⏳ Waiting for databases to initialize...
timeout /t 15 /nobreak >nul

echo.
echo 🔍 Testing database connection...
echo This may take a moment...
node -e "
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
async function test() {
  try {
    await connectDB();
    await connectRedis();
    console.log('✅ Database connections successful!');
    process.exit(0);
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}
test();
"

if errorlevel 1 (
    echo.
    echo ❌ Database connection failed!
    echo Please check Docker containers and try again.
    echo.
    echo Debug commands:
    echo   docker-compose ps
    echo   docker-compose logs postgres
    echo   docker-compose logs redis
    pause
    exit /b 1
)

echo.
echo ============================================
echo  🎉 StudyMate Setup Complete!
echo ============================================
echo.
echo 🚀 To start the application:
echo   npm run dev
echo.
echo 📊 Database containers are running:
echo   PostgreSQL: localhost:5432
echo   Redis: localhost:6379
echo.
echo 🛑 To stop database containers:
echo   scripts\stop-db.bat
echo.
pause
