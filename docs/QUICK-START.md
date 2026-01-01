# 🚀 StudyMate Quick Start Guide

## Windows Development Setup

### ⚡ **1-Minute Setup**

```batch
# 1. Clone project
git clone https://github.com/your-username/studymate.git
cd studymate

# 2. Run auto setup
scripts\setup.bat

# 3. Start app
npm run dev
```

**That's it!** Open http://localhost:3000

---

### 📋 **What happens during setup:**

1. ✅ Checks Node.js & Docker installation
2. 📦 Installs NPM dependencies  
3. ⚙️ Creates `.env` file from template
4. 🐳 Starts PostgreSQL & Redis containers
5. 🔗 Tests database connections
6. 🎉 Ready to code!

---

### 🎯 **Quick Commands**

```batch
# Start app (with hot reload)
npm run dev

# Start/stop databases
npm run db:start
npm run db:stop

# Reset database (deletes data)
npm run db:reset

# View database logs
npm run db:logs
```

---

### 🔧 **Manual Database Management**

```batch
# Start databases only
docker-compose up -d

# Stop databases  
docker-compose down

# View container status
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs redis
```

---

### 📊 **Database Access**

**PostgreSQL:** `localhost:5432`
- Database: `studymate_dev`
- User: `studymate` 
- Pass: `studymate123`

**Redis:** `localhost:6379`  
- Pass: `redis123`

---

### 🆘 **Quick Troubleshooting**

**Port already in use:**
```batch
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```

**Database won't connect:**
```batch
docker-compose restart
docker-compose logs postgres
```

**App won't start:**
```batch
npm cache clean --force
rm -rf node_modules
npm install
```

---

### 🎓 **Demo Accounts**

- **Student:** `student@uit.edu.vn` / `password`
- **Teacher:** `teacher@uit.edu.vn` / `password`  
- **Admin:** `admin@uit.edu.vn` / `password`

---

**Happy Coding! 🎉**

Made with ❤️ by UIT Students  
📧 Contact: studymate@uit.edu.vn
