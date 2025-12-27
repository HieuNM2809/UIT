@echo off
echo ============================================
echo  StudyMate Database Cleanup (Windows)
echo ============================================
echo.

echo 🛑 Stopping Docker containers...
docker-compose down

echo.
echo 📊 Container status:
docker-compose ps

echo.
echo ✅ Database containers stopped!
echo.
pause
