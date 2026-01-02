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

/**
 * Send email verification OTP
 */
exports.sendVerificationOTP = async (email, otpCode, userName = '') => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // In development, log the OTP instead of sending email
      console.log('\n=== EMAIL VERIFICATION OTP (Development Mode) ===');
      console.log('To:', email);
      console.log('OTP Code:', otpCode);
      console.log('Valid for 15 minutes');
      console.log('==================================================\n');
      return { success: true, message: 'OTP logged to console (development mode)' };
    }

    const mailOptions = {
      from: `"StudyMate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Xác nhận email - StudyMate',
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
            .otp-box { background: white; border: 3px solid #667eea; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>StudyMate</h1>
              <p>Xác nhận email</p>
            </div>
            <div class="content">
              <p>Xin chào${userName ? ` ${userName}` : ''},</p>
              <p>Cảm ơn bạn đã đăng ký tài khoản StudyMate!</p>
              <p>Vui lòng sử dụng mã OTP sau để xác nhận email của bạn:</p>
              
              <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Mã xác nhận của bạn:</p>
                <div class="otp-code">${otpCode}</div>
              </div>
              
              <div class="warning">
                <strong>Lưu ý:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Mã OTP này chỉ có hiệu lực trong 15 phút</li>
                  <li>Bạn có tối đa 5 lần thử</li>
                  <li>Không chia sẻ mã này với bất kỳ ai</li>
                  <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</li>
                </ul>
              </div>
              
              <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
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
        Xác nhận email - StudyMate
        
        Xin chào${userName ? ` ${userName}` : ''},
        
        Cảm ơn bạn đã đăng ký tài khoản StudyMate!
        
        Mã xác nhận OTP của bạn: ${otpCode}
        
        Mã này chỉ có hiệu lực trong 15 phút và bạn có tối đa 5 lần thử.
        
        Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification OTP email:', error.message);
    
    // Log the OTP as fallback
    console.log('\n=== EMAIL VERIFICATION OTP FAILED - FALLBACK ===');
    console.log('Email sending failed. OTP Code:', otpCode);
    console.log('To:', email);
    console.log('Valid for 15 minutes');
    console.log('==================================================\n');
    
    return { 
      success: true, 
      message: 'Email sending failed, but OTP logged to console',
      error: error.message 
    };
  }
};

/**
 * Send contact update notification email
 */
exports.sendContactUpdateEmail = async (contact, updates) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // In development, log the update instead of sending email
      console.log('\n=== CONTACT UPDATE EMAIL (Development Mode) ===');
      console.log('To:', contact.email);
      console.log('Contact ID:', contact.id);
      console.log('Updates:', JSON.stringify(updates, null, 2));
      console.log('==================================================\n');
      return { success: true, message: 'Update logged to console (development mode)' };
    }

    const statusMap = {
      'pending': 'Chờ xử lý',
      'in_progress': 'Đang xử lý',
      'resolved': 'Đã giải quyết',
      'closed': 'Đã đóng'
    };

    const priorityMap = {
      'low': 'Thấp',
      'medium': 'Trung bình',
      'high': 'Cao',
      'urgent': 'Khẩn cấp'
    };

    const subjectMap = {
      'technical_support': 'Hỗ trợ kỹ thuật',
      'account_help': 'Trợ giúp tài khoản',
      'course_question': 'Câu hỏi khóa học',
      'ai_feedback': 'Phản hồi AI',
      'bug_report': 'Báo lỗi',
      'feature_request': 'Yêu cầu tính năng',
      'general_inquiry': 'Câu hỏi chung',
      'other': 'Khác'
    };

    // Build update message
    let updateMessage = '';
    if (updates.status) {
      updateMessage += `<p><strong>Trạng thái:</strong> ${statusMap[updates.status] || updates.status}</p>`;
    }
    if (updates.priority) {
      updateMessage += `<p><strong>Mức độ ưu tiên:</strong> ${priorityMap[updates.priority] || updates.priority}</p>`;
    }
    if (updates.admin_notes) {
      updateMessage += `<div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <strong>Ghi chú từ quản trị viên:</strong>
        <p style="margin-top: 10px; white-space: pre-wrap;">${updates.admin_notes}</p>
      </div>`;
    }

    const mailOptions = {
      from: `"StudyMate" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Cập nhật liên hệ: ${subjectMap[contact.subject] || contact.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>StudyMate</h1>
              <p>Cập nhật liên hệ</p>
            </div>
            <div class="content">
              <p>Xin chào <strong>${contact.name}</strong>,</p>
              <p>Chúng tôi đã cập nhật thông tin cho yêu cầu liên hệ của bạn:</p>
              
              <div class="info-box">
                <p><strong>Tiêu đề:</strong> ${subjectMap[contact.subject] || contact.subject}</p>
                <p><strong>Ngày gửi:</strong> ${new Date(contact.created_at).toLocaleString('vi-VN')}</p>
                ${updateMessage}
              </div>

              ${updates.admin_notes ? `
              <div style="background: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Phản hồi từ chúng tôi:</strong></p>
                <p style="white-space: pre-wrap;">${updates.admin_notes}</p>
              </div>
              ` : ''}

              <p>Nếu bạn có thêm câu hỏi hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.</p>
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
        StudyMate - Cập nhật liên hệ
        
        Xin chào ${contact.name},
        
        Chúng tôi đã cập nhật thông tin cho yêu cầu liên hệ của bạn:
        
        Tiêu đề: ${subjectMap[contact.subject] || contact.subject}
        Ngày gửi: ${new Date(contact.created_at).toLocaleString('vi-VN')}
        
        ${updates.status ? `Trạng thái: ${statusMap[updates.status] || updates.status}\n` : ''}
        ${updates.priority ? `Mức độ ưu tiên: ${priorityMap[updates.priority] || updates.priority}\n` : ''}
        ${updates.admin_notes ? `Ghi chú từ quản trị viên:\n${updates.admin_notes}\n` : ''}
        
        Nếu bạn có thêm câu hỏi hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.
        
        ---
        Email này được gửi tự động, vui lòng không trả lời.
        © ${new Date().getFullYear()} StudyMate. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact update email:', error.message);
    // Don't fail the update process if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Send enrollment approval email
 */
exports.sendEnrollmentApprovalEmail = async (email, name, courseTitle, courseUrl) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // In development, log the email instead of sending
      console.log('\n=== ENROLLMENT APPROVAL EMAIL (Development Mode) ===');
      console.log('To:', email);
      console.log('Course:', courseTitle);
      console.log('Course URL:', courseUrl);
      console.log('==================================================\n');
      return { success: true, message: 'Approval email logged to console (development mode)' };
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fullCourseUrl = courseUrl.startsWith('http') ? courseUrl : `${baseUrl}${courseUrl}`;

    const mailOptions = {
      from: `"StudyMate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Đăng ký khóa học "${courseTitle}" đã được duyệt`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Đăng ký đã được duyệt!</h1>
            </div>
            <div class="content">
              <p>Xin chào <strong>${name}</strong>,</p>
              <p>Chúng tôi vui mừng thông báo rằng đăng ký khóa học <strong>"${courseTitle}"</strong> của bạn đã được duyệt thành công!</p>
              <p>Bạn có thể bắt đầu học ngay bây giờ:</p>
              <div style="text-align: center;">
                <a href="${fullCourseUrl}" class="button">Bắt đầu học ngay</a>
              </div>
              <p style="margin-top: 30px;">Chúc bạn học tập hiệu quả!</p>
              <p>Trân trọng,<br>Đội ngũ StudyMate</p>
            </div>
            <div class="footer">
              <p>Email này được gửi tự động từ hệ thống StudyMate.</p>
              <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Send enrollment approval email error:', error);
    throw error;
  }
};