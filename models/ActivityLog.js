module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
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
    action: { type: DataTypes.STRING, allowNull: false },
    resource_type: DataTypes.STRING,
    resource_id: DataTypes.UUID,
    details: DataTypes.JSONB,
    ip_address: DataTypes.INET,
    user_agent: DataTypes.STRING,
    session_id: DataTypes.STRING
  }, { tableName: 'activity_logs' });

  ActivityLog.associate = function(models) {
    ActivityLog.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return ActivityLog;
};
