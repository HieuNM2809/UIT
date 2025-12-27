const { Sequelize } = require('sequelize');

// Database configuration for Windows Host -> Docker Container
const config = {
  development: {
    username: process.env.DB_USER || 'studymate',
    password: process.env.DB_PASS || 'studymate123',
    database: process.env.DB_NAME || 'studymate_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3
    }
  },
  production: {
    username: process.env.DB_USER || 'studymate',
    password: process.env.DB_PASS || 'studymate123',
    database: process.env.DB_NAME || 'studymate_prod',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  define: {
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    
    if (env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✓ Database synchronized');
    }
  } catch (error) {
    console.error('✗ Unable to connect to database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };