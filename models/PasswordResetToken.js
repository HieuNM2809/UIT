module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'password_reset_tokens',
    indexes: [
      { fields: ['token'] },
      { fields: ['user_id'] },
      { fields: ['expires_at'] }
    ],
    hooks: {
      beforeCreate: (token) => {
        // Set expiration to 1 hour from now
        if (!token.expires_at) {
          token.expires_at = new Date(Date.now() + 60 * 60 * 1000);
        }
      }
    }
  });

  PasswordResetToken.associate = function(models) {
    PasswordResetToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  // Instance method to check if token is valid
  PasswordResetToken.prototype.isValid = function() {
    return !this.used && new Date() < this.expires_at;
  };

  // Static method to generate token
  PasswordResetToken.generateToken = function() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  };

  // Static method to find valid token
  PasswordResetToken.findValidToken = function(token) {
    const { Op } = require('sequelize');
    return this.findOne({
      where: {
        token: token,
        used: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'user'
        }
      ]
    });
  };

  return PasswordResetToken;
};
