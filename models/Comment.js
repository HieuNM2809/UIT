module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 5000] // Minimum 1 character, maximum 5000 characters
      }
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'courses', key: 'id' }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'comments', key: 'id' }
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'hidden', 'deleted'),
      defaultValue: 'active'
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    reports_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'comments',
    indexes: [
      { fields: ['course_id'] },
      { fields: ['user_id'] },
      { fields: ['parent_id'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
      { fields: ['course_id', 'status', 'parent_id'] }
    ],
    hooks: {
      beforeUpdate: (comment) => {
        // Track edit timestamp
        if (comment.changed('content') && !comment.isNewRecord) {
          comment.is_edited = true;
          comment.edited_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Comment.prototype.isReply = function() {
    return this.parent_id !== null;
  };

  Comment.prototype.canEditBy = function(user) {
    if (!user) return false;
    // User can edit their own comments within 30 minutes, or admin can edit any
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return (this.user_id === user.id && this.created_at > thirtyMinutesAgo) || 
           ['admin', 'system_admin'].includes(user.role);
  };

  Comment.prototype.canDeleteBy = function(user) {
    if (!user) return false;
    // User can delete their own comments, admin can delete any, instructor can delete from their course
    return this.user_id === user.id || 
           ['admin', 'system_admin'].includes(user.role);
  };

  // Class methods
  Comment.findByCourse = function(courseId, options = {}) {
    return this.findAll({
      where: {
        course_id: courseId,
        status: 'active',
        parent_id: null, // Only top-level comments
        ...options.where
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: sequelize.models.Comment,
          as: 'replies',
          where: { status: 'active' },
          required: false,
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
            }
          ],
          order: [['created_at', 'ASC']]
        }
      ],
      order: [['created_at', 'DESC']],
      ...options
    });
  };

  Comment.associate = function(models) {
    Comment.belongsTo(models.Course, { 
      foreignKey: 'course_id', 
      as: 'course',
      onDelete: 'CASCADE'
    });
    
    Comment.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      as: 'user',
      onDelete: 'CASCADE'
    });
    
    // Self-referencing association for replies
    Comment.belongsTo(models.Comment, { 
      foreignKey: 'parent_id', 
      as: 'parent',
      onDelete: 'CASCADE'
    });
    
    Comment.hasMany(models.Comment, { 
      foreignKey: 'parent_id', 
      as: 'replies',
      onDelete: 'CASCADE'
    });
  };

  return Comment;
};