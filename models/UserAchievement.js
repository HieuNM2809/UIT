module.exports = (sequelize, DataTypes) => {
  const UserAchievement = sequelize.define('UserAchievement', {
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
    achievement_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'achievements', key: 'id' }
    },
    earned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, { tableName: 'user_achievements' });

  UserAchievement.associate = function(models) {
    UserAchievement.belongsTo(models.User, { foreignKey: 'user_id' });
    UserAchievement.belongsTo(models.Achievement, { foreignKey: 'achievement_id' });
  };

  return UserAchievement;
};
