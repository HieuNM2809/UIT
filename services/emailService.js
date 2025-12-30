const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // If email config is not set, return null (email won't be sent)
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration not found. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send password reset email
 */
exports.sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // In development, log the reset URL instead of sending email
      console.log('\n=== PASSWORD RESET EMAIL (Development Mode) ===');
      console.log('To:', email);
      console.log('Reset URL:', resetUrl);
      console.log('Token:', resetToken);
      console.log('===============================================\n');
      return { success: true, message: 'Reset link logged to console (development mode)' };
    }

    const mailOptions = {
      from: `"StudyMate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Đặt lại mật khẩu StudyMate',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>StudyMate</h1>
              <p>Đặt lại mật khẩu</p>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản StudyMate của bạn.</p>
              <p>Nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
              </div>
              <p>Hoặc sao chép và dán link sau vào trình duyệt:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <div class="warning">
                <strong>Lưu ý:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Link này chỉ có hiệu lực trong 1 giờ</li>
                  <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                  <li>Để bảo mật, không chia sẻ link này với bất kỳ ai</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
              <p>&copy; ${new Date().getFullYear()} StudyMate. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Đặt lại mật khẩu StudyMate
        
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
        
        Nhấp vào link sau để đặt lại mật khẩu:
        ${resetUrl}
        
        Link này chỉ có hiệu lực trong 1 giờ.
        
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    
    // Log the reset URL as fallback if email fails
    console.log('\n=== PASSWORD RESET EMAIL FAILED - FALLBACK ===');
    console.log('Email sending failed. Use this link to reset password:');
    console.log('To:', email);
    console.log('Reset URL:', resetUrl);
    console.log('Token:', resetToken);
    console.log('===============================================\n');
    
    // Return success anyway (security best practice - don't reveal email issues)
    // The link is logged to console for development/testing
    return { 
      success: true, 
      message: 'Email sending failed, but reset link logged to console',
      error: error.message 
    };
  }
};

/**
 * Send password reset success email
 */
exports.sendPasswordResetSuccessEmail = async (email) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Password reset successful for:', email);
      return { success: true };
    }

    const mailOptions = {
      from: `"StudyMate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mật khẩu đã được đặt lại thành công',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Mật khẩu đã được đặt lại</h1>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Mật khẩu của bạn đã được đặt lại thành công.</p>
              <div class="warning">
                <strong>Nếu bạn không thực hiện thao tác này:</strong>
                <p>Vui lòng liên hệ với chúng tôi ngay lập tức để bảo vệ tài khoản của bạn.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} StudyMate. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset success email:', error.message);
    // Don't fail the reset process if success email fails
    return { success: false, error: error.message };
  }
};
