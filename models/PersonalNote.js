module.exports = (sequelize, DataTypes) => {
  const PersonalNote = sequelize.define('PersonalNote', {
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
    content_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'contents',
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
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      validate: {
        len: [0, 10000] // Allow empty string (0 characters), maximum 10000 characters
      }
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'personal_notes',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['content_id']
      },
      {
        fields: ['course_id']
      },
      {
        unique: true,
        fields: ['user_id', 'content_id']
      }
    ]
  });

  PersonalNote.associate = function(models) {
    PersonalNote.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    PersonalNote.belongsTo(models.Content, {
      foreignKey: 'content_id',
      as: 'content'
    });
    PersonalNote.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course'
    });
  };

  return PersonalNote;
};

