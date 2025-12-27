module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^#[0-9A-Fa-f]{6}$/
      }
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    course_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'categories',
    indexes: [
      {
        fields: ['slug']
      },
      {
        fields: ['parent_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['order_index']
      }
    ],
    hooks: {
      beforeValidate: (category, options) => {
        if (category.name && !category.slug) {
          category.slug = category.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        }
      }
    }
  });

  // Instance methods
  Category.prototype.incrementCourseCount = async function() {
    this.course_count = (this.course_count || 0) + 1;
    await this.save();
  };

  Category.prototype.decrementCourseCount = async function() {
    if (this.course_count > 0) {
      this.course_count = this.course_count - 1;
      await this.save();
    }
  };

  // Class methods
  Category.findBySlug = function(slug) {
    return this.findOne({ where: { slug } });
  };

  Category.findActive = function(options = {}) {
    return this.findAll({
      where: {
        is_active: true,
        ...options.where
      },
      order: [['order_index', 'ASC'], ['name', 'ASC']],
      ...options
    });
  };

  Category.findRootCategories = function(options = {}) {
    return this.findAll({
      where: {
        parent_id: null,
        is_active: true,
        ...options.where
      },
      order: [['order_index', 'ASC'], ['name', 'ASC']],
      ...options
    });
  };

  // Define associations
  Category.associate = function(models) {
    // Self-referencing relationship for parent/child categories
    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'children'
    });

    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parent'
    });

    // Category has many courses
    Category.hasMany(models.Course, {
      foreignKey: 'category_id',
      as: 'courses'
    });
  };

  return Category;
};
