module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
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
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'courses', key: 'id' }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    review: DataTypes.TEXT,
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'ratings'
  });

  Rating.associate = function(models) {
    Rating.belongsTo(models.User, { foreignKey: 'user_id' });
    Rating.belongsTo(models.Course, { foreignKey: 'course_id' });
  };

  return Rating;
};
