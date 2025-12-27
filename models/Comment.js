module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    discussion_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'discussions', key: 'id' }
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'comments', key: 'id' }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_solution: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'comments'
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
    Comment.belongsTo(models.Discussion, { foreignKey: 'discussion_id' });
    Comment.belongsTo(models.Comment, { foreignKey: 'parent_id', as: 'parent' });
    Comment.hasMany(models.Comment, { foreignKey: 'parent_id', as: 'replies' });
  };

  return Comment;
};
