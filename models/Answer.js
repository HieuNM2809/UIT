module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'id'
      }
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'answers'
  });

  Answer.associate = function(models) {
    Answer.belongsTo(models.Question, { foreignKey: 'question_id' });
  };

  return Answer;
};
