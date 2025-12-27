module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'info',         // Thông tin
        'success',      // Thành công
        'warning',      // Cảnh báo
        'error',        // Lỗi
        'course',       // Khóa học
        'assignment',   // Bài tập
        'grade',        // Điểm số
        'reminder',     // Nhắc nhở
        'achievement',  // Thành tích
        'system'        // Hệ thống
      ),
      allowNull: false,
      defaultValue: 'info'
    },
    category: {
      type: DataTypes.ENUM(
        'general',      // Tổng quát
        'course',       // Khóa học
        'assessment',   // Đánh giá
        'social',       // Xã hội
        'system',       // Hệ thống
        'marketing'     // Marketing
      ),
      allowNull: false,
      defaultValue: 'general'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'archived'),
      allowNull: false,
      defaultValue: 'unread'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    action_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    action_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of related object (course, content, etc.)'
    },
    related_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type of related object'
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    scheduled_for: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    },
    delivery_status: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        email: false,
        push: false,
        sms: false,
        in_app: true
      }
    }
  }, {
    tableName: 'notifications',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['type']
      },
      {
        fields: ['category']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['status']
      },
      {
        fields: ['is_read']
      },
      {
        fields: ['sender_id']
      },
      {
        fields: ['scheduled_for']
      },
      {
        fields: ['expires_at']
      },
      {
        fields: ['related_id', 'related_type']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  // Instance methods
  Notification.prototype.markAsRead = async function() {
    if (!this.is_read) {
      this.is_read = true;
      this.read_at = new Date();
      this.status = 'read';
      await this.save();
    }
  };

  Notification.prototype.archive = async function() {
    this.status = 'archived';
    await this.save();
  };

  Notification.prototype.isExpired = function() {
    return this.expires_at && new Date() > this.expires_at;
  };

  Notification.prototype.shouldDeliverNow = function() {
    const now = new Date();
    return (!this.scheduled_for || now >= this.scheduled_for) && !this.isExpired();
  };

  // Class methods
  Notification.findByUser = function(userId, options = {}) {
    return this.findAll({
      where: {
        user_id: userId,
        ...options.where
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  };

  Notification.findUnreadByUser = function(userId, options = {}) {
    return this.findAll({
      where: {
        user_id: userId,
        is_read: false,
        status: 'unread',
        ...options.where
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  };

  Notification.countUnreadByUser = function(userId) {
    return this.count({
      where: {
        user_id: userId,
        is_read: false,
        status: 'unread'
      }
    });
  };

  Notification.findByType = function(type, options = {}) {
    return this.findAll({
      where: {
        type: type,
        ...options.where
      },
      ...options
    });
  };

  Notification.findExpired = function() {
    return this.findAll({
      where: {
        expires_at: {
          [sequelize.Op.lt]: new Date()
        },
        status: {
          [sequelize.Op.ne]: 'archived'
        }
      }
    });
  };

  Notification.findScheduled = function() {
    const now = new Date();
    return this.findAll({
      where: {
        scheduled_for: {
          [sequelize.Op.lte]: now
        },
        status: 'unread'
      }
    });
  };

  Notification.markAllAsReadByUser = async function(userId) {
    return this.update(
      {
        is_read: true,
        read_at: new Date(),
        status: 'read'
      },
      {
        where: {
          user_id: userId,
          is_read: false
        }
      }
    );
  };

  Notification.createBulk = async function(notifications) {
    return this.bulkCreate(notifications, {
      validate: true,
      returning: true
    });
  };

  // Define associations
  Notification.associate = function(models) {
    // Notification belongs to user (recipient)
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Notification belongs to sender (optional)
    Notification.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender'
    });
  };

  return Notification;
};
