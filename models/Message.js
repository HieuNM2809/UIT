module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'conversations', key: 'id' }
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('text', 'image', 'file', 'system'),
      defaultValue: 'text'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    tableName: 'messages',
    indexes: [
      { fields: ['conversation_id'] },
      { fields: ['sender_id'] },
      { fields: ['created_at'] }
    ]
  });

  Message.associate = function(models) {
    Message.belongsTo(models.Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
    Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
  };

  return Message;
};

