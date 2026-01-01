const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const EmailVerification = sequelize.define('EmailVerification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    otp_code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 }
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'email_verifications',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['email'] },
      { fields: ['otp_code'] },
      { fields: ['expires_at'] },
      { fields: ['is_verified'] }
    ]
  });

  // Generate 6-digit OTP
  EmailVerification.generateOTP = function() {
    return crypto.randomInt(100000, 999999).toString();
  };

  // Check if OTP is valid
  EmailVerification.prototype.isValid = function() {
    return !this.is_verified && 
           this.attempts < 5 && 
           new Date() < this.expires_at;
  };

  // Check if OTP code matches
  EmailVerification.prototype.verifyOTP = function(inputOTP) {
    if (!this.isValid()) {
      return false;
    }
    
    this.attempts += 1;
    
    if (this.otp_code === inputOTP) {
      this.is_verified = true;
      this.verified_at = new Date();
      return true;
    }
    
    return false;
  };

  // Find valid verification by user_id
  EmailVerification.findByUserId = function(userId) {
    return this.findOne({
      where: {
        user_id: userId,
        is_verified: false
      },
      order: [['created_at', 'DESC']]
    });
  };

  // Find valid verification by email
  EmailVerification.findByEmail = function(email) {
    return this.findOne({
      where: {
        email: email.toLowerCase(),
        is_verified: false
      },
      order: [['created_at', 'DESC']]
    });
  };

  EmailVerification.associate = function(models) {
    EmailVerification.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return EmailVerification;
};

