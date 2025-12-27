module.exports = (sequelize, DataTypes) => {
  const UserAnswer = sequelize.define('UserAnswer', {
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
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'questions', key: 'id' }
    },
    answer_text: { type: DataTypes.TEXT },
    selected_answer_id: {
      type: DataTypes.UUID,
      references: { model: 'answers', key: 'id' }
    },
    is_correct: { type: DataTypes.BOOLEAN },
    points_earned: { type: DataTypes.DECIMAL(5, 2) },
    time_spent: { type: DataTypes.INTEGER }
  }, { tableName: 'user_answers' });

  UserAnswer.associate = function(models) {
    UserAnswer.belongsTo(models.User, { foreignKey: 'user_id' });
    UserAnswer.belongsTo(models.Question, { foreignKey: 'question_id' });
    UserAnswer.belongsTo(models.Answer, { foreignKey: 'selected_answer_id' });
  };

  return UserAnswer;
};
