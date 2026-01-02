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

  // Static methods
  Enrollment.findByUserAndCourse = function(userId, courseId, options = {}) {
    return this.findOne({
      where: {
        user_id: userId,
        course_id: courseId
      },
      ...options
    });
  };

  // Instance methods
  Enrollment.prototype.updateProgress = async function(percentage) {
    this.progress_percentage = Math.min(100, Math.max(0, parseFloat(percentage) || 0));
    this.last_accessed = new Date();
    
    // Auto-complete enrollment if progress reaches 100%
    if (this.progress_percentage >= 100 && this.status === 'active') {
      this.status = 'completed';
    }
    
    await this.save();
    return this;
  };

  Enrollment.associate = function(models) {
    Enrollment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Enrollment.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  };

  return Enrollment;
};