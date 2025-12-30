module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    reading_time: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'categories', key: 'id' }
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'blogs',
    indexes: [
      { fields: ['slug'] },
      { fields: ['author_id'] },
      { fields: ['status'] },
      { fields: ['category_id'] },
      { fields: ['created_at'] }
    ],
    hooks: {
      beforeValidate: (blog) => {
        if (blog.title && !blog.slug) {
          blog.slug = blog.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        }
        if (blog.content) {
          const wordCount = blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
          blog.reading_time = Math.ceil(wordCount / 200);
        }
        if (blog.content && !blog.excerpt) {
          const plainText = blog.content.replace(/<[^>]*>/g, '').trim();
          blog.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
        }
      }
    }
  });

  Blog.prototype.incrementViewCount = async function() {
    this.view_count = (this.view_count || 0) + 1;
    await this.save();
  };

  Blog.findBySlug = function(slug) {
    return this.findOne({ where: { slug } });
  };

  Blog.findPublished = function(options = {}) {
    return this.findAll({
      where: {
        status: 'published',
        ...options.where
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  };

  Blog.associate = function(models) {
    Blog.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
    Blog.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  };

  return Blog;
};
