module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    subject: {
      type: DataTypes.ENUM(
        'technical_support',
        'account_help',
        'course_question',
        'ai_feedback',
        'bug_report',
        'feature_request',
        'general_inquiry',
        'other'
      ),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 5000]
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'contacts',
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['status']
      },
      {
        fields: ['subject']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['user_id']
      }
    ]
  });

  Contact.associate = function(models) {
    // Optional: Link to user if they're logged in
    Contact.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL'
    });
  };

  // Instance methods
  Contact.prototype.markAsResolved = async function(notes = null) {
    this.status = 'resolved';
    this.resolved_at = new Date();
    if (notes) {
      this.admin_notes = notes;
    }
    await this.save();
  };

  Contact.prototype.markAsInProgress = async function() {
    this.status = 'in_progress';
    await this.save();
  };

  // Class methods
  Contact.findByStatus = function(status) {
    return this.findAll({
      where: { status },
      order: [['created_at', 'DESC']]
    });
  };

  Contact.findByEmail = function(email) {
    return this.findAll({
      where: { email },
      order: [['created_at', 'DESC']]
    });
  };

  Contact.findPending = function() {
    return this.findAll({
      where: { status: 'pending' },
      order: [['priority', 'DESC'], ['created_at', 'ASC']]
    });
  };

  return Contact;
};
