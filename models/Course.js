module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    short_description: DataTypes.STRING(500),
    thumbnail: DataTypes.STRING,
    instructor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
      defaultValue: 'beginner'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    enrolled_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    average_rating: DataTypes.DECIMAL(3, 2)
  }, {
    tableName: 'courses',
    hooks: {
      beforeValidate: (course) => {
        if (course.title && !course.slug) {
          course.slug = course.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        }
      }
    }
  });

  Course.associate = function(models) {
    Course.belongsTo(models.User, { foreignKey: 'instructor_id', as: 'instructor' });
    Course.hasMany(models.Content, { foreignKey: 'course_id', as: 'contents' });
    Course.hasMany(models.Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
  };

  return Course;
};