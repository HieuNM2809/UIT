module.exports = (sequelize, DataTypes) => {
  const ContentAISuggestion = sequelize.define('ContentAISuggestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contents',
        key: 'id'
      }
    },
    knowledge: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'AI model used to generate the suggestion'
    }
  }, {
    tableName: 'content_ai_suggestions',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['content_id']
      },
      {
        unique: true,
        fields: ['user_id', 'content_id']
      }
    ]
  });

  ContentAISuggestion.associate = function(models) {
    ContentAISuggestion.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    ContentAISuggestion.belongsTo(models.Content, {
      foreignKey: 'content_id',
      as: 'content'
    });
  };

  return ContentAISuggestion;
};

