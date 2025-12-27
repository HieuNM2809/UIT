@echo off
echo ============================================
echo  StudyMate Database Setup (Windows)
echo ============================================
echo.

echo 🐳 Starting Docker containers...
docker-compose up -d

echo.
echo ⏳ Waiting for databases to be ready...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 Checking container status...
docker-compose ps

echo.
echo ✅ Database containers started!
echo.
echo 📊 Connection Info:
echo   PostgreSQL: localhost:5432
echo   - Database: studymate_dev
echo   - Username: studymate  
echo   - Password: studymate123
echo.
echo   Redis: localhost:6379
echo   - Password: redis123
echo.
echo 🚀 You can now run your StudyMate app:
echo   npm run dev
echo.
pause
