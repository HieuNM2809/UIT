module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define('Discussion', {
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
      allowNull: true,
      references: { model: 'courses', key: 'id' }
    },
    content_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'contents', key: 'id' }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'resolved'),
      defaultValue: 'open'
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'discussions'
  });

  Discussion.associate = function(models) {
    Discussion.belongsTo(models.User, { foreignKey: 'user_id' });
    Discussion.belongsTo(models.Course, { foreignKey: 'course_id' });
    Discussion.belongsTo(models.Content, { foreignKey: 'content_id' });
    Discussion.hasMany(models.Comment, { foreignKey: 'discussion_id' });
  };

  return Discussion;
};
