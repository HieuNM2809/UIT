module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    content_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'contents',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quiz_type: {
      type: DataTypes.ENUM('practice', 'assessment', 'final_exam'),
      allowNull: false,
      defaultValue: 'practice'
    },
    time_limit: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: true
    },
    passing_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 70
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shuffle_questions: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    show_results: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'quizzes'
  });

  Quiz.associate = function(models) {
    Quiz.belongsTo(models.Course, { foreignKey: 'course_id' });
    Quiz.belongsTo(models.Content, { foreignKey: 'content_id' });
    Quiz.hasMany(models.Question, { foreignKey: 'quiz_id', as: 'questions' });
  };

  return Quiz;
};
