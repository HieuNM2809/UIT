const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { applicationLogger } = require('../config/logger');

/**
 * Certificate Service
 * Generates PDF certificates for course completion
 */
class CertificateService {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../uploads/certificates');
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    try {
      await fs.mkdir(this.certificatesDir, { recursive: true });
    } catch (error) {
      applicationLogger.error('Failed to create certificates directory', error, {
        type: 'certificate',
        operation: 'ensure_directory'
      });
    }
  }

  /**
   * Download font from URL
   * @param {string} url - Font URL
   * @returns {Promise<Uint8Array>} Font bytes
   */
  async downloadFont(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            return this.downloadFont(redirectUrl).then(resolve).catch(reject);
          }
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download font: ${response.statusCode} ${response.statusMessage}`));
          return;
        }
        
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          if (chunks.length === 0) {
            reject(new Error('Font file is empty'));
            return;
          }
          resolve(Buffer.concat(chunks));
        });
        response.on('error', reject);
      });
      
      request.on('error', reject);
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Font download timeout'));
      });
    });
  }

  /**
   * Generate PDF certificate
   * @param {Object} data - Certificate data
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generatePDF(data) {
    try {
      const {
        studentName,
        courseTitle,
        certificateNumber,
        issuedDate,
        instructorName
      } = data;

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]); // A4 landscape
      const { width, height } = page.getSize();

      // Try to load local fonts first, then fallback to a simplified approach
      let unicodeFont, unicodeFontBold;
      
      try {
        // Try to load local font files first
        const localFontPath = path.join(__dirname, '../public/fonts/NotoSans-Regular.ttf');
        const localBoldFontPath = path.join(__dirname, '../public/fonts/NotoSans-Bold.ttf');
        
        try {
          const notoSansBytes = await fs.readFile(localFontPath);
          const notoSansBoldBytes = await fs.readFile(localBoldFontPath);
          
          unicodeFont = await pdfDoc.embedFont(notoSansBytes);
          unicodeFontBold = await pdfDoc.embedFont(notoSansBoldBytes);
          
          applicationLogger.info('Local Unicode fonts loaded successfully', {
            type: 'certificate',
            operation: 'load_local_fonts_success'
          });
        } catch (localError) {
          applicationLogger.warn('Local fonts not found, creating simplified certificate', {
            type: 'certificate',
            operation: 'load_local_fonts_failed',
            error: localError.message
          });
          
          // Use standard fonts and convert Vietnamese text to ASCII equivalent
          unicodeFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
          unicodeFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        }
      } catch (fontError) {
        // Final fallback
        applicationLogger.warn('Font loading failed, using standard fonts with text conversion', {
          type: 'certificate',
          operation: 'font_loading_failed',
          error: fontError.message
        });
        unicodeFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        unicodeFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      }

      // Load standard fonts for English text
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // Background color (light blue)
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(0.95, 0.97, 1),
      });

      // Border
      page.drawRectangle({
        x: 50,
        y: 50,
        width: width - 100,
        height: height - 100,
        borderColor: rgb(0.2, 0.4, 0.8),
        borderWidth: 3,
      });

      // Decorative border (inner)
      page.drawRectangle({
        x: 70,
        y: 70,
        width: width - 140,
        height: height - 140,
        borderColor: rgb(0.3, 0.5, 0.9),
        borderWidth: 1,
      });

      // Helper function to convert Vietnamese text to ASCII-safe equivalent
      const convertToASCII = (text) => {
        const vietnameseMap = {
          'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
          'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
          'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
          'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
          'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
          'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
          'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
          'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
          'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
          'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
          'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
          'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
          'đ': 'd',
          'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
          'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
          'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
          'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
          'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
          'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
          'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
          'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
          'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
          'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
          'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
          'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
          'Đ': 'D'
        };
        
        return text.replace(/[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]/g, (match) => vietnameseMap[match] || match);
      };

      // Helper function to calculate text width with error handling
      const getTextWidth = (text, fontSize, font) => {
        try {
          // Convert to ASCII if using standard fonts
          const processedText = (font === unicodeFont || font === unicodeFontBold) ? text : convertToASCII(text);
          return font.widthOfTextAtSize(processedText, fontSize);
        } catch (error) {
          // If font doesn't support the text, estimate width based on character count
          const avgCharWidth = fontSize * 0.6; // Rough estimate
          return text.length * avgCharWidth;
        }
      };

      // Helper function to safely draw text
      const safeDrawText = (text, options) => {
        try {
          // Convert to ASCII if using standard fonts
          const processedText = (options.font === unicodeFont || options.font === unicodeFontBold) ? text : convertToASCII(text);
          page.drawText(processedText, options);
        } catch (error) {
          // Fallback: draw ASCII version
          const asciiText = convertToASCII(text);
          page.drawText(asciiText, { ...options, font: unicodeFont });
        }
      };

      // Title - Main heading (centered, top)
      const titleText = 'CHUNG CHI HOAN THANH KHOA HOC';
      const titleWidth = getTextWidth(titleText, 28, unicodeFontBold);
      safeDrawText(titleText, {
        x: width / 2 - titleWidth / 2,
        y: height - 100,
        size: 28,
        font: unicodeFontBold,
        color: rgb(0.2, 0.4, 0.8),
      });

      // Certificate of Completion text (subtitle)
      const certText = 'CERTIFICATE OF COMPLETION';
      const certTextWidth = getTextWidth(certText, 14, timesRoman);
      page.drawText(certText, {
        x: width / 2 - certTextWidth / 2,
        y: height - 140,
        size: 14,
        font: timesRoman,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Spacing line
      page.drawLine({
        start: { x: width / 2 - 100, y: height - 180 },
        end: { x: width / 2 + 100, y: height - 180 },
        thickness: 1,
        color: rgb(0.3, 0.5, 0.9),
      });

      // This is to certify that (centered)
      const certifyText = 'Day la de xac nhan rang';
      const certifyTextWidth = getTextWidth(certifyText, 13, unicodeFont);
      safeDrawText(certifyText, {
        x: width / 2 - certifyTextWidth / 2,
        y: height - 220,
        size: 13,
        font: unicodeFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Student name (centered, prominent)
      const studentNameWidth = getTextWidth(studentName, 32, unicodeFontBold);
      safeDrawText(studentName, {
        x: width / 2 - studentNameWidth / 2,
        y: height - 280,
        size: 32,
        font: unicodeFontBold,
        color: rgb(0, 0, 0),
      });

      // Has successfully completed (centered)
      const completedText = 'da hoan thanh thanh cong khoa hoc';
      const completedTextWidth = getTextWidth(completedText, 13, unicodeFont);
      safeDrawText(completedText, {
        x: width / 2 - completedTextWidth / 2,
        y: height - 320,
        size: 13,
        font: unicodeFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Course title (centered, highlighted)
      const courseTitleWidth = getTextWidth(courseTitle, 22, unicodeFontBold);
      safeDrawText(courseTitle, {
        x: width / 2 - courseTitleWidth / 2,
        y: height - 370,
        size: 22,
        font: unicodeFontBold,
        color: rgb(0.2, 0.4, 0.8),
      });

      // Bottom section - Left side (Date and Instructor)
      // Date
      const dateText = `Ngay cap: ${issuedDate}`;
      safeDrawText(dateText, {
        x: 80,
        y: 120,
        size: 11,
        font: unicodeFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Instructor label
      if (instructorName) {
        const instructorLabel = 'Giang vien';
        safeDrawText(instructorLabel, {
          x: 80,
          y: 90,
          size: 11,
          font: unicodeFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        // Instructor name
        const instructorNameWidth = getTextWidth(instructorName, 13, unicodeFontBold);
        safeDrawText(instructorName, {
          x: 80,
          y: 70,
          size: 13,
          font: unicodeFontBold,
          color: rgb(0, 0, 0),
        });
      }

      // Bottom section - Right side (Certificate number and School info)
      // Certificate number
      const certNumText = `So chung chi: ${certificateNumber}`;
      const certNumTextWidth = getTextWidth(certNumText, 11, unicodeFont);
      safeDrawText(certNumText, {
        x: width - certNumTextWidth - 80,
        y: 120,
        size: 11,
        font: unicodeFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      // StudyMate (organization name)
      const studyMateText = 'StudyMate';
      const studyMateTextWidth = getTextWidth(studyMateText, 14, unicodeFontBold);
      safeDrawText(studyMateText, {
        x: width - studyMateTextWidth - 80,
        y: 90,
        size: 14,
        font: unicodeFontBold,
        color: rgb(0.2, 0.4, 0.8),
      });

      // School name 1
      const schoolText1 = 'Truong Dai hoc Cong nghe Thong tin';
      const schoolText1Width = getTextWidth(schoolText1, 8, unicodeFont);
      // Ensure text doesn't overflow - use max width constraint
      const maxRightX = width - 100; // Leave 100px margin on right
      const schoolText1X = Math.min(width - schoolText1Width - 80, maxRightX - schoolText1Width);
      safeDrawText(schoolText1, {
        x: schoolText1X,
        y: 70,
        size: 8,
        font: unicodeFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      // School name 2 - Split into 2 lines if too long
      const schoolText2 = 'Dai hoc Quoc gia TP. Ho Chi Minh';
      const schoolText2Width = getTextWidth(schoolText2, 8, unicodeFont);
      const schoolText2X = Math.min(width - schoolText2Width - 80, maxRightX - schoolText2Width);
      
      // If text is too long, split it
      if (schoolText2X < 100) {
        // Split into 2 lines
        const line1 = 'Dai hoc Quoc gia';
        const line2 = 'TP. Ho Chi Minh';
        const line1Width = getTextWidth(line1, 8, unicodeFont);
        const line2Width = getTextWidth(line2, 8, unicodeFont);
        const line1X = Math.min(width - line1Width - 80, maxRightX - line1Width);
        const line2X = Math.min(width - line2Width - 80, maxRightX - line2Width);
        
        safeDrawText(line1, {
          x: line1X,
          y: 60,
          size: 8,
          font: unicodeFont,
          color: rgb(0.3, 0.3, 0.3),
        });
        safeDrawText(line2, {
          x: line2X,
          y: 50,
          size: 8,
          font: unicodeFont,
          color: rgb(0.3, 0.3, 0.3),
        });
      } else {
        safeDrawText(schoolText2, {
          x: schoolText2X,
          y: 55,
          size: 8,
          font: unicodeFont,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      // Serialize the PDF
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      applicationLogger.error('Failed to generate certificate PDF', error, {
        type: 'certificate',
        operation: 'generate_pdf',
        studentName: data.studentName,
        courseTitle: data.courseTitle
      });
      throw error;
    }
  }

  /**
   * Save certificate PDF to file
   * @param {Buffer} pdfBuffer - PDF buffer
   * @param {String} filename - Filename
   * @returns {Promise<String>} File path
   */
  async savePDF(pdfBuffer, filename) {
    try {
      const filePath = path.join(this.certificatesDir, filename);
      await fs.writeFile(filePath, pdfBuffer);
      return filePath;
    } catch (error) {
      applicationLogger.error('Failed to save certificate PDF', error, {
        type: 'certificate',
        operation: 'save_pdf',
        filename: filename
      });
      throw error;
    }
  }

  /**
   * Generate and save certificate
   * @param {Object} data - Certificate data
   * @returns {Promise<Object>} Certificate info with PDF path
   */
  async generateCertificate(data) {
    try {
      const {
        studentName,
        courseTitle,
        certificateNumber,
        instructorName
      } = data;

      const issuedDate = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generate PDF
      const pdfBuffer = await this.generatePDF({
        studentName,
        courseTitle,
        certificateNumber,
        issuedDate,
        instructorName
      });

      // Save PDF
      const filename = `certificate-${certificateNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      const pdfPath = await this.savePDF(pdfBuffer, filename);

      return {
        pdfBuffer,
        pdfPath,
        filename
      };
    } catch (error) {
      applicationLogger.error('Failed to generate certificate', error, {
        type: 'certificate',
        operation: 'generate_certificate'
      });
      throw error;
    }
  }
}

module.exports = new CertificateService();

