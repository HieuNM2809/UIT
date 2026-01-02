module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
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
    enrollment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'enrollments', key: 'id' }
    },
    certificate_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    issued_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    pdf_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'certificates',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['course_id'] },
      { fields: ['enrollment_id'] },
      { fields: ['certificate_number'] },
      { unique: true, fields: ['user_id', 'course_id'] }
    ]
  });

  // Static methods
  Certificate.findByUserAndCourse = function(userId, courseId) {
    return this.findOne({
      where: {
        user_id: userId,
        course_id: courseId
      }
    });
  };

  Certificate.generateCertificateNumber = function() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `STUDYMATE-${timestamp}-${random}`;
  };

  Certificate.associate = function(models) {
    Certificate.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Certificate.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    Certificate.belongsTo(models.Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
  };

  return Certificate;
};

