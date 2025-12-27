module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filename: { type: DataTypes.STRING, allowNull: false },
    original_name: { type: DataTypes.STRING, allowNull: false },
    mime_type: DataTypes.STRING,
    file_size: DataTypes.BIGINT,
    file_path: DataTypes.STRING,
    url: DataTypes.STRING,
    uploaded_by: {
      type: DataTypes.UUID,
      references: { model: 'users', key: 'id' }
    },
    content_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'contents', key: 'id' }
    },
    file_type: {
      type: DataTypes.ENUM('image', 'video', 'audio', 'document', 'other'),
      defaultValue: 'other'
    },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: false },
    download_count: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, { tableName: 'files' });

  File.associate = function(models) {
    File.belongsTo(models.User, { foreignKey: 'uploaded_by' });
    File.belongsTo(models.Content, { foreignKey: 'content_id' });
  };

  return File;
};
