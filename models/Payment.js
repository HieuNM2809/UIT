module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    enrollment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'enrollments', key: 'id' }
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('vietqr', 'bank_transfer', 'other'),
      defaultValue: 'vietqr'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending'
    },
    vietqr_transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vietqr_qr_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vietqr_deep_link: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true
  });

  Payment.associate = function(models) {
    Payment.belongsTo(models.Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
    Payment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Payment.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  };

  return Payment;
};

