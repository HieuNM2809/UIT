module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    user2_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    last_message_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'messages', key: 'id' }
    },
    last_message_at: DataTypes.DATE,
    user1_unread_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    user2_unread_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'conversations',
    indexes: [
      { fields: ['user1_id'] },
      { fields: ['user2_id'] },
      { fields: ['last_message_at'] },
      { 
        unique: true,
        fields: ['user1_id', 'user2_id'],
        name: 'unique_conversation'
      }
    ]
  });

  Conversation.associate = function(models) {
    Conversation.belongsTo(models.User, { foreignKey: 'user1_id', as: 'user1' });
    Conversation.belongsTo(models.User, { foreignKey: 'user2_id', as: 'user2' });
    Conversation.belongsTo(models.Message, { foreignKey: 'last_message_id', as: 'lastMessage' });
    Conversation.hasMany(models.Message, { foreignKey: 'conversation_id', as: 'messages' });
  };

  // Helper method to get the other user in conversation
  Conversation.prototype.getOtherUser = function(currentUserId) {
    return this.user1_id === currentUserId ? this.user2 : this.user1;
  };

  // Helper method to get unread count for current user
  Conversation.prototype.getUnreadCount = function(currentUserId) {
    return this.user1_id === currentUserId ? this.user1_unread_count : this.user2_unread_count;
  };

  return Conversation;
};

