const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User');
const Course = require('./Course');
const Category = require('./Category');
const Content = require('./Content');
const Enrollment = require('./Enrollment');
const Contact = require('./Contact');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Progress = require('./Progress');

// Initialize models
const models = {
  User: User(sequelize, DataTypes),
  Course: Course(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  Content: Content(sequelize, DataTypes),
  Enrollment: Enrollment(sequelize, DataTypes),
  Contact: Contact(sequelize, DataTypes),
  Conversation: Conversation(sequelize, DataTypes),
  Message: Message(sequelize, DataTypes),
  Progress: Progress(sequelize, DataTypes)
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