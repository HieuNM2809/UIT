const { Payment, Enrollment, Course, User } = require('../models');
const { Op } = require('sequelize');
const { applicationLogger } = require('../config/logger');
const vietQRService = require('../services/vietQRService');
const emailService = require('../services/emailService');

/**
 * Show payment page with QR code
 */
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      req.flash('error', 'Bạn cần đăng nhập để xem thanh toán');
      return res.redirect('/auth/login');
    }

    const payment = await Payment.findOne({
      where: {
        id: id,
        user_id: userId
      },
      include: [
        {
          model: Course,
          as: 'course'
        },
        {
          model: Enrollment,
          as: 'enrollment',
          attributes: ['id', 'status', 'enrolled_at']
        }
      ]
    });

    if (!payment) {
      req.flash('error', 'Thanh toán không tìm thấy');
      return res.redirect('/dashboard');
    }

    res.locals.currentPath = '/payments';
    res.render('pages/payments/payment', {
      title: 'Thanh toán khóa học',
      payment: payment,
      course: payment.course
    });
  } catch (error) {
    applicationLogger.error('Show payment page error', error, {
      type: 'payment',
      operation: 'show_payment',
      paymentId: req.params.id
    });
    req.flash('error', 'Lỗi khi tải trang thanh toán');
    res.redirect('/dashboard');
  }
};

/**
 * VietQR Callback Handler
 * Called by VietQR when payment is completed
 */
exports.vietQRCallback = async (req, res) => {
  try {
    const { transactionId, status, amount, orderId } = req.body;

    applicationLogger.info('VietQR callback received', {
      type: 'payment',
      operation: 'vietqr_callback',
      transactionId: transactionId,
      status: status,
      orderId: orderId
    });

    // Find payment by transaction ID or enrollment ID
    const payment = await Payment.findOne({
      where: {
        [Op.or]: [
          { vietqr_transaction_id: transactionId },
          { enrollment_id: orderId }
        ]
      },
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            {
              model: Course,
              as: 'course'
            },
            {
              model: User,
              as: 'user'
            }
          ]
        }
      ]
    });

    if (!payment) {
      applicationLogger.warn('Payment not found for VietQR callback', {
        type: 'payment',
        operation: 'vietqr_callback_not_found',
        transactionId: transactionId,
        orderId: orderId
      });
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Update payment status
    if (status === 'success' || status === 'completed') {
      payment.status = 'completed';
      payment.paid_at = new Date();
      await payment.save();

      // Update enrollment status to 'pending' (waiting for admin approval)
      const enrollment = payment.enrollment;
      enrollment.status = 'pending';
      await enrollment.save();

      applicationLogger.info('Payment completed - Enrollment pending approval', {
        type: 'payment',
        operation: 'payment_completed',
        paymentId: payment.id,
        enrollmentId: enrollment.id,
        userId: enrollment.user_id
      });

      // Notify admin about new pending enrollment (optional)
      // You can add admin notification here

      return res.json({
        success: true,
        message: 'Payment verified. Enrollment is pending admin approval.'
      });
    } else if (status === 'failed' || status === 'cancelled') {
      payment.status = status === 'failed' ? 'failed' : 'cancelled';
      await payment.save();

      return res.json({
        success: true,
        message: 'Payment status updated'
      });
    }

    res.json({ success: true });
  } catch (error) {
    applicationLogger.error('VietQR callback error', error, {
      type: 'payment',
      operation: 'vietqr_callback_error'
    });
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Check payment status
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const payment = await Payment.findOne({
      where: {
        id: paymentId,
        user_id: userId
      },
      include: [
        {
          model: Enrollment,
          as: 'enrollment'
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Note: VietQR doesn't support status check endpoint
    // Payment status is updated via webhook callback only
    // We'll just return the current status from database

    res.json({
      success: true,
      data: {
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          paid_at: payment.paid_at,
          enrollment: {
            id: payment.enrollment.id,
            status: payment.enrollment.status
          }
        }
      }
    });
  } catch (error) {
    applicationLogger.error('Check payment status error', error, {
      type: 'payment',
      operation: 'check_payment_status_error',
      paymentId: req.params.paymentId
    });
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra trạng thái thanh toán'
    });
  }
};

