/**
 * StudyMate AI - Seed Sample Data Script
 * This script populates the database with sample data for development and testing
 * 
 * Usage: node scripts/seed-data.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Import all models
const {
  User,
  Category,
  Course,
  Enrollment,
  Content,
  Quiz,
  Question,
  Answer,
  Rating,
  Achievement,
  UserAchievement,
  ActivityLog,
  AIInteraction,
  Notification,
  Discussion,
  Comment,
  Progress,
  Tag,
  ContentTag,
  UserAnswer,
  File,
  Contact
} = require('../models');

// Helper function to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

// Sample data
const sampleData = {
  users: [
    // Students
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      student_id: '24410158',
      email: 'nguyen.minh.hieu@student.uit.edu.vn',
      password: 'Password123!',
      first_name: 'Nguyễn',
      last_name: 'Minh Hiếu',
      role: 'student',
      is_active: true,
      phone: '0901234567'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      student_id: '24410183',
      email: 'le.anh.kiet@student.uit.edu.vn',
      password: 'Password123!',
      first_name: 'Lê',
      last_name: 'Anh Kiệt',
      role: 'student',
      is_active: true,
      phone: '0901234568'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      student_id: '24410001',
      email: 'tran.van.a@student.uit.edu.vn',
      password: 'Password123!',
      first_name: 'Trần',
      last_name: 'Văn A',
      role: 'student',
      is_active: true,
      phone: '0901234569'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      student_id: '24410002',
      email: 'nguyen.thi.b@student.uit.edu.vn',
      password: 'Password123!',
      first_name: 'Nguyễn',
      last_name: 'Thị B',
      role: 'student',
      is_active: true,
      phone: '0901234570'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      student_id: '24410003',
      email: 'le.van.c@student.uit.edu.vn',
      password: 'Password123!',
      first_name: 'Lê',
      last_name: 'Văn C',
      role: 'student',
      is_active: true,
      phone: '0901234571'
    },
    // Instructors
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      student_id: null,
      email: 'pham.the.son@uit.edu.vn',
      password: 'Password123!',
      first_name: 'Phạm',
      last_name: 'Thế Sơn',
      role: 'lecturer',
      is_active: true,
      phone: '0901234501'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      student_id: null,
      email: 'nguyen.van.dung@uit.edu.vn',
      password: 'Password123!',
      first_name: 'Nguyễn',
      last_name: 'Văn Dũng',
      role: 'lecturer',
      is_active: true,
      phone: '0901234502'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      student_id: null,
      email: 'tran.thi.hue@uit.edu.vn',
      password: 'Password123!',
      first_name: 'Trần',
      last_name: 'Thị Huệ',
      role: 'lecturer',
      is_active: true,
      phone: '0901234503'
    },
    // Admin
    {
      id: '550e8400-e29b-41d4-a716-446655440020',
      student_id: null,
      email: 'admin@studymate.uit.edu.vn',
      password: 'Password123!',
      first_name: 'System',
      last_name: 'Administrator',
      role: 'admin',
      is_active: true,
      phone: '0901234500'
    }
  ],

  categories: [
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Lập trình',
      slug: 'lap-trinh',
      description: 'Các khóa học về lập trình và phát triển phần mềm',
      icon: 'code',
      color: '#3B82F6',
      parent_id: null,
      order_index: 1,
      is_active: true,
      course_count: 0
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Cơ sở dữ liệu',
      slug: 'co-so-du-lieu',
      description: 'Các khóa học về quản lý và thiết kế cơ sở dữ liệu',
      icon: 'database',
      color: '#10B981',
      parent_id: null,
      order_index: 2,
      is_active: true,
      course_count: 0
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Mạng máy tính',
      slug: 'mang-may-tinh',
      description: 'Các khóa học về mạng và bảo mật',
      icon: 'network',
      color: '#F59E0B',
      parent_id: null,
      order_index: 3,
      is_active: true,
      course_count: 0
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440004',
      name: 'Trí tuệ nhân tạo',
      slug: 'tri-tue-nhan-tao',
      description: 'Các khóa học về AI và Machine Learning',
      icon: 'brain',
      color: '#8B5CF6',
      parent_id: null,
      order_index: 4,
      is_active: true,
      course_count: 0
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440011',
      name: 'Web Development',
      slug: 'web-development',
      description: 'Lập trình web frontend và backend',
      icon: 'globe',
      color: '#3B82F6',
      parent_id: '660e8400-e29b-41d4-a716-446655440001',
      order_index: 1,
      is_active: true,
      course_count: 0
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440012',
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Lập trình ứng dụng di động',
      icon: 'mobile',
      color: '#3B82F6',
      parent_id: '660e8400-e29b-41d4-a716-446655440001',
      order_index: 2,
      is_active: true,
      course_count: 0
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440013',
      name: 'Algorithms & Data Structures',
      slug: 'algorithms-data-structures',
      description: 'Thuật toán và cấu trúc dữ liệu',
      icon: 'algorithm',
      color: '#3B82F6',
      parent_id: '660e8400-e29b-41d4-a716-446655440001',
      order_index: 3,
      is_active: true,
      course_count: 0
    }
  ],

  courses: [
    {
      id: '770e8400-e29b-41d4-a716-446655440001',
      title: 'Lập trình Web với React',
      slug: 'lap-trinh-web-voi-react',
      description: 'Khóa học toàn diện về React, từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React, Hooks, Redux và các công nghệ liên quan.',
      short_description: 'Học React từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440010',
      level: 'intermediate',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440011',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440002',
      title: 'Node.js và Express.js',
      slug: 'nodejs-va-expressjs',
      description: 'Khóa học về backend development với Node.js và Express.js. Học cách xây dựng RESTful API, authentication, và các best practices.',
      short_description: 'Xây dựng backend server với Node.js và Express.js',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440011',
      level: 'intermediate',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440011',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440003',
      title: 'Cơ sở dữ liệu nâng cao',
      slug: 'co-so-du-lieu-nang-cao',
      description: 'Khóa học về thiết kế và tối ưu hóa cơ sở dữ liệu. Học về indexing, query optimization, transactions, và database design patterns.',
      short_description: 'Thiết kế và tối ưu hóa cơ sở dữ liệu PostgreSQL',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440011',
      level: 'advanced',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440002',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440004',
      title: 'SQL Cơ bản cho Người mới bắt đầu',
      slug: 'sql-co-ban-cho-nguoi-moi-bat-dau',
      description: 'Khóa học SQL từ đầu, phù hợp cho người mới bắt đầu. Học các câu lệnh SELECT, INSERT, UPDATE, DELETE và các hàm SQL cơ bản.',
      short_description: 'Học SQL từ cơ bản, các câu lệnh và truy vấn cơ bản',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440012',
      level: 'beginner',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440002',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440005',
      title: 'Machine Learning cơ bản',
      slug: 'machine-learning-co-ban',
      description: 'Khóa học giới thiệu về Machine Learning, các thuật toán cơ bản như Linear Regression, Classification, và cách sử dụng scikit-learn.',
      short_description: 'Giới thiệu Machine Learning và các thuật toán cơ bản',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440010',
      level: 'beginner',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440004',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440006',
      title: 'Deep Learning với TensorFlow',
      slug: 'deep-learning-voi-tensorflow',
      description: 'Khóa học nâng cao về Deep Learning, Neural Networks, và cách sử dụng TensorFlow để xây dựng các mô hình AI phức tạp.',
      short_description: 'Deep Learning và Neural Networks với TensorFlow',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440010',
      level: 'expert',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440004',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440007',
      title: 'Thuật toán và Cấu trúc dữ liệu',
      slug: 'thuat-toan-va-cau-truc-du-lieu',
      description: 'Khóa học về các thuật toán cơ bản và nâng cao, cấu trúc dữ liệu như Array, Linked List, Tree, Graph và cách áp dụng trong thực tế.',
      short_description: 'Học thuật toán và cấu trúc dữ liệu từ cơ bản',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440012',
      level: 'intermediate',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440013',
      enrolled_count: 0,
      average_rating: null
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440008',
      title: 'An toàn thông tin',
      slug: 'an-toan-thong-tin',
      description: 'Khóa học về bảo mật thông tin, cryptography, network security, và các kỹ thuật bảo vệ hệ thống khỏi các mối đe dọa.',
      short_description: 'Bảo mật thông tin và an ninh mạng',
      thumbnail: null,
      instructor_id: '550e8400-e29b-41d4-a716-446655440011',
      level: 'intermediate',
      price: 0.00,
      status: 'published',
      is_public: true,
      category_id: '660e8400-e29b-41d4-a716-446655440003',
      enrolled_count: 0,
      average_rating: null
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu mẫu...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công\n');

    // Hash passwords for users
    console.log('🔐 Đang hash passwords...');
    for (const user of sampleData.users) {
      user.password = await hashPassword(user.password);
    }
    console.log('✅ Hash passwords hoàn tất\n');

    // Seed Users
    console.log('👥 Đang tạo users...');
    for (const userData of sampleData.users) {
      await User.findOrCreate({
        where: { id: userData.id },
        defaults: userData
      });
    }
    console.log(`✅ Đã tạo ${sampleData.users.length} users\n`);

    // Seed Categories
    console.log('📁 Đang tạo categories...');
    for (const categoryData of sampleData.categories) {
      await Category.findOrCreate({
        where: { id: categoryData.id },
        defaults: categoryData
      });
    }
    console.log(`✅ Đã tạo ${sampleData.categories.length} categories\n`);

    // Seed Courses
    console.log('📚 Đang tạo courses...');
    for (const courseData of sampleData.courses) {
      await Course.findOrCreate({
        where: { id: courseData.id },
        defaults: courseData
      });
    }
    console.log(`✅ Đã tạo ${sampleData.courses.length} courses\n`);

    // Seed Enrollments
    console.log('🎓 Đang tạo enrollments...');
    const enrollments = [
      { user_id: '550e8400-e29b-41d4-a716-446655440001', course_id: '770e8400-e29b-41d4-a716-446655440001', status: 'active', progress_percentage: 65.50, total_time_spent: 1800 },
      { user_id: '550e8400-e29b-41d4-a716-446655440001', course_id: '770e8400-e29b-41d4-a716-446655440003', status: 'active', progress_percentage: 45.00, total_time_spent: 1200 },
      { user_id: '550e8400-e29b-41d4-a716-446655440001', course_id: '770e8400-e29b-41d4-a716-446655440005', status: 'completed', progress_percentage: 100.00, total_time_spent: 3600 },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', course_id: '770e8400-e29b-41d4-a716-446655440002', status: 'active', progress_percentage: 78.25, total_time_spent: 2100 },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', course_id: '770e8400-e29b-41d4-a716-446655440007', status: 'active', progress_percentage: 30.00, total_time_spent: 900 },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', course_id: '770e8400-e29b-41d4-a716-446655440004', status: 'completed', progress_percentage: 100.00, total_time_spent: 2400 },
      { user_id: '550e8400-e29b-41d4-a716-446655440003', course_id: '770e8400-e29b-41d4-a716-446655440001', status: 'active', progress_percentage: 15.00, total_time_spent: 450 },
      { user_id: '550e8400-e29b-41d4-a716-446655440003', course_id: '770e8400-e29b-41d4-a716-446655440005', status: 'active', progress_percentage: 8.50, total_time_spent: 300 },
      { user_id: '550e8400-e29b-41d4-a716-446655440004', course_id: '770e8400-e29b-41d4-a716-446655440003', status: 'active', progress_percentage: 55.75, total_time_spent: 1500 },
      { user_id: '550e8400-e29b-41d4-a716-446655440004', course_id: '770e8400-e29b-41d4-a716-446655440008', status: 'active', progress_percentage: 40.00, total_time_spent: 1100 },
      { user_id: '550e8400-e29b-41d4-a716-446655440005', course_id: '770e8400-e29b-41d4-a716-446655440006', status: 'active', progress_percentage: 25.00, total_time_spent: 750 },
      { user_id: '550e8400-e29b-41d4-a716-446655440005', course_id: '770e8400-e29b-41d4-a716-446655440007', status: 'pending', progress_percentage: 0.00, total_time_spent: 0 }
    ];

    for (const enrollmentData of enrollments) {
      await Enrollment.findOrCreate({
        where: {
          user_id: enrollmentData.user_id,
          course_id: enrollmentData.course_id
        },
        defaults: {
          ...enrollmentData,
          enrolled_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          last_accessed: enrollmentData.status === 'active' ? new Date() : null
        }
      });
    }
    console.log(`✅ Đã tạo ${enrollments.length} enrollments\n`);

    // Seed Contents
    console.log('📄 Đang tạo contents...');
    const contents = [
      { course_id: '770e8400-e29b-41d4-a716-446655440001', title: 'Giới thiệu về React', slug: 'gioi-thieu-ve-react', content_type: 'lesson', order_index: 1, is_free: true, status: 'published', estimated_duration: 15 },
      { course_id: '770e8400-e29b-41d4-a716-446655440001', title: 'Components và Props', slug: 'components-va-props', content_type: 'lesson', order_index: 2, is_free: true, status: 'published', estimated_duration: 20 },
      { course_id: '770e8400-e29b-41d4-a716-446655440001', title: 'State và Hooks', slug: 'state-va-hooks', content_type: 'video', order_index: 3, is_free: true, status: 'published', estimated_duration: 25 },
      { course_id: '770e8400-e29b-41d4-a716-446655440002', title: 'Giới thiệu Node.js', slug: 'gioi-thieu-nodejs', content_type: 'lesson', order_index: 1, is_free: true, status: 'published', estimated_duration: 20 },
      { course_id: '770e8400-e29b-41d4-a716-446655440003', title: 'Thiết kế Database Schema', slug: 'thiet-ke-database-schema', content_type: 'lesson', order_index: 1, is_free: true, status: 'published', estimated_duration: 25 },
      { course_id: '770e8400-e29b-41d4-a716-446655440004', title: 'SQL SELECT cơ bản', slug: 'sql-select-co-ban', content_type: 'lesson', order_index: 1, is_free: true, status: 'published', estimated_duration: 15 }
    ];

    for (const contentData of contents) {
      await Content.findOrCreate({
        where: {
          course_id: contentData.course_id,
          slug: contentData.slug
        },
        defaults: {
          ...contentData,
          description: `Bài học về ${contentData.title}`,
          body: `<h2>${contentData.title}</h2><p>Nội dung bài học...</p>`
        }
      });
    }
    console.log(`✅ Đã tạo ${contents.length} contents\n`);

    // Seed Ratings
    console.log('⭐ Đang tạo ratings...');
    const ratings = [
      { user_id: '550e8400-e29b-41d4-a716-446655440001', course_id: '770e8400-e29b-41d4-a716-446655440001', rating: 5, review: 'Khóa học rất hay, giảng viên giải thích rõ ràng!', is_verified: true },
      { user_id: '550e8400-e29b-41d4-a716-446655440001', course_id: '770e8400-e29b-41d4-a716-446655440005', rating: 5, review: 'Nội dung phong phú, dễ hiểu cho người mới bắt đầu', is_verified: true },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', course_id: '770e8400-e29b-41d4-a716-446655440002', rating: 4, review: 'Tốt nhưng cần thêm ví dụ thực tế', is_verified: true },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', course_id: '770e8400-e29b-41d4-a716-446655440004', rating: 5, review: 'Khóa học SQL rất hữu ích!', is_verified: true }
    ];

    for (const ratingData of ratings) {
      await Rating.findOrCreate({
        where: {
          user_id: ratingData.user_id,
          course_id: ratingData.course_id
        },
        defaults: ratingData
      });
    }
    console.log(`✅ Đã tạo ${ratings.length} ratings\n`);

    // Update course counts and ratings
    console.log('🔄 Đang cập nhật thống kê...');
    const categories = await Category.findAll();
    for (const category of categories) {
      const count = await Course.count({ where: { category_id: category.id } });
      await category.update({ course_count: count });
    }

    const courses = await Course.findAll();
    for (const course of courses) {
      const enrolledCount = await Enrollment.count({ where: { course_id: course.id, status: 'active' } });
      const avgRating = await Rating.findOne({
        where: { course_id: course.id },
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg']],
        raw: true
      });
      await course.update({
        enrolled_count: enrolledCount,
        average_rating: avgRating?.avg ? parseFloat(avgRating.avg).toFixed(2) : null
      });
    }
    console.log('✅ Cập nhật thống kê hoàn tất\n');

    console.log('🎉 Seed dữ liệu mẫu hoàn tất!');
    console.log('\n📝 Thông tin đăng nhập:');
    console.log('   Email: nguyen.minh.hieu@student.uit.edu.vn');
    console.log('   Password: Password123!');
    console.log('\n   Email: admin@studymate.uit.edu.vn');
    console.log('   Password: Password123!');

  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✅ Hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
