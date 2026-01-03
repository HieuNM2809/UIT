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
const Comment = require('./Comment');
const Blog = require('./Blog');
const PasswordResetToken = require('./PasswordResetToken');
const EmailVerification = require('./EmailVerification');
const Certificate = require('./Certificate');
const Rating = require('./Rating');
const PersonalNote = require('./PersonalNote');
const AIInteraction = require('./AIInteraction');
const Payment = require('./Payment');
const ContentAISuggestion = require('./ContentAISuggestion');

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
  Progress: Progress(sequelize, DataTypes),
  Comment: Comment(sequelize, DataTypes),
  Blog: Blog(sequelize, DataTypes),
  PasswordResetToken: PasswordResetToken(sequelize, DataTypes),
  EmailVerification: EmailVerification(sequelize, DataTypes),
  Certificate: Certificate(sequelize, DataTypes),
  Rating: Rating(sequelize, DataTypes),
  PersonalNote: PersonalNote(sequelize, DataTypes),
  AIInteraction: AIInteraction(sequelize, DataTypes),
  Payment: Payment(sequelize, DataTypes),
  ContentAISuggestion: ContentAISuggestion(sequelize, DataTypes)
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