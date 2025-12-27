const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User');
const Course = require('./Course');
const Content = require('./Content');
const Enrollment = require('./Enrollment');

// Initialize models
const models = {
  User: User(sequelize, DataTypes),
  Course: Course(sequelize, DataTypes),
  Content: Content(sequelize, DataTypes),
  Enrollment: Enrollment(sequelize, DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};