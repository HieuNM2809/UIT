module.exports = (sequelize, DataTypes) => {
  const Achievement = sequelize.define('Achievement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    icon: DataTypes.STRING,
    badge_image: DataTypes.STRING,
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    category: {
      type: DataTypes.ENUM('learning', 'social', 'milestone', 'special'),
      defaultValue: 'learning'
    },
    requirements: DataTypes.JSONB,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'achievements' });

  Achievement.associate = function(models) {
    Achievement.hasMany(models.UserAchievement, { foreignKey: 'achievement_id' });
  };

  return Achievement;
};

