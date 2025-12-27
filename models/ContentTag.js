module.exports = (sequelize, DataTypes) => {
  const ContentTag = sequelize.define('ContentTag', {
    content_id: {
      type: DataTypes.UUID,
      references: { model: 'contents', key: 'id' }
    },
    tag_id: {
      type: DataTypes.UUID,
      references: { model: 'tags', key: 'id' }
    }
  }, {
    tableName: 'content_tags',
    timestamps: false
  });

  return ContentTag;
};
