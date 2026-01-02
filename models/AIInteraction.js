module.exports = (sequelize, DataTypes) => {
  const AIInteraction = sequelize.define('AIInteraction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    interaction_type: {
      type: DataTypes.ENUM('chat', 'recommendation', 'analysis', 'feedback', 'roadmap'),
      allowNull: false
    },
    user_input: { type: DataTypes.TEXT, allowNull: false },
    ai_response: { type: DataTypes.TEXT, allowNull: false },
    model_used: DataTypes.STRING,
    tokens_used: DataTypes.INTEGER,
    response_time: DataTypes.INTEGER,
    rating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 }
    },
    context_data: DataTypes.JSONB,
    session_id: DataTypes.STRING
  }, { tableName: 'ai_interactions' });

  AIInteraction.associate = function(models) {
    AIInteraction.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return AIInteraction;
};
