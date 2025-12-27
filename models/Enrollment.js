module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
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
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'courses', key: 'id' }
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'dropped'),
      defaultValue: 'pending'
    },
    enrolled_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    progress_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    total_time_spent: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_accessed: DataTypes.DATE
  }, {
    tableName: 'enrollments'
  });

  Enrollment.associate = function(models) {
    Enrollment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Enrollment.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  };

  return Enrollment;
};