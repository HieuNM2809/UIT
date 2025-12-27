module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quiz_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'quizzes',
        key: 'id'
      }
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_type: {
      type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer', 'essay'),
      allowNull: false
    },
    points: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 1
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'questions'
  });

  Question.associate = function(models) {
    Question.belongsTo(models.Quiz, { foreignKey: 'quiz_id' });
    Question.hasMany(models.Answer, { foreignKey: 'question_id', as: 'answers' });
    Question.hasMany(models.UserAnswer, { foreignKey: 'question_id' });
  };

  return Question;
};
