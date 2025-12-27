module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define('Content', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'courses', key: 'id' }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    content_type: {
      type: DataTypes.ENUM('lesson', 'video', 'document', 'quiz', 'assignment'),
      defaultValue: 'lesson'
    },
    body: DataTypes.TEXT,
    video_url: DataTypes.STRING,
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    estimated_duration: DataTypes.INTEGER
  }, {
    tableName: 'contents'
  });

  Content.associate = function(models) {
    Content.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  };

  return Content;
};