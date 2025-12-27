-- StudyMate AI - Sample Data SQL Script
-- This script inserts sample data for testing and development
-- Run this after creating all tables with migrations

-- ============================================
-- 1. USERS (Students, Instructors, Admins)
-- ============================================
-- Password for all users: "Password123!" (hashed with bcrypt)

INSERT INTO users (id, student_id, email, password, first_name, last_name, role, is_active, phone, created_at, updated_at) VALUES
-- Students
('550e8400-e29b-41d4-a716-446655440001', '24410158', 'nguyen.minh.hieu@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Nguyễn', 'Minh Hiếu', 'student', true, '0901234567', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', '24410183', 'le.anh.kiet@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Lê', 'Anh Kiệt', 'student', true, '0901234568', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', '24410001', 'tran.van.a@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Trần', 'Văn A', 'student', true, '0901234569', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', '24410002', 'nguyen.thi.b@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Nguyễn', 'Thị B', 'student', true, '0901234570', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', '24410003', 'le.van.c@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Lê', 'Văn C', 'student', true, '0901234571', NOW(), NOW()),

-- Instructors/Lecturers
('550e8400-e29b-41d4-a716-446655440010', NULL, 'pham.the.son@uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Phạm', 'Thế Sơn', 'lecturer', true, '0901234501', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', NULL, 'nguyen.van.dung@uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Nguyễn', 'Văn Dũng', 'lecturer', true, '0901234502', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', NULL, 'tran.thi.hue@uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Trần', 'Thị Huệ', 'lecturer', true, '0901234503', NOW(), NOW()),

-- Admin
('550e8400-e29b-41d4-a716-446655440020', NULL, 'admin@studymate.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'System', 'Administrator', 'admin', true, '0901234500', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CATEGORIES
-- ============================================
INSERT INTO categories (id, name, slug, description, icon, color, parent_id, order_index, is_active, course_count, metadata, created_at, updated_at) VALUES
-- Root Categories
('660e8400-e29b-41d4-a716-446655440001', 'Lập trình', 'lap-trinh', 'Các khóa học về lập trình và phát triển phần mềm', 'code', '#3B82F6', NULL, 1, true, 0, '{}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Cơ sở dữ liệu', 'co-so-du-lieu', 'Các khóa học về quản lý và thiết kế cơ sở dữ liệu', 'database', '#10B981', NULL, 2, true, 0, '{}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Mạng máy tính', 'mang-may-tinh', 'Các khóa học về mạng và bảo mật', 'network', '#F59E0B', NULL, 3, true, 0, '{}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Trí tuệ nhân tạo', 'tri-tue-nhan-tao', 'Các khóa học về AI và Machine Learning', 'brain', '#8B5CF6', NULL, 4, true, 0, '{}', NOW(), NOW()),

-- Sub-categories (Lập trình)
('660e8400-e29b-41d4-a716-446655440011', 'Web Development', 'web-development', 'Lập trình web frontend và backend', 'globe', '#3B82F6', '660e8400-e29b-41d4-a716-446655440001', 1, true, 0, '{}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440012', 'Mobile Development', 'mobile-development', 'Lập trình ứng dụng di động', 'mobile', '#3B82F6', '660e8400-e29b-41d4-a716-446655440001', 2, true, 0, '{}', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440013', 'Algorithms & Data Structures', 'algorithms-data-structures', 'Thuật toán và cấu trúc dữ liệu', 'algorithm', '#3B82F6', '660e8400-e29b-41d4-a716-446655440001', 3, true, 0, '{}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. COURSES
-- ============================================
INSERT INTO courses (id, title, slug, description, short_description, thumbnail, instructor_id, level, price, status, is_public, category_id, enrolled_count, average_rating, created_at, updated_at) VALUES
-- Web Development Courses
('770e8400-e29b-41d4-a716-446655440001', 
 'Lập trình Web với React', 
 'lap-trinh-web-voi-react',
 'Khóa học toàn diện về React, từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React, Hooks, Redux và các công nghệ liên quan.',
 'Học React từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại',
 NULL,
 '550e8400-e29b-41d4-a716-446655440010',
 'intermediate',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440011',
 150,
 4.5,
 NOW(),
 NOW()),

('770e8400-e29b-41d4-a716-446655440002',
 'Node.js và Express.js',
 'nodejs-va-expressjs',
 'Khóa học về backend development với Node.js và Express.js. Học cách xây dựng RESTful API, authentication, và các best practices.',
 'Xây dựng backend server với Node.js và Express.js',
 NULL,
 '550e8400-e29b-41d4-a716-446655440011',
 'intermediate',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440011',
 120,
 4.6,
 NOW(),
 NOW()),

-- Database Courses
('770e8400-e29b-41d4-a716-446655440003',
 'Cơ sở dữ liệu nâng cao',
 'co-so-du-lieu-nang-cao',
 'Khóa học về thiết kế và tối ưu hóa cơ sở dữ liệu. Học về indexing, query optimization, transactions, và database design patterns.',
 'Thiết kế và tối ưu hóa cơ sở dữ liệu PostgreSQL',
 NULL,
 '550e8400-e29b-41d4-a716-446655440011',
 'advanced',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440002',
 90,
 4.7,
 NOW(),
 NOW()),

('770e8400-e29b-41d4-a716-446655440004',
 'SQL Cơ bản cho Người mới bắt đầu',
 'sql-co-ban-cho-nguoi-moi-bat-dau',
 'Khóa học SQL từ đầu, phù hợp cho người mới bắt đầu. Học các câu lệnh SELECT, INSERT, UPDATE, DELETE và các hàm SQL cơ bản.',
 'Học SQL từ cơ bản, các câu lệnh và truy vấn cơ bản',
 NULL,
 '550e8400-e29b-41d4-a716-446655440012',
 'beginner',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440002',
 200,
 4.4,
 NOW(),
 NOW()),

-- AI/ML Courses
('770e8400-e29b-41d4-a716-446655440005',
 'Machine Learning cơ bản',
 'machine-learning-co-ban',
 'Khóa học giới thiệu về Machine Learning, các thuật toán cơ bản như Linear Regression, Classification, và cách sử dụng scikit-learn.',
 'Giới thiệu Machine Learning và các thuật toán cơ bản',
 NULL,
 '550e8400-e29b-41d4-a716-446655440010',
 'beginner',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440004',
 180,
 4.6,
 NOW(),
 NOW()),

('770e8400-e29b-41d4-a716-446655440006',
 'Deep Learning với TensorFlow',
 'deep-learning-voi-tensorflow',
 'Khóa học nâng cao về Deep Learning, Neural Networks, và cách sử dụng TensorFlow để xây dựng các mô hình AI phức tạp.',
 'Deep Learning và Neural Networks với TensorFlow',
 NULL,
 '550e8400-e29b-41d4-a716-446655440010',
 'expert',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440004',
 75,
 4.8,
 NOW(),
 NOW()),

-- Algorithms
('770e8400-e29b-41d4-a716-446655440007',
 'Thuật toán và Cấu trúc dữ liệu',
 'thuat-toan-va-cau-truc-du-lieu',
 'Khóa học về các thuật toán cơ bản và nâng cao, cấu trúc dữ liệu như Array, Linked List, Tree, Graph và cách áp dụng trong thực tế.',
 'Học thuật toán và cấu trúc dữ liệu từ cơ bản',
 NULL,
 '550e8400-e29b-41d4-a716-446655440012',
 'intermediate',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440013',
 250,
 4.5,
 NOW(),
 NOW()),

-- Network & Security
('770e8400-e29b-41d4-a716-446655440008',
 'An toàn thông tin',
 'an-toan-thong-tin',
 'Khóa học về bảo mật thông tin, cryptography, network security, và các kỹ thuật bảo vệ hệ thống khỏi các mối đe dọa.',
 'Bảo mật thông tin và an ninh mạng',
 NULL,
 '550e8400-e29b-41d4-a716-446655440011',
 'intermediate',
 0.00,
 'published',
 true,
 '660e8400-e29b-41d4-a716-446655440003',
 100,
 4.6,
 NOW(),
 NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. ENROLLMENTS
-- ============================================
INSERT INTO enrollments (id, user_id, course_id, status, enrolled_at, progress_percentage, total_time_spent, last_accessed, created_at, updated_at) VALUES
-- Student 1 enrollments
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '30 days', 65.50, 1800, NOW() - INTERVAL '2 hours', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 'active', NOW() - INTERVAL '20 days', 45.00, 1200, NOW() - INTERVAL '1 day', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', 'completed', NOW() - INTERVAL '60 days', 100.00, 3600, NOW() - INTERVAL '5 days', NOW(), NOW()),

-- Student 2 enrollments
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'active', NOW() - INTERVAL '15 days', 78.25, 2100, NOW() - INTERVAL '3 hours', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440007', 'active', NOW() - INTERVAL '10 days', 30.00, 900, NOW() - INTERVAL '6 hours', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 'completed', NOW() - INTERVAL '45 days', 100.00, 2400, NOW() - INTERVAL '2 days', NOW(), NOW()),

-- Student 3 enrollments
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '5 days', 15.00, 450, NOW() - INTERVAL '1 hour', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440005', 'active', NOW() - INTERVAL '3 days', 8.50, 300, NOW() - INTERVAL '12 hours', NOW(), NOW()),

-- Student 4 enrollments
('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'active', NOW() - INTERVAL '25 days', 55.75, 1500, NOW() - INTERVAL '4 hours', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440008', 'active', NOW() - INTERVAL '12 days', 40.00, 1100, NOW() - INTERVAL '8 hours', NOW(), NOW()),

-- Student 5 enrollments
('880e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440006', 'active', NOW() - INTERVAL '7 days', 25.00, 750, NOW() - INTERVAL '2 hours', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440007', 'pending', NOW() - INTERVAL '1 day', 0.00, 0, NULL, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CONTENTS (Lessons, Videos, Quizzes)
-- ============================================
INSERT INTO contents (id, course_id, title, slug, description, content_type, body, video_url, order_index, is_free, status, estimated_duration, created_at, updated_at) VALUES
-- React Course Contents
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Giới thiệu về React', 'gioi-thieu-ve-react', 'Bài học đầu tiên giới thiệu về React và cách setup môi trường', 'lesson', '<h2>React là gì?</h2><p>React là một thư viện JavaScript để xây dựng giao diện người dùng...</p>', NULL, 1, true, 'published', 15, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Components và Props', 'components-va-props', 'Học về React Components và cách truyền props', 'lesson', '<h2>Components</h2><p>Components là các khối xây dựng của ứng dụng React...</p>', NULL, 2, true, 'published', 20, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'State và Hooks', 'state-va-hooks', 'Học về React State và Hooks API', 'video', '<p>Video hướng dẫn về State và Hooks</p>', 'https://example.com/videos/react-hooks.mp4', 3, true, 'published', 25, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'Quiz: React Basics', 'quiz-react-basics', 'Kiểm tra kiến thức về React cơ bản', 'quiz', NULL, NULL, 4, true, 'published', 10, NOW(), NOW()),

-- Node.js Course Contents
('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Giới thiệu Node.js', 'gioi-thieu-nodejs', 'Tìm hiểu về Node.js và môi trường runtime', 'lesson', '<h2>Node.js là gì?</h2><p>Node.js là một runtime environment...</p>', NULL, 1, true, 'published', 20, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'Express.js Framework', 'expressjs-framework', 'Học cách sử dụng Express.js để xây dựng API', 'video', '<p>Video hướng dẫn Express.js</p>', 'https://example.com/videos/express.mp4', 2, true, 'published', 30, NOW(), NOW()),

-- Database Course Contents
('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', 'Thiết kế Database Schema', 'thiet-ke-database-schema', 'Học cách thiết kế schema hiệu quả', 'lesson', '<h2>Database Design</h2><p>Thiết kế database là bước quan trọng...</p>', NULL, 1, true, 'published', 25, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', 'Query Optimization', 'query-optimization', 'Tối ưu hóa truy vấn SQL', 'lesson', '<h2>Optimization Techniques</h2><p>Các kỹ thuật tối ưu hóa...</p>', NULL, 2, true, 'published', 30, NOW(), NOW()),

-- SQL Course Contents
('990e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', 'SQL SELECT cơ bản', 'sql-select-co-ban', 'Học câu lệnh SELECT trong SQL', 'lesson', '<h2>SELECT Statement</h2><p>SELECT là câu lệnh cơ bản nhất...</p>', NULL, 1, true, 'published', 15, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440004', 'JOIN và Subqueries', 'join-va-subqueries', 'Học cách sử dụng JOIN và subqueries', 'video', '<p>Video hướng dẫn JOIN</p>', 'https://example.com/videos/sql-join.mp4', 2, true, 'published', 20, NOW(), NOW()),

-- ML Course Contents
('990e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440005', 'Giới thiệu Machine Learning', 'gioi-thieu-machine-learning', 'Tổng quan về Machine Learning', 'lesson', '<h2>ML Overview</h2><p>Machine Learning là gì...</p>', NULL, 1, true, 'published', 20, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440005', 'Linear Regression', 'linear-regression', 'Học thuật toán Linear Regression', 'video', '<p>Video về Linear Regression</p>', 'https://example.com/videos/linear-regression.mp4', 2, true, 'published', 25, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. QUIZZES
-- ============================================
INSERT INTO quizzes (id, course_id, title, description, time_limit, passing_score, max_attempts, is_active, created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Quiz: React Fundamentals', 'Kiểm tra kiến thức về React cơ bản', 30, 70, 3, true, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Quiz: Node.js Basics', 'Kiểm tra kiến thức về Node.js', 25, 75, 3, true, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'Quiz: Database Design', 'Kiểm tra kiến thức về thiết kế database', 40, 80, 2, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. QUESTIONS (for Quizzes)
-- ============================================
INSERT INTO questions (id, quiz_id, question_text, question_type, points, order_index, explanation, metadata, created_at, updated_at) VALUES
-- React Quiz Questions
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'React là gì?', 'multiple_choice', 10, 1, 'React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook', '{"options": ["Thư viện JavaScript", "Framework JavaScript", "Ngôn ngữ lập trình", "Database"], "correct_answer": 0}'::jsonb, NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', 'Hook nào được dùng để quản lý state trong functional component?', 'multiple_choice', 10, 2, 'useState là hook cơ bản nhất để quản lý state trong functional components', '{"options": ["useState", "useEffect", "useContext", "useReducer"], "correct_answer": 0}'::jsonb, NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001', 'Props trong React là gì?', 'multiple_choice', 10, 3, 'Props (properties) là cách để truyền dữ liệu từ component cha xuống component con', '{"options": ["State của component", "Dữ liệu truyền từ parent", "Local variables", "Global variables"], "correct_answer": 1}'::jsonb, NOW(), NOW()),

-- Node.js Quiz Questions
('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440002', 'Node.js chạy trên engine nào?', 'multiple_choice', 10, 1, 'Node.js sử dụng V8 JavaScript engine được phát triển bởi Google', '{"options": ["V8", "SpiderMonkey", "Chakra", "JavaScriptCore"], "correct_answer": 0}'::jsonb, NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440002', 'Express.js là gì?', 'multiple_choice', 10, 2, 'Express.js là một web framework nhỏ gọn và linh hoạt cho Node.js', '{"options": ["Database", "Web framework", "Template engine", "Package manager"], "correct_answer": 1}'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7.1 ANSWERS (for Questions)
-- ============================================
INSERT INTO answers (id, question_id, answer_text, is_correct, order_index, created_at, updated_at) VALUES
-- Answers for React Question 1
('bb1e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', 'Thư viện JavaScript', true, 1, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440001', 'Framework JavaScript', false, 2, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440001', 'Ngôn ngữ lập trình', false, 3, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440004', 'bb0e8400-e29b-41d4-a716-446655440001', 'Database', false, 4, NOW(), NOW()),

-- Answers for React Question 2
('bb1e8400-e29b-41d4-a716-446655440005', 'bb0e8400-e29b-41d4-a716-446655440002', 'useState', true, 1, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440006', 'bb0e8400-e29b-41d4-a716-446655440002', 'useEffect', false, 2, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440007', 'bb0e8400-e29b-41d4-a716-446655440002', 'useContext', false, 3, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440008', 'bb0e8400-e29b-41d4-a716-446655440002', 'useReducer', false, 4, NOW(), NOW()),

-- Answers for React Question 3
('bb1e8400-e29b-41d4-a716-446655440009', 'bb0e8400-e29b-41d4-a716-446655440003', 'State của component', false, 1, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440010', 'bb0e8400-e29b-41d4-a716-446655440003', 'Dữ liệu truyền từ parent', true, 2, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440011', 'bb0e8400-e29b-41d4-a716-446655440003', 'Local variables', false, 3, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440012', 'bb0e8400-e29b-41d4-a716-446655440003', 'Global variables', false, 4, NOW(), NOW()),

-- Answers for Node.js Question 1
('bb1e8400-e29b-41d4-a716-446655440013', 'bb0e8400-e29b-41d4-a716-446655440004', 'V8', true, 1, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440014', 'bb0e8400-e29b-41d4-a716-446655440004', 'SpiderMonkey', false, 2, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440015', 'bb0e8400-e29b-41d4-a716-446655440004', 'Chakra', false, 3, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440016', 'bb0e8400-e29b-41d4-a716-446655440004', 'JavaScriptCore', false, 4, NOW(), NOW()),

-- Answers for Node.js Question 2
('bb1e8400-e29b-41d4-a716-446655440017', 'bb0e8400-e29b-41d4-a716-446655440005', 'Database', false, 1, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440018', 'bb0e8400-e29b-41d4-a716-446655440005', 'Web framework', true, 2, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440019', 'bb0e8400-e29b-41d4-a716-446655440005', 'Template engine', false, 3, NOW(), NOW()),
('bb1e8400-e29b-41d4-a716-446655440020', 'bb0e8400-e29b-41d4-a716-446655440005', 'Package manager', false, 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. RATINGS
-- ============================================
INSERT INTO ratings (id, user_id, course_id, rating, review, is_verified, created_at, updated_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 5, 'Khóa học rất hay, giảng viên giải thích rõ ràng!', true, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', 5, 'Nội dung phong phú, dễ hiểu cho người mới bắt đầu', true, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 4, 'Tốt nhưng cần thêm ví dụ thực tế', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 5, 'Khóa học SQL rất hữu ích!', true, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 4, 'Nội dung tốt, cần cập nhật thêm', false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (id, name, description, icon, badge_image, points, category, requirements, is_active, created_at, updated_at) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'Người mới bắt đầu', 'Hoàn thành khóa học đầu tiên', 'star', NULL, 50, 'milestone', '{"courses_completed": 1}', true, NOW(), NOW()),
('dd0e8400-e29b-41d4-a716-446655440002', 'Học viên chăm chỉ', 'Học liên tiếp 7 ngày', 'flame', NULL, 100, 'learning', '{"streak_days": 7}', true, NOW(), NOW()),
('dd0e8400-e29b-41d4-a716-446655440003', 'Chuyên gia', 'Hoàn thành 10 khóa học', 'trophy', NULL, 500, 'milestone', '{"courses_completed": 10}', true, NOW(), NOW()),
('dd0e8400-e29b-41d4-a716-446655440004', 'Perfect Score', 'Đạt điểm tuyệt đối trong quiz', 'medal', NULL, 200, 'learning', '{"quiz_perfect_score": 1}', true, NOW(), NOW()),
('dd0e8400-e29b-41d4-a716-446655440005', 'Thành viên tích cực', 'Tham gia 5 cuộc thảo luận', 'message', NULL, 150, 'social', '{"discussions_participated": 5}', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. USER ACHIEVEMENTS
-- ============================================
INSERT INTO user_achievements (id, user_id, achievement_id, earned_at, created_at, updated_at) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'dd0e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'dd0e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'dd0e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. ACTIVITY LOGS
-- ============================================
INSERT INTO activity_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, session_id, created_at, updated_at) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'course_enrolled', 'course', '770e8400-e29b-41d4-a716-446655440001', '{"course_title": "Lập trình Web với React"}'::jsonb, '192.168.1.100', 'Mozilla/5.0', 'session-001', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('ff0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'content_completed', 'content', '990e8400-e29b-41d4-a716-446655440001', '{"content_title": "Giới thiệu về React", "course_id": "770e8400-e29b-41d4-a716-446655440001"}'::jsonb, '192.168.1.100', 'Mozilla/5.0', 'session-001', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
('ff0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'quiz_completed', 'quiz', 'aa0e8400-e29b-41d4-a716-446655440001', '{"quiz_title": "React Basics", "score": 85, "max_score": 100}'::jsonb, '192.168.1.100', 'Mozilla/5.0', 'session-001', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('ff0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'course_enrolled', 'course', '770e8400-e29b-41d4-a716-446655440002', '{"course_title": "Node.js và Express.js"}'::jsonb, '192.168.1.101', 'Mozilla/5.0', 'session-002', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('ff0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'content_completed', 'content', '990e8400-e29b-41d4-a716-446655440005', '{"content_title": "Giới thiệu Node.js", "course_id": "770e8400-e29b-41d4-a716-446655440002"}'::jsonb, '192.168.1.101', 'Mozilla/5.0', 'session-002', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. AI INTERACTIONS
-- ============================================
INSERT INTO ai_interactions (id, user_id, interaction_type, user_input, ai_response, model_used, tokens_used, response_time, rating, context_data, session_id, created_at, updated_at) VALUES
('110e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'chat', 'Giải thích về React Hooks', 'React Hooks là các hàm đặc biệt cho phép bạn sử dụng state và các tính năng khác của React trong functional components. Các hooks phổ biến bao gồm useState, useEffect, useContext...', 'gpt-4', 150, 1200, 5, '{"course_id": "770e8400-e29b-41d4-a716-446655440001"}'::jsonb, 'ai-session-001', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('110e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'chat', 'Cách tối ưu query SQL?', 'Để tối ưu query SQL, bạn có thể: 1. Sử dụng indexes phù hợp, 2. Tránh SELECT *, 3. Sử dụng JOIN thay vì subqueries khi có thể, 4. Sử dụng EXPLAIN để phân tích query plan...', 'gpt-4', 200, 1500, 4, '{"course_id": "770e8400-e29b-41d4-a716-446655440003"}'::jsonb, 'ai-session-002', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
('110e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'recommendation', 'Tôi muốn học về AI', 'Dựa trên hồ sơ học tập của bạn, tôi đề xuất khóa học "Machine Learning cơ bản" để bắt đầu. Khóa học này phù hợp với người mới và sẽ giúp bạn hiểu các khái niệm cơ bản...', 'gemini-pro', 180, 1100, NULL, '{"user_level": "beginner", "interests": ["ai", "ml"]}'::jsonb, 'ai-session-003', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 13. NOTIFICATIONS
-- ============================================
INSERT INTO notifications (id, user_id, type, category, title, message, is_read, link, metadata, created_at, updated_at) VALUES
('120e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'course', 'course', 'Khóa học đã được cập nhật', 'Khóa học "Lập trình Web với React" đã có nội dung mới', false, '/courses/lap-trinh-web-voi-react', '{"course_id": "770e8400-e29b-41d4-a716-446655440001"}'::jsonb, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('120e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'achievement', 'general', 'Chúc mừng! Bạn đã đạt thành tích', 'Bạn đã nhận được badge "Người mới bắt đầu"', false, '/profile/achievements', '{"achievement_id": "dd0e8400-e29b-41d4-a716-446655440001"}'::jsonb, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
('120e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'grade', 'assessment', 'Kết quả quiz', 'Bạn đã hoàn thành quiz "Node.js Basics" với điểm 85%', true, '/dashboard', '{"quiz_id": "aa0e8400-e29b-41d4-a716-446655440002", "score": 85}'::jsonb, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 14. DISCUSSIONS
-- ============================================
INSERT INTO discussions (id, course_id, user_id, title, content, status, is_pinned, views_count, created_at, updated_at) VALUES
('130e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Câu hỏi về React Hooks', 'Tôi không hiểu cách sử dụng useEffect, ai có thể giải thích không?', 'open', false, 25, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('130e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Tài liệu tham khảo Node.js', 'Có ai biết tài liệu hay về Node.js không? Chia sẻ giúp mình nhé!', 'open', false, 18, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
('130e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', 'Thông báo quan trọng', 'Khóa học sẽ có bài kiểm tra vào tuần tới. Vui lòng chuẩn bị kỹ!', 'open', true, 150, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 15. COMMENTS
-- ============================================
INSERT INTO comments (id, discussion_id, user_id, content, created_at, updated_at) VALUES
('140e8400-e29b-41d4-a716-446655440001', '130e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'useEffect được dùng để thực hiện side effects trong functional components. Bạn có thể đọc thêm trong tài liệu React!', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
('140e8400-e29b-41d4-a716-446655440002', '130e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Tôi khuyên bạn xem video bài học về Hooks, giảng viên giải thích rất rõ!', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('140e8400-e29b-41d4-a716-446655440002', '130e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Bạn có thể tham khảo Node.js official documentation, rất chi tiết!', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 16. PROGRESS (Detailed Progress Tracking)
-- ============================================
INSERT INTO progresses (id, user_id, course_id, content_id, enrollment_id, status, progress_percentage, completed_at, time_spent, created_at, updated_at) VALUES
('150e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'completed', 100.00, NOW() - INTERVAL '28 days', 900, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
('150e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'completed', 100.00, NOW() - INTERVAL '27 days', 1200, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days'),
('150e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'in_progress', 45.00, NULL, 600, NOW() - INTERVAL '26 days', NOW() - INTERVAL '2 hours'),
('150e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', 'completed', 100.00, NOW() - INTERVAL '12 days', 1200, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 17. TAGS
-- ============================================
INSERT INTO tags (id, name, slug, description, created_at, updated_at) VALUES
('160e8400-e29b-41d4-a716-446655440001', 'JavaScript', 'javascript', 'Tag cho nội dung về JavaScript', NOW(), NOW()),
('160e8400-e29b-41d4-a716-446655440002', 'React', 'react', 'Tag cho nội dung về React', NOW(), NOW()),
('160e8400-e29b-41d4-a716-446655440003', 'Node.js', 'nodejs', 'Tag cho nội dung về Node.js', NOW(), NOW()),
('160e8400-e29b-41d4-a716-446655440004', 'SQL', 'sql', 'Tag cho nội dung về SQL', NOW(), NOW()),
('160e8400-e29b-41d4-a716-446655440005', 'Machine Learning', 'machine-learning', 'Tag cho nội dung về ML', NOW(), NOW()),
('160e8400-e29b-41d4-a716-446655440006', 'Python', 'python', 'Tag cho nội dung về Python', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 18. CONTENT TAGS (Many-to-Many)
-- ============================================
INSERT INTO content_tags (content_id, tag_id, created_at, updated_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', '160e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440001', '160e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', '160e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440005', '160e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440009', '160e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440011', '160e8400-e29b-41d4-a716-446655440005', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440011', '160e8400-e29b-41d4-a716-446655440006', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 19. USER ANSWERS (Quiz Answers)
-- ============================================
INSERT INTO user_answers (id, user_id, question_id, answer_text, selected_answer_id, is_correct, points_earned, time_spent, created_at, updated_at) VALUES
('170e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', NULL, 'bb1e8400-e29b-41d4-a716-446655440001', true, 10, 30, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('170e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440002', NULL, 'bb1e8400-e29b-41d4-a716-446655440005', true, 10, 25, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('170e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440003', NULL, 'bb1e8400-e29b-41d4-a716-446655440010', true, 10, 35, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('170e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440004', NULL, 'bb1e8400-e29b-41d4-a716-446655440013', true, 10, 20, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('170e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440005', NULL, 'bb1e8400-e29b-41d4-a716-446655440018', true, 10, 22, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 20. FILES (Course Materials)
-- ============================================
INSERT INTO files (id, filename, original_name, mime_type, file_size, file_path, url, uploaded_by, content_id, file_type, is_public, download_count, created_at, updated_at) VALUES
('180e8400-e29b-41d4-a716-446655440001', 'react-basics-20241215.pdf', 'react-basics.pdf', 'application/pdf', 2048000, '/uploads/courses/react-basics-20241215.pdf', '/files/react-basics-20241215.pdf', '550e8400-e29b-41d4-a716-446655440010', '990e8400-e29b-41d4-a716-446655440001', 'document', true, 45, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('180e8400-e29b-41d4-a716-446655440002', 'nodejs-cheatsheet-20241205.pdf', 'nodejs-cheatsheet.pdf', 'application/pdf', 1536000, '/uploads/courses/nodejs-cheatsheet-20241205.pdf', '/files/nodejs-cheatsheet-20241205.pdf', '550e8400-e29b-41d4-a716-446655440011', '990e8400-e29b-41d4-a716-446655440005', 'document', true, 32, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('180e8400-e29b-41d4-a716-446655440003', 'database-design-guide-20241130.pdf', 'database-design-guide.pdf', 'application/pdf', 3072000, '/uploads/courses/database-design-guide-20241130.pdf', '/files/database-design-guide-20241130.pdf', '550e8400-e29b-41d4-a716-446655440011', '990e8400-e29b-41d4-a716-446655440007', 'document', true, 28, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- UPDATE COUNTS
-- ============================================
-- Update course counts in categories
UPDATE categories SET course_count = (
  SELECT COUNT(*) FROM courses WHERE category_id = categories.id
) WHERE id IN (
  SELECT DISTINCT category_id FROM courses WHERE category_id IS NOT NULL
);

-- Update enrolled_count in courses
UPDATE courses SET enrolled_count = (
  SELECT COUNT(*) FROM enrollments WHERE course_id = courses.id AND status = 'active'
) WHERE id IN (
  SELECT DISTINCT course_id FROM enrollments
);

-- Update average_rating in courses
UPDATE courses SET average_rating = (
  SELECT ROUND(AVG(rating)::numeric, 2) FROM ratings WHERE course_id = courses.id
) WHERE id IN (
  SELECT DISTINCT course_id FROM ratings
);

-- ============================================
-- END OF SAMPLE DATA
-- ============================================
