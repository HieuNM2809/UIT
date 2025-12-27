module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
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
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    content_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contents',
        key: 'id'
      }
    },
    enrollment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'enrollments',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM(
        'not_started',  // Chưa bắt đầu
        'in_progress',  // Đang học
        'completed',    // Hoàn thành
        'paused',       // Tạm dừng
        'skipped'       // Bỏ qua
      ),
      allowNull: false,
      defaultValue: 'not_started'
    },
    progress_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    time_spent: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_position: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Store video position, page number, etc.'
    },
    attempts_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bookmarks: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'progress',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['course_id']
      },
      {
        fields: ['content_id']
      },
      {
        fields: ['enrollment_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['progress_percentage']
      },
      {
        fields: ['started_at']
      },
      {
        fields: ['completed_at']
      },
      {
        unique: true,
        fields: ['user_id', 'content_id']
      }
    ]
  });

  // Instance methods
  Progress.prototype.start = async function() {
    if (this.status === 'not_started') {
      this.status = 'in_progress';
      this.started_at = new Date();
      await this.save();
    }
  };

  Progress.prototype.complete = async function(score = null) {
    this.status = 'completed';
    this.completed_at = new Date();
    this.progress_percentage = 100;
    
    if (score !== null) {
      this.score = score;
    }
    
    await this.save();
  };

  Progress.prototype.updateProgress = async function(percentage, position = null) {
    if (percentage >= 0 && percentage <= 100) {
      this.progress_percentage = percentage;
      
      if (this.status === 'not_started' && percentage > 0) {
        this.status = 'in_progress';
        this.started_at = new Date();
      }
      
      if (percentage >= 100 && this.status !== 'completed') {
        this.status = 'completed';
        this.completed_at = new Date();
      }
      
      if (position) {
        this.last_position = position;
      }
      
      await this.save();
    }
  };

  Progress.prototype.addTimeSpent = async function(seconds) {
    if (seconds > 0) {
      this.time_spent = (this.time_spent || 0) + seconds;
      await this.save();
    }
  };

  Progress.prototype.addBookmark = async function(bookmark) {
    const bookmarks = this.bookmarks || [];
    bookmarks.push({
      ...bookmark,
      created_at: new Date().toISOString()
    });
    
    this.bookmarks = bookmarks;
    await this.save();
  };

  Progress.prototype.removeBookmark = async function(bookmarkId) {
    if (this.bookmarks) {
      this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
      await this.save();
    }
  };

  Progress.prototype.incrementAttempt = async function() {
    this.attempts_count = (this.attempts_count || 0) + 1;
    await this.save();
  };

  // Class methods
  Progress.findByUserAndContent = function(userId, contentId) {
    return this.findOne({
      where: {
        user_id: userId,
        content_id: contentId
      }
    });
  };

  Progress.findByUserAndCourse = function(userId, courseId, options = {}) {
    return this.findAll({
      where: {
        user_id: userId,
        course_id: courseId,
        ...options.where
      },
      ...options
    });
  };

  Progress.findCompletedByUser = function(userId, options = {}) {
    return this.findAll({
      where: {
        user_id: userId,
        status: 'completed',
        ...options.where
      },
      ...options
    });
  };

  Progress.getCourseSummary = async function(userId, courseId) {
    const progress = await this.findAll({
      where: {
        user_id: userId,
        course_id: courseId
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('progress_percentage')), 'avg_progress'],
        [sequelize.fn('SUM', sequelize.col('time_spent')), 'total_time']
      ],
      group: ['status']
    });

    return progress;
  };

  // Define associations
  Progress.associate = function(models) {
    // Progress belongs to user
    Progress.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Progress belongs to course
    Progress.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course'
    });

    // Progress belongs to content
    Progress.belongsTo(models.Content, {
      foreignKey: 'content_id',
      as: 'content'
    });

    // Progress belongs to enrollment
    Progress.belongsTo(models.Enrollment, {
      foreignKey: 'enrollment_id',
      as: 'enrollment'
    });
  };

  return Progress;
};
