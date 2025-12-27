module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    color: DataTypes.STRING,
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'tags'
  });

  Tag.associate = function(models) {
    Tag.belongsToMany(models.Content, {
      through: models.ContentTag,
      foreignKey: 'tag_id',
      otherKey: 'content_id'
    });
  };

  return Tag;
};
