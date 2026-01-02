/*
 Navicat Premium Dump SQL

 Source Server         : studymate
 Source Server Type    : PostgreSQL
 Source Server Version : 150015 (150015)
 Source Host           : localhost:5432
 Source Catalog        : studymate_dev
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150015 (150015)
 File Encoding         : 65001

 Date: 02/01/2026 21:59:57
*/


-- ----------------------------
-- Type structure for enum_ai_interactions_interaction_type
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_ai_interactions_interaction_type";
CREATE TYPE "public"."enum_ai_interactions_interaction_type" AS ENUM (
  'chat',
  'recommendation',
  'analysis',
  'feedback',
  'roadmap'
);

-- ----------------------------
-- Type structure for enum_blogs_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_blogs_status";
CREATE TYPE "public"."enum_blogs_status" AS ENUM (
  'draft',
  'published',
  'archived'
);

-- ----------------------------
-- Type structure for enum_comments_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_comments_status";
CREATE TYPE "public"."enum_comments_status" AS ENUM (
  'active',
  'hidden',
  'deleted'
);

-- ----------------------------
-- Type structure for enum_contacts_priority
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_contacts_priority";
CREATE TYPE "public"."enum_contacts_priority" AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- ----------------------------
-- Type structure for enum_contacts_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_contacts_status";
CREATE TYPE "public"."enum_contacts_status" AS ENUM (
  'pending',
  'in_progress',
  'resolved',
  'closed'
);

-- ----------------------------
-- Type structure for enum_contacts_subject
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_contacts_subject";
CREATE TYPE "public"."enum_contacts_subject" AS ENUM (
  'technical_support',
  'account_help',
  'course_question',
  'ai_feedback',
  'bug_report',
  'feature_request',
  'general_inquiry',
  'other'
);

-- ----------------------------
-- Type structure for enum_contents_content_type
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_contents_content_type";
CREATE TYPE "public"."enum_contents_content_type" AS ENUM (
  'lesson',
  'video',
  'document',
  'quiz',
  'assignment'
);

-- ----------------------------
-- Type structure for enum_contents_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_contents_status";
CREATE TYPE "public"."enum_contents_status" AS ENUM (
  'draft',
  'published',
  'archived'
);

-- ----------------------------
-- Type structure for enum_courses_level
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_courses_level";
CREATE TYPE "public"."enum_courses_level" AS ENUM (
  'beginner',
  'intermediate',
  'advanced',
  'expert'
);

-- ----------------------------
-- Type structure for enum_courses_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_courses_status";
CREATE TYPE "public"."enum_courses_status" AS ENUM (
  'draft',
  'published',
  'archived'
);

-- ----------------------------
-- Type structure for enum_enrollments_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_enrollments_status";
CREATE TYPE "public"."enum_enrollments_status" AS ENUM (
  'pending',
  'active',
  'completed',
  'dropped'
);

-- ----------------------------
-- Type structure for enum_messages_message_type
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_messages_message_type";
CREATE TYPE "public"."enum_messages_message_type" AS ENUM (
  'text',
  'image',
  'file',
  'system'
);

-- ----------------------------
-- Type structure for enum_payments_payment_method
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_payments_payment_method";
CREATE TYPE "public"."enum_payments_payment_method" AS ENUM (
  'momo',
  'bank_transfer',
  'other'
);

-- ----------------------------
-- Type structure for enum_payments_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_payments_status";
CREATE TYPE "public"."enum_payments_status" AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
);

-- ----------------------------
-- Type structure for enum_progress_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_progress_status";
CREATE TYPE "public"."enum_progress_status" AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'paused',
  'skipped'
);

-- ----------------------------
-- Type structure for enum_users_role
-- ----------------------------
DROP TYPE IF EXISTS "public"."enum_users_role";
CREATE TYPE "public"."enum_users_role" AS ENUM (
  'student',
  'teacher',
  'lecturer',
  'admin',
  'system_admin'
);

-- ----------------------------
-- Table structure for ai_interactions
-- ----------------------------
DROP TABLE IF EXISTS "public"."ai_interactions";
CREATE TABLE "public"."ai_interactions" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "interaction_type" "public"."enum_ai_interactions_interaction_type" NOT NULL,
  "user_input" text COLLATE "pg_catalog"."default" NOT NULL,
  "ai_response" text COLLATE "pg_catalog"."default" NOT NULL,
  "model_used" varchar(255) COLLATE "pg_catalog"."default",
  "tokens_used" int4,
  "response_time" int4,
  "rating" int4,
  "context_data" jsonb,
  "session_id" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of ai_interactions
-- ----------------------------
INSERT INTO "public"."ai_interactions" VALUES ('343c0400-f94e-4a64-a018-e12f13dbb0d4', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'roadmap', '{"learningStyle":"reading","learningTime":"night","skillLevel":"advanced","courseDuration":"8+","topics":["JavaScript"]}', 'Tuyệt vời! Dưới đây là lộ trình học tập JavaScript chi tiết dành cho bạn Nguyễn Hiếu, được thiết kế dựa trên thông tin bạn cung cấp.

# Lộ Trình Học JavaScript Nâng Cao (8+ Tuần)

## 1. Tổng Quan Lộ Trình

Lộ trình này được thiết kế dành cho những người học đã có nền tảng lập trình vững chắc và muốn nâng cao kỹ năng JavaScript lên một tầm cao mới. Chúng ta sẽ đi sâu vào các khái niệm nâng cao, pattern thiết kế, tối ưu hóa hiệu năng và các thư viện/framework phổ biến. Mục tiêu cuối cùng là bạn có thể tự tin xây dựng các ứng dụng JavaScript phức tạp, có cấu trúc tốt và hiệu quả. Lộ trình này sẽ tận dụng tối đa phong cách học tập "Đọc tài liệu" của bạn và phù hợp với thời gian học tập vào buổi tối.

## 2. Cấu Trúc Khóa Học

Lộ trình được chia thành 8 mô-đun chính, mỗi mô-đun kéo dài khoảng 1-2 tuần.

**Tuần 1-2: JavaScript Nâng Cao - Core Concepts**

*   **Mục tiêu:** Nắm vững các khái niệm JavaScript nâng cao như closures, prototypes, asynchronous JavaScript, generators, iterators.
*   **Nội dung:**
    *   Closures: Hiểu rõ cách closures hoạt động và ứng dụng trong thực tế.
    *   Prototypes & Inheritance: Đi sâu vào cơ chế prototype-based inheritance của JavaScript.
    *   Asynchronous JavaScript: Promises, Async/Await, Event Loop.
    *   Generators & Iterators: Tìm hiểu cách tạo và sử dụng generators và iterators.
    *   Modules: ES Modules, CommonJS.
*   **Thời gian ước tính:** 14 giờ
*   **Bài tập:**
    *   Viết các hàm sử dụng closures để tạo ra các biến private.
    *   Xây dựng một hệ thống inheritance đơn giản sử dụng prototypes.
    *   Triển khai một hàm sử dụng Async/Await để gọi API.

**Tuần 3-4: Design Patterns trong JavaScript**

*   **Mục tiêu:** Làm quen với các design patterns phổ biến và biết cách áp dụng chúng để giải quyết các vấn đề lập trình.
*   **Nội dung:**
    *   Creational Patterns: Singleton, Factory, Builder.
    *   Structural Patterns: Adapter, Decorator, Facade.
    *   Behavioral Patterns: Observer, Strategy, Command.
*   **Thời gian ước tính:** 14 giờ
*   **Bài tập:**
    *   Triển khai Singleton pattern để quản lý một resource duy nhất.
    *   Sử dụng Adapter pattern để tích hợp hai hệ thống không tương thích.
    *   Áp dụng Observer pattern để xây dựng một hệ thống thông báo.

**Tuần 5-6: Tối Ưu Hóa Hiệu Năng JavaScript**

*   **Mục tiêu:** Hiểu các yếu tố ảnh hưởng đến hiệu năng JavaScript và biết cách tối ưu hóa code để cải thiện tốc độ và khả năng mở rộng.
*   **Nội dung:**
    *   Profiling & Debugging: Sử dụng các công cụ để phân tích hiệu năng code.
    *   Memory Management: Hiểu cách JavaScript quản lý bộ nhớ và tránh memory leaks.
    *   Code Splitting & Lazy Loading: Tối ưu hóa thời gian tải trang.
    *   Caching: Sử dụng caching để giảm tải cho server.
*   **Thời gian ước tính:** 14 giờ
*   **Bài tập:**
    *   Sử dụng Chrome DevTools để profiling một đoạn code và tìm ra các điểm nghẽn.
    *   Triển khai một hệ thống caching đơn giản.
    *   Áp dụng code splitting để giảm kích thước bundle.

**Tuần 7-8: Framework/Library Nâng Cao (Chọn 1)**

*   **Mục tiêu:** Làm quen với một framework/library JavaScript nâng cao và xây dựng một ứng dụng thực tế. (Chọn một trong các lựa chọn sau)
    *   **Node.js & Express:** Xây dựng một REST API.
    *   **Vue.js:** Xây dựng một ứng dụng single-page application (SPA).
    *   **Angular:** Xây dựng một ứng dụng enterprise-level.
*   **Thời gian ước tính:** 28 giờ
*   **Dự án:** Xây dựng một ứng dụng hoàn chỉnh sử dụng framework/library đã chọn.

**Tuần 9+: Các Chủ Đề Nâng Cao (Tùy chọn)**

*   **Mục tiêu:** Khám phá các chủ đề JavaScript nâng cao khác.
*   **Nội dung:**
    *   WebAssembly
    *   Serverless Functions
    *   GraphQL
    *   TypeScript

## 3. Tài Nguyên Học Tập

Dưới đây là các tài nguyên học tập phù hợp với phong cách học "Đọc tài liệu" của bạn:

*   **MDN Web Docs:** [https://developer.mozilla.org/en-US/](https://developer.mozilla.org/en-US/) - Tài liệu tham khảo chính thức và đầy đủ nhất về JavaScript.
*   **You Don''t Know JS (series):** [https://github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS) - Bộ sách chuyên sâu về JavaScript, đi sâu vào các khái niệm cốt lõi.
*   **JavaScript.info:** [https://javascript.info/](https://javascript.info/) - Một tutorial JavaScript chi tiết và dễ hiểu.
*   **Design Patterns in JavaScript:** [https://addyosmani.github.io/programming-patterns/](https://addyosmani.github.io/programming-patterns/) - Tài liệu về các design patterns trong JavaScript.
*   **Blog của các chuyên gia:**  Tìm kiếm các bài viết chuyên sâu trên các blog của các lập trình viên JavaScript nổi tiếng.

## 4. Dự Án Thực Hành

*   **Ứng dụng quản lý task:** Sử dụng các design patterns để xây dựng một ứng dụng quản lý task đơn giản.
*   **Trình duyệt mini:** Xây dựng một trình duyệt web mini sử dụng JavaScript.
*   **REST API:** Xây dựng một REST API sử dụng Node.js và Express.
*   **Ứng dụng SPA:** Xây dựng một ứng dụng single-page application (SPA) sử dụng Vue.js hoặc Angular.

## 5. Đánh Giá Tiến Độ

*   **Bài tập:** Hoàn thành tất cả các bài tập trong mỗi mô-đun.
*   **Dự án:** Hoàn thành các dự án thực hành.
*   **Code Review:** Yêu cầu bạn bè hoặc đồng nghiệp review code của bạn.
*   **Tự đánh giá:** Thường xuyên tự đánh giá kiến thức của bạn bằng cách giải các bài toán hoặc thử thách lập trình.

## 6. Lời Khuyên Học Tập

*   **Thời gian biểu:** Lên lịch học tập cụ thể vào buổi tối và tuân thủ nó.
*   **Không gian học tập:** Tìm một không gian yên tĩnh và thoải mái để học tập.
*   **Ghi chú:** Ghi chú lại những điểm quan trọng trong quá trình đọc tài liệu.
*   **Thực hành:** Thực hành code thường xuyên để củng cố kiến thức.
*   **Nghỉ ngơi:** Đừng quên nghỉ ngơi và thư giãn để tránh bị căng thẳng.
*   **Học nhóm:** Tham gia các nhóm học tập để trao đổi kiến thức và kinh nghiệm.
*   **Đừng sợ hỏi:** Nếu bạn gặp khó khăn, đừng ngại hỏi bạn bè, đồng nghiệp hoặc các chuyên gia.

Chúc bạn thành công trên con đường chinh phục JavaScript! Hãy nhớ rằng, sự kiên trì và đam mê là chìa khóa để đạt được mục tiêu.', 'gemma-3-27b-it', 0, 34662, NULL, '{"models_tried": ["gemma-3-27b-it"], "user_context": {"user_profile": {"name": "Nguyễn Hiếu1", "role": "admin"}, "current_courses": [{"id": "8a63ba69-1e35-40ec-80b8-38b54b5e63eb", "level": "beginner", "title": "Tiêu đề khóa họ 1", "progress": "12.00"}, {"id": "770e8400-e29b-41d4-a716-446655440001", "level": "intermediate", "title": "Lập trình Web với React 1", "progress": "100.00"}, {"id": "770e8400-e29b-41d4-a716-446655440005", "level": "beginner", "title": "Machine Learning cơ bản", "progress": "0.00"}, {"id": "770e8400-e29b-41d4-a716-446655440007", "level": "intermediate", "title": "Thuật toán và Cấu trúc dữ liệu", "progress": "1.00"}], "recent_activity": [{"type": "assignment", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "quiz", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "assignment", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "quiz", "status": "completed", "content": "Quiz: React Basics", "progress": "100.00"}, {"type": "document", "status": "completed", "content": "SOLID – 5 nguyên lý “vàng” giúp viết code sạch và dễ bảo trì", "progress": "100.00"}, {"type": "video", "status": "completed", "content": "State và Hooks", "progress": "100.00"}, {"type": "lesson", "status": "completed", "content": "Components và Props", "progress": "100.00"}, {"type": "lesson", "status": "completed", "content": "TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8", "progress": "100.00"}]}, "prompt_length": 1307, "response_length": 6060}', NULL, '2026-01-02 14:16:32.03+00', '2026-01-02 14:16:32.03+00');
INSERT INTO "public"."ai_interactions" VALUES ('78be54ae-91a2-4bc8-b93a-e82d5bdf706f', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'roadmap', '{"learningStyle":"videos","learningTime":"morning","skillLevel":"advanced","courseDuration":"2-3","topics":["AI Development"]}', 'Tuyệt vời! Dưới đây là lộ trình học tập chi tiết về AI Development dành riêng cho bạn, Nguyễn Hiếu, được thiết kế dựa trên thông tin bạn cung cấp:

## Lộ Trình Học Tập AI Development Nâng Cao (2-3 Tuần)

### 1. Tổng Quan Lộ Trình

Lộ trình này được thiết kế dành cho những bạn đã có nền tảng vững chắc về lập trình (đặc biệt là Python), Machine Learning cơ bản và cấu trúc dữ liệu. Mục tiêu là giúp bạn nâng cao kỹ năng, đi sâu vào các kỹ thuật AI Development hiện đại và có thể xây dựng các ứng dụng AI thực tế. L��� trình tập trung vào việc học qua video, tận dụng thời gian buổi sáng hiệu quả và hoàn thành trong khoảng 2-3 tuần.

### 2. Cấu Trúc Khóa Học

**Tuần 1: Deep Learning Nâng Cao & Computer Vision**

*   **Mục tiêu:** Hiểu sâu hơn về mạng nơ-ron sâu (Deep Neural Networks), các kiến trúc phổ biến và ứng dụng trong Computer Vision.
*   **Nội dung:**
    *   **Bài học:**
        *   Ôn tập kiến thức Deep Learning cơ bản (Convolutional Neural Networks - CNNs, Recurrent Neural Networks - RNNs). (2 giờ)
        *   Các kiến trúc CNN nâng cao: ResNet, Inception, EfficientNet. (3 giờ)
        *   Object Detection: YOLO, SSD, Faster R-CNN. (4 giờ)
        *   Image Segmentation: U-Net, Mask R-CNN. (3 giờ)
    *   **Bài tập:**
        *   Xây dựng mô hình phân loại ảnh sử dụng ResNet trên tập dữ liệu CIFAR-10. (4 giờ)
        *   Thực hành Object Detection với YOLO trên ảnh hoặc video. (4 giờ)
    *   **Thời gian ước tính:** 16 giờ
*   **Dự án:** Xây dựng ứng dụng nhận diện đối tượng đơn giản trong ảnh hoặc video.

**Tuần 2: Natural Language Processing (NLP) & Transformers**

*   **Mục tiêu:** Làm quen với các kỹ thuật NLP hiện đại, đặc biệt là kiến trúc Transformer và ứng dụng của nó.
*   **Nội dung:**
    *   **Bài học:**
        *   Ôn tập NLP cơ bản: Word Embeddings (Word2Vec, GloVe), RNNs cho NLP. (2 giờ)
        *   Kiến trúc Transformer: Attention Mechanism, Encoder-Decoder. (4 giờ)
        *   Các mô hình Transformer phổ biến: BERT, GPT, T5. (4 giờ)
        *   Fine-tuning mô hình Transformer cho các tác vụ NLP cụ thể (Text Classification, Question Answering). (3 giờ)
    *   **Bài tập:**
        *   Fine-tuning mô hình BERT cho bài toán phân loại cảm xúc (Sentiment Analysis). (4 giờ)
        *   Sử dụng GPT để tạo văn bản. (2 giờ)
    *   **Thời gian ước tính:** 15 giờ
*   **Dự án:** Xây dựng chatbot đơn giản sử dụng mô hình Transformer.

**Tuần 3 (Tùy chọn): Reinforcement Learning & MLOps**

*   **Mục tiêu:** Khám phá Reinforcement Learning và các công cụ để triển khai mô hình AI vào thực tế.
*   **Nội dung:**
    *   **Bài học:**
        *   Giới thiệu Reinforcement Learning: Q-Learning, Deep Q-Networks (DQN). (3 giờ)
        *   MLOps: Version Control (Git), CI/CD, Model Deployment (Docker, Kubernetes). (4 giờ)
    *   **Bài tập:**
        *   Huấn luyện agent để chơi game đơn giản (ví dụ: CartPole) sử dụng DQN. (4 giờ)
        *   Triển khai mô hình Machine Learning lên Docker container. (3 giờ)
    *   **Thời gian ước tính:** 14 giờ
*   **Dự án:** Triển khai một mô hình Machine Learning đã huấn luyện lên một nền tảng cloud (ví dụ: AWS, Google Cloud).

### 3. Tài Nguyên Học Tập (Video)

*   **Fast.ai:** [https://course.fast.ai/](https://course.fast.ai/) (Tuyệt vời cho Deep Learning thực hành)
*   **Sentdex (YouTube):** [https://www.youtube.com/@sentdex](https://www.youtube.com/@sentdex) (Nhiều video về Machine Learning, Deep Learning, NLP)
*   **freeCodeCamp.org (YouTube):** [https://www.youtube.com/@freecodecamp](https://www.youtube.com/@freecodecamp) (Các khóa học toàn diện về AI, Machine Learning)
*   **TensorFlow Tutorials:** [https://www.tensorflow.org/tutorials](https://www.tensorflow.org/tutorials) (Hướng dẫn chính thức từ TensorFlow)
*   **PyTorch Tutorials:** [https://pytorch.org/tutorials/](https://pytorch.org/tutorials/) (Hướng dẫn chính thức từ PyTorch)
*   **Coursera/edX:** Tìm kiếm các khóa học về Deep Learning, NLP, Reinforcement Learning.

### 4. Dự Án Thực Hành

*   **Nhận diện đối tượng trong ảnh/video:** Sử dụng YOLO hoặc SSD.
*   **Chatbot:** Sử dụng mô hình Transformer (BERT, GPT).
*   **Phân tích cảm xúc:** Sử dụng BERT để phân tích cảm xúc từ văn bản.
*   **Game AI:** Huấn luyện agent để chơi game sử dụng Reinforcement Learning.
*   **Triển khai mô hình:** Triển khai một mô hình Machine Learning lên cloud.

### 5. Đánh Giá Tiến Độ

*   **Bài tập:** Hoàn thành các bài tập sau mỗi mô-đun.
*   **Dự án:** Hoàn thành các dự án thực hành.
*   **Tự đánh giá:** Đánh giá khả năng hiểu và áp dụng kiến thức.
*   **Chia sẻ:** Chia sẻ dự án của bạn trên GitHub để nhận phản hồi từ cộng đồng.

### 6. Lời Khuyên Học Tập

*   **Buổi sáng là thời điểm tốt nhất:** Tận dụng sự tập trung cao nhất vào buổi sáng để học các khái niệm mới.
*   **Học qua video:** Xem video, ghi chú và thực hành theo.
*   **Thực hành thường xuyên:** Dành thời gian thực hành code mỗi ngày.
*   **Chia nhỏ mục tiêu:** Chia nhỏ các dự án lớn thành các bước nhỏ hơn để dễ quản lý.
*   **Tìm kiếm sự giúp đỡ:** Đừng ngại hỏi khi gặp khó khăn. Tham gia các cộng đồng AI để học hỏi và chia sẻ kinh nghiệm.
*   **Nghỉ ngơi đầy đủ:** Đảm bảo bạn có đủ giấc ngủ và thời gian nghỉ ngơi để duy trì sự tập trung.

Chúc bạn học tập hiệu quả và thành công trên con đường trở thành AI Developer! Hãy nhớ rằng, sự kiên trì và thực hành là chìa khóa để đạt được mục tiêu.', 'gemma-3-27b-it', 0, 31136, NULL, '{"models_tried": ["gemma-3-27b-it"], "user_context": {"user_profile": {"name": "Nguyễn Hiếu1", "role": "admin"}, "current_courses": [{"id": "8a63ba69-1e35-40ec-80b8-38b54b5e63eb", "level": "beginner", "title": "Tiêu đề khóa họ 1", "progress": "12.00"}, {"id": "770e8400-e29b-41d4-a716-446655440001", "level": "intermediate", "title": "Lập trình Web với React 1", "progress": "100.00"}, {"id": "770e8400-e29b-41d4-a716-446655440005", "level": "beginner", "title": "Machine Learning cơ bản", "progress": "0.00"}, {"id": "770e8400-e29b-41d4-a716-446655440007", "level": "intermediate", "title": "Thuật toán và Cấu trúc dữ liệu", "progress": "1.00"}], "recent_activity": [{"type": "assignment", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "quiz", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "assignment", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "quiz", "status": "completed", "content": "Quiz: React Basics", "progress": "100.00"}, {"type": "document", "status": "completed", "content": "SOLID – 5 nguyên lý “vàng” giúp viết code sạch và dễ bảo trì", "progress": "100.00"}, {"type": "video", "status": "completed", "content": "State và Hooks", "progress": "100.00"}, {"type": "lesson", "status": "completed", "content": "Components và Props", "progress": "100.00"}, {"type": "lesson", "status": "completed", "content": "TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8", "progress": "100.00"}]}, "prompt_length": 1307, "response_length": 5330}', NULL, '2026-01-02 14:23:18.293+00', '2026-01-02 14:23:18.293+00');
INSERT INTO "public"."ai_interactions" VALUES ('a19ffc03-ad25-4716-a423-0cd2d75deb02', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'roadmap', '{"learningStyle":"videos","learningTime":"night","skillLevel":"advanced","courseDuration":"2-3","topics":["Data Science"]}', 'Tuyệt vời! Dưới đây là lộ trình học tập Data Science được thiết kế riêng cho bạn, Nguyễn Hiếu, dựa trên thông tin bạn cung cấp.

## Lộ Trình Học Tập Data Science Nâng Cao (2-3 Tuần)

### 1. Tổng Quan Lộ Trình

Lộ trình này được thiết kế dành cho những người đã có nền tảng vững chắc về lập trình (đặc biệt là Python), Machine Learning cơ bản và hiểu biết về thuật toán & cấu trúc dữ liệu. Mục tiêu là giúp bạn nâng cao kỹ năng Data Science, tập trung vào các kỹ thuật và công cụ tiên tiến, đồng thời xây dựng các d��� án thực tế để chứng minh năng lực. Lộ trình này sẽ tập trung vào việc xử lý dữ liệu lớn, trực quan hóa dữ liệu nâng cao và triển khai các mô hình Machine Learning.

### 2. Cấu Trúc Khóa Học

**Lưu ý:** Thời gian ước tính chỉ mang tính tham khảo, có thể điều chỉnh tùy theo tốc độ học của bạn.

**Tuần 1: Xử Lý Dữ Liệu Nâng Cao & Khám Phá Dữ Liệu (EDA)**

*   **Mục tiêu:** Nắm vững các kỹ thuật xử lý dữ liệu phức tạp, làm sạch dữ liệu, và thực hiện EDA chuyên sâu để hiểu rõ hơn về dữ liệu.
*   **Nội dung:**
    *   **Bài học:**
        *   Xử lý dữ liệu thiếu (Missing Data Imputation) nâng cao: K-NN Imputation, MICE.
        *   Phát hiện và xử lý dữ liệu ngoại lai (Outlier Detection) bằng các thuật toán: Isolation Forest, One-Class SVM.
        *   Chuyển đổi dữ liệu (Data Transformation): Power Transformer, Quantile Transformer.
        *   EDA nâng cao: Phân tích tương quan đa biến, phân tích thành phần chính (PCA) để giảm chiều dữ liệu.
    *   **Bài tập:**
        *   Thực hành xử lý dữ liệu thiếu và ngoại lai trên bộ dữ liệu thực tế (ví dụ: dữ liệu bán hàng, dữ liệu tài chính).
        *   Thực hiện EDA trên bộ dữ liệu lớn để tìm ra các insight quan trọng.
    *   **Thời gian ước tính:** 7-10 giờ
*   **Dự án nhỏ:** Phân tích dữ liệu COVID-19, tìm hiểu xu hướng lây lan và các yếu tố ảnh hưởng.

**Tuần 2: Trực Quan Hóa Dữ Liệu Nâng Cao & Storytelling với Dữ Liệu**

*   **Mục tiêu:** Tạo ra các biểu đồ trực quan hóa dữ liệu phức tạp, hiệu quả và kể câu chuyện hấp dẫn từ dữ liệu.
*   **Nội dung:**
    *   **Bài học:**
        *   Sử dụng Seaborn và Plotly để tạo các biểu đồ nâng cao: Heatmap, Pairplot, 3D Scatter Plot, Sankey Diagram.
        *   Tạo dashboard tương tác với Dash (Python) hoặc Tableau.
        *   Nguyên tắc thiết kế trực quan hóa dữ liệu hiệu quả.
        *   Kỹ năng Storytelling với dữ liệu: Xây dựng narrative, lựa chọn biểu đồ phù hợp.
    *   **Bài tập:**
        *   Trực quan hóa dữ liệu từ dự án tuần 1 bằng các biểu đồ nâng cao.
        *   Tạo dashboard tương tác để khám phá dữ liệu.
    *   **Thời gian ước tính:** 7-10 giờ
*   **Dự án nhỏ:** Xây dựng dashboard phân tích hiệu quả chiến dịch marketing cho một công ty.

**Tuần 3 (Tùy chọn): Triển Khai Mô Hình Machine Learning & MLOps Cơ Bản**

*   **Mục tiêu:** Học cách triển khai mô hình Machine Learning vào thực tế và làm quen với các khái niệm cơ bản của MLOps.
*   **Nội dung:**
    *   **Bài học:**
        *   Sử dụng Flask hoặc FastAPI để tạo API cho mô hình Machine Learning.
        *   Containerization với Docker.
        *   Triển khai mô hình lên cloud (ví dụ: AWS, Google Cloud, Azure) sử dụng các dịch vụ như AWS SageMaker, Google AI Platform.
        *   Giám sát hiệu suất mô hình (Model Monitoring).
    *   **Bài tập:**
        *   Triển khai một mô hình Machine Learning đơn giản (ví dụ: dự đoán giá nhà) lên cloud.
        *   Thiết lập hệ thống giám sát hiệu suất mô hình.
    *   **Thời gian ước tính:** 10-15 giờ
*   **Dự án nhỏ:** Triển khai mô hình dự đoán khách hàng rời bỏ (Churn Prediction) lên cloud và theo dõi hiệu suất.

### 3. Tài Nguyên Học Tập (Video)

*   **StatQuest with Josh Starmer (YouTube):** Giải thích các khái niệm thống kê và Machine Learning một cách dễ hiểu. ([https://www.youtube.com/@statquest](https://www.youtube.com/@statquest))
*   **Sentdex (YouTube):** Các tutorial về Python, Machine Learning, Deep Learning. ([https://www.youtube.com/@sentdex](https://www.youtube.com/@sentdex))
*   **freeCodeCamp.org (YouTube):** Các khóa học Data Science đầy đủ và miễn phí. ([https://www.youtube.com/@freecodecamp](https://www.youtube.com/@freecodecamp))
*   **DataCamp:** Nền tảng học Data Science tương tác với nhiều video và bài tập thực hành. (Có trả phí)
*   **Coursera/edX:** Các khóa học Data Science từ các trường đại học hàng đầu. (Có trả phí)

### 4. Dự Án Thực Hành

*   **Phân tích dữ liệu bán hàng:** Dự đoán doanh số, phân tích hành vi khách hàng, tối ưu hóa chiến dịch marketing.
*   **Phân tích dữ liệu tài chính:** Dự đoán giá cổ phiếu, phát hiện gian lận, đánh giá rủi ro tín dụng.
*   **Phân tích dữ liệu y tế:** Dự đoán bệnh tật, phân tích hiệu quả điều trị, cá nhân hóa chăm sóc sức khỏe.
*   **Xây dựng hệ thống gợi ý sản phẩm:** Gợi ý sản phẩm phù hợp với sở thích của người dùng.

### 5. Đánh Giá Tiến Độ

*   **Tự đánh giá:** Sau mỗi mô-đun, hãy tự đánh giá mức độ hiểu và khả năng áp dụng kiến thức.
*   **Thực hiện các bài tập:** Hoàn thành các bài tập để kiểm tra kiến thức và kỹ năng.
*   **Hoàn thành dự án:** Xây dựng các dự án thực tế để chứng minh năng lực.
*   **Tham gia các cuộc thi Data Science:** Kaggle là một nền tảng tuyệt vời để tham gia các cuộc thi và học hỏi từ những người khác.

### 6. Lời Khuyên Học Tập (Buổi Tối)

*   **Tạo không gian học tập yên tĩnh:** Tránh xa các yếu tố gây xao nhãng.
*   **Chia nhỏ mục tiêu:** Thay vì cố gắng học quá nhiều trong một buổi tối, hãy chia nhỏ thành các mục tiêu nhỏ hơn và dễ quản lý hơn.
*   **Sử dụng kỹ thuật Pomodoro:** Học tập trong 25 phút, sau đó nghỉ ngơi 5 phút.
*   **Ghi chép:** Ghi lại những điểm quan trọng và các ý tưởng mới.
*   **Thực hành thường xuyên:** Áp dụng kiến thức vào thực tế bằng cách làm các bài tập và dự án.
*   **Ngủ đủ giấc:** Giấc ngủ rất quan trọng để củng cố kiến thức và duy trì sự tập trung.

Chúc bạn học tập hiệu quả và thành công trên con đường trở thành Data Scientist! Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại hỏi nhé.', 'gemma-3-27b-it', 0, 35991, NULL, '{"models_tried": ["gemma-3-27b-it"], "user_context": {"user_profile": {"name": "Nguyễn Hiếu1", "role": "admin"}, "current_courses": [{"id": "8a63ba69-1e35-40ec-80b8-38b54b5e63eb", "level": "beginner", "title": "Tiêu đề khóa họ 1", "progress": "12.00"}, {"id": "770e8400-e29b-41d4-a716-446655440001", "level": "intermediate", "title": "Lập trình Web với React 1", "progress": "100.00"}, {"id": "770e8400-e29b-41d4-a716-446655440005", "level": "beginner", "title": "Machine Learning cơ bản", "progress": "0.00"}, {"id": "770e8400-e29b-41d4-a716-446655440007", "level": "intermediate", "title": "Thuật toán và Cấu trúc dữ liệu", "progress": "1.00"}], "recent_activity": [{"type": "assignment", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "quiz", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "assignment", "status": "completed", "content": "Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):", "progress": "100.00"}, {"type": "quiz", "status": "completed", "content": "Quiz: React Basics", "progress": "100.00"}, {"type": "document", "status": "completed", "content": "SOLID – 5 nguyên lý “vàng” giúp viết code sạch và dễ bảo trì", "progress": "100.00"}, {"type": "video", "status": "completed", "content": "State và Hooks", "progress": "100.00"}, {"type": "lesson", "status": "completed", "content": "Components và Props", "progress": "100.00"}, {"type": "lesson", "status": "completed", "content": "TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8", "progress": "100.00"}]}, "prompt_length": 1301, "response_length": 5927}', NULL, '2026-01-02 14:33:26.917+00', '2026-01-02 14:33:26.917+00');

-- ----------------------------
-- Table structure for blogs
-- ----------------------------
DROP TABLE IF EXISTS "public"."blogs";
CREATE TABLE "public"."blogs" (
  "id" uuid NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "excerpt" varchar(500) COLLATE "pg_catalog"."default",
  "featured_image" varchar(255) COLLATE "pg_catalog"."default",
  "status" "public"."enum_blogs_status" DEFAULT 'draft'::enum_blogs_status,
  "tags" varchar(255)[] COLLATE "pg_catalog"."default" DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
  "view_count" int4 DEFAULT 0,
  "reading_time" int4 DEFAULT 0,
  "author_id" uuid NOT NULL,
  "category_id" uuid,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of blogs
-- ----------------------------
INSERT INTO "public"."blogs" VALUES ('cd74da61-9180-45f7-bc26-899039884f5e', 'Google May Soon Let You Change That Old, Silly Gmail Address  Read More: https://www.bgr.com/tech/alibaba-launches-new-qwen3-ai-with-major-upgrades-to-rival-deepseek/', 'google-may-soon-let-you-change-that-old-silly-gmail-address-read-more-httpswwwbgrcomtechalibaba-launches-new-qwen3-ai-with-major-upgrades-to-rival-deepseek', '<p>Google May Soon Let You Change That Old, Silly Gmail Address</p><p>Read More: https://www.bgr.com/tech/alibaba-launches-new-qwen3-ai-with-major-upgrades-to-rival-deepseek/</p>', 'Google May Soon Let You Change That Old, Silly Gmail Address

Read More: https://www.bgr.com/tech/alibaba-launches-new-qwen3-ai-with-major-upgrades-to-rival-deepseek/', '/uploads/images/blog-0c35e25a-187b-4cd3-8eca-0573b46ab7d2-1767113176455-504804511.jpg', 'draft', '{"#AI Agent #Chatbot #GenAI #Customer Support"}', 4, 1, '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '660e8400-e29b-41d4-a716-446655440002', '{}', '2025-12-30 16:46:16.459+00', '2025-12-30 16:59:47.261+00');
INSERT INTO "public"."blogs" VALUES ('133e8d7e-f6e5-4eb6-a349-d2d896b3b02b', 'TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8', 'trai-nghiem-hoc-thu-react-native-devops-c-vo-cung-chat-luong-cung-f8', '<p>****F8 từ lâu đã được biết đến là cộng đồng học lập trình uy tín với hàng chục nghìn học viên. Điểm khác biệt lớn nhất của F8 chính là phương pháp học thực chiến – học tới đâu, làm sản phẩm tới đó, luôn có giảng viên và trợ giảng đồng hành sát sao.</p><p>Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy, F8 đã xây dựng 3 lớp học thử với lộ trình rõ ràng.</p><h2><strong>C++ (Miễn phí) – Nền tảng vững chắc cho người mới</strong></h2><p>Dành riêng cho các bạn sinh viên IT hoặc những ai bắt đầu hành trình lập trình. Buổi học thử C++ tập trung vào:</p><p>- Biến, vòng lặp, hàm cơ bản</p><p>- Thực hành các bài toán nhỏ như tìm số nguyên tố, quản lý danh sách</p><p>- Rèn luyện tư duy thuật toán và code tối ưu</p><p><i><strong>Link đăng ký học C++: </strong></i><a href="https://forms.gle/1ee37tp3AGAh49Bp7"><i><strong>https://forms.gle/1ee37tp3AGAh49Bp7</strong></i></a></p><h2><strong>React Native (Thu phí) – Bước đệm sang thế giới Mobile App</strong></h2><p>Nếu bạn đã quen với JavaScript/React và muốn “nhảy” sang phát triển ứng dụng di động, đây là lựa chọn lý tưởng. Trong buổi học thử, học viên được:</p><p>- Cài đặt môi trường, chạy ứng dụng mẫu</p><p>- Dựng các màn hình cơ bản</p><p>- Kết nối API để ứng dụng chạy được ngay trên điện thoại</p><p>Giảng viên trực tiếp đứng lớp là anh Tạ Hoàng Anh với hơn 13 năm kinh nghiệm lập trình, 10 năm giảng dạy.</p><p><i>Link đăng ký học React Native: </i><a href="https://forms.gle/Uy69PqkM6MisCvp26"><i>https://forms.gle/Uy69PqkM6MisCvp26</i></a></p><h2><strong>DevOps (Thu phí) – Tiếp cận hạ tầng và triển khai hệ thống chuyên nghiệp</strong></h2><p>Với những ai quan tâm đến vận hành, triển khai ứng dụng, lớp học thử DevOps sẽ mang đến trải nghiệm vô cùng thực tế. Bạn sẽ đi qua lộ trình 3 buổi gồm: Linux &amp; Docker, VPC &amp; Networking, triển khai dịch vụ AWS.</p><p>Lớp học do anh Trần Xuân Bảng – Techlead tại Otani, với hơn 5 năm kinh nghiệm trực tiếp giảng dạy.</p><p><i>Link đăng ký DevOps: </i><a href="https://forms.gle/r37cf9TMDQLdhB418"><i>https://forms.gle/r37cf9TMDQLdhB418</i></a></p><p><strong>🎯 Lợi ích khi tham gia lớp học thử F8</strong></p><p>Ngoài lộ trình bài bản, bạn còn nhận được:</p><p>✅ Học và hỏi đáp trực tiếp với giảng viên</p><p>✅ Trợ giảng hỗ trợ xuyên suốt, fixx bug ngay tại lớp</p><p>✅ Được định hướng lộ trình học phù hợp sau khi trải nghiệm</p><p>👉 Nếu bạn đang tìm một môi trường học lập trình nghiêm túc, thực tế và giàu cảm hứng – hãy thử một buổi học tại F8 nha!</p>', 'TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8', '/uploads/images/blog-0c35e25a-187b-4cd3-8eca-0573b46ab7d2-1767232972838-435256373.jpg', 'published', '{"#AI Agent #Chatbot #GenAI #Customer Support"}', 23, 2, '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '660e8400-e29b-41d4-a716-446655440013', '{}', '2026-01-01 02:02:53.026+00', '2026-01-02 11:45:38.473+00');
INSERT INTO "public"."blogs" VALUES ('a2bfe5b7-7aaa-4e74-9253-1c3465bd4f80', 'this', 'this', '<p>this là một khái niệm gây lú trong Javascript. Có thể coi nó như nước ngoài đời thật.</p><p>- Nếu nước được rót vào ly, nó sẽ có hình dạng của chiếc ly.</p><p>- Nếu nước được đựng trong chiếc lu, nó sẽ có hình dạng của chiếc lu đấy.</p><blockquote><p><strong>this không được quyết định tại lúc khai báo, mà được quyết định tại lúc gọi hàm.</strong></p></blockquote><p>Nói cách khác:</p><ul><li>this không cố định</li><li>this phụ thuộc vào ngữ cảnh gọi hàm</li></ul><p>Javascript xác định giá trị của this dựa trên <strong>cách function được gọi</strong>, không phải function được viết ở đâu.</p><p>----------------------------------------------------------------------------------------------------</p><p><strong>Xác định</strong> this</p><p>----------------------------------------------------------------------------------------------------</p><p><strong>Plain Function Call</strong></p><p>Với cách gọi hàm độc lập, Javascript sẽ không biết bind &nbsp;this&nbsp; cho ai, do function không thuộc object nào và cũng không ai sở hữu function.</p><p>function greeting() {
	console.log(this);
}

greeting(); // undefined
</p><p>&nbsp;</p><p>Output sẽ cho ra &nbsp;<i>undefined</i>&nbsp; (strict) hoặc &nbsp;<i>Global Object</i>&nbsp; (none-strict).</p><p>Đối với &nbsp;<strong>node.js</strong>&nbsp; hoặc &nbsp;<strong>class, module</strong>&nbsp; sẽ cho ra &nbsp;<i>undefined</i>&nbsp; vì trong ES6 mặc định sẽ dùng strict mode.</p><p>Với browser sẽ trả về &nbsp;<i>Global Object</i>&nbsp; là &nbsp;<i>window</i>.</p><p>----------------------------------------------------------------------------------------------------</p><p><strong>Losing Context</strong></p><p>Đây là tình trạng mất context khi tách hàm khỏi object dẫn đến mất this.</p><p>const user = {
	name: "Minh",
	greeting() {
		console.log(this.name);
	}
};


const fn = user.greeting;
fn(); // undefined
</p><p>&nbsp;</p><p>Phần body của greeting() được gán cho fn(), this đã bị tách khỏi user dẫn đến mất ngữ cảnh.</p><p>Lúc này, fn() được gọi như một hàm độc lập và cho kết quả là <i>undefined</i>.</p><blockquote><p><strong>this nằm trong method greeting của user nên this phải là user. ⇒ Sai hoàn toàn</strong></p><p><strong>Nên nhớ ⇒ this không cố định và phụ thuộc vào cách hàm được gọi.</strong></p></blockquote><p>----------------------------------------------------------------------------------------------------</p><p><strong>Arrow Function không có</strong> this <strong>riêng</strong></p><p>Arrow Function không tạo this của riêng nó, this được lấy từ <i>scope bên ngoài</i>.</p><p>const user = {
	name: "Minh",
	greeting: () =&gt; {
		console.log(this.name);
	}
};

user.greeting(); // undefined
</p><p>&nbsp;</p><p>greeting là <i>arrow function</i> nên không có this, this được lấy từ scope bên ngoài mà scope bên ngoài của greeting là <i>global scope</i> không phải user.</p><p><strong>Lưu ý với Arrow Function:</strong></p><ul><li>Methods của Object không nên dùng Arrow Function.</li><li>Chỉ nên dùng Arrow Function trong callback để giữ this của function cha.</li></ul><p>const user = {
	name: "Minh",
	greeting() {
		setTimeout(() =&gt; {
			console.log(this.name);
		}, 1000);
	}
};

user.greeting(); // Minh
</p><p>&nbsp;</p><p>----------------------------------------------------------------------------------------------------</p><p>this <strong>trong</strong> call, apply, bind</p><p>Với call và apply, function được gọi và chỉ định this ngay lập tức. Ngữ cảnh của this phụ thuộc vào đối số được truyền vào call/apply</p><p>function greeting() {
	console.log(this.name);
}

greeting.call({ name: "Minh" }); // Minh
</p><p>&nbsp;</p><p>Với bind hàm được gọi và trả về hàm mới với this cố định.</p><p>const user = {
 &nbsp;name: "Minh"
};

function greeting() {
 &nbsp;console.log(this.name);
}

const boundFn = greeting.bind(user);
boundFn(); // Minh
</p><p>&nbsp;</p><p>----------------------------------------------------------------------------------------------------</p><p><strong>Thứ tự ưu tiên</strong></p><ol><li>new</li><li>bind()</li><li>call() / apply()</li><li>Gọi qua object obj.method()</li><li>Gọi hàm độc lập (undefined trong strict mode)</li></ol><p>----------------------------------------------------------------------------------------------------</p><p>Đây là kiến thức mình học được, có sai sót gì mọi người hãy góp ý nhá!!</p><p><br>&nbsp;</p>', 'this', '/uploads/images/blog-0c35e25a-187b-4cd3-8eca-0573b46ab7d2-1767113611946-853507677.jpg', 'published', '{"#AI Agent #Chatbot #GenAI #Customer Support"}', 35, 3, '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, '{}', '2025-12-30 16:53:31.949+00', '2026-01-02 12:15:14.002+00');
INSERT INTO "public"."blogs" VALUES ('c2a44f85-6fcf-4a49-82e7-210f72cc2286', '222 âu đã được biết đến là cộng đồng học lập trình', '222-au-a-uoc-biet-en-la-cong-ong-hoc-lap-trinh', '<p>222 &nbsp;từ lâu đã được biết đến là cộng đồng học lập trình uy tín với hàng chục nghìn học viên. Điểm khác biệt lớn nhất của F8 chính là phương pháp học thực chiến – học tới đâu, làm sản phẩm tới đó, luôn có giảng viên và trợ giảng đồng hành sát sao.</p><p>Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy, F8 đã xây dựng 3 lớp học thử với lộ trình rõ ràng.</p><p>C++ (Miễn phí) – Nền tảng vững chắc cho người mới</p><p>Dành riêng cho các bạn sinh viên IT hoặc những ai bắt đầu hành trình lập trình. Buổi họ</p>', '222  lâu đã được biết đến là cộng đồng học lập trình', '/uploads/images/blog-0c35e25a-187b-4cd3-8eca-0573b46ab7d2-1767253874806-971744197.jpg', 'published', '{"2 22 Agent #Chatbot #GenAI #Customer Support"}', 102, 1, '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '660e8400-e29b-41d4-a716-446655440013', '{}', '2026-01-01 03:35:55.31+00', '2026-01-02 14:51:20.657+00');

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."categories";
CREATE TABLE "public"."categories" (
  "id" uuid NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "icon" varchar(255) COLLATE "pg_catalog"."default",
  "color" varchar(255) COLLATE "pg_catalog"."default",
  "parent_id" uuid,
  "order_index" int4 NOT NULL DEFAULT 0,
  "is_active" bool NOT NULL DEFAULT true,
  "course_count" int4 NOT NULL DEFAULT 0,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440003', 'Mạng máy tính', 'mang-may-tinh', 'Các khóa học về mạng và bảo mật', 'network', '#F59E0B', NULL, 3, 't', 0, '{}', '2025-12-27 16:06:56.475711+00', '2025-12-27 16:06:56.475711+00');
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440004', 'Trí tuệ nhân tạo', 'tri-tue-nhan-tao', 'Các khóa học về AI và Machine Learning', 'brain', '#8B5CF6', NULL, 4, 't', 0, '{}', '2025-12-27 16:06:56.475711+00', '2025-12-27 16:06:56.475711+00');
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440011', 'Web Development', 'web-development', 'Lập trình web frontend và backend', 'globe', '#3B82F6', '660e8400-e29b-41d4-a716-446655440001', 1, 't', 0, '{}', '2025-12-27 16:06:56.475711+00', '2025-12-27 16:06:56.475711+00');
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440012', 'Mobile Development', 'mobile-development', 'Lập trình ứng dụng di động', 'mobile', '#3B82F6', '660e8400-e29b-41d4-a716-446655440001', 2, 't', 0, '{}', '2025-12-27 16:06:56.475711+00', '2025-12-27 16:06:56.475711+00');
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440001', 'Lập trình2', 'lp-trnh2', 'Các khóa học về lập trình và phát triển phần mềm 2', 'code 1', '#4b5463', NULL, 1, 't', 0, '{}', '2025-12-27 16:06:56.475711+00', '2025-12-28 03:13:30.085+00');
INSERT INTO "public"."categories" VALUES ('69b9adac-9b72-46d5-bf4b-c2733241c11c', 'danh miuc', '1', 'mo ta', 'code 1', '#5e646e', NULL, 1, 't', 0, '{}', '2025-12-28 03:14:35.703+00', '2025-12-28 03:14:35.703+00');
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440013', 'Algorithms & Data Structures', 'algorithms-data-structures', 'Thuật toán và cấu trúc dữ liệu', 'algorithm', '#3B82F6', '660e8400-e29b-41d4-a716-446655440001', 3, 't', 3, '{}', '2025-12-27 16:06:56.475711+00', '2025-12-28 05:37:24.667+00');
INSERT INTO "public"."categories" VALUES ('660e8400-e29b-41d4-a716-446655440002', 'Cơ sở dữ liệu', 'co-so-du-lieu', 'Các khóa học về quản lý và thiết kế cơ sở dữ liệu', 'database', '#10B981', NULL, 2, 't', 5, '{}', '2025-12-27 16:06:56.475711+00', '2026-01-01 08:54:40.312+00');

-- ----------------------------
-- Table structure for certificates
-- ----------------------------
DROP TABLE IF EXISTS "public"."certificates";
CREATE TABLE "public"."certificates" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "course_id" uuid NOT NULL,
  "enrollment_id" uuid NOT NULL,
  "certificate_number" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "issued_at" timestamptz(6) NOT NULL,
  "pdf_path" varchar(255) COLLATE "pg_catalog"."default",
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of certificates
-- ----------------------------
INSERT INTO "public"."certificates" VALUES ('879176b4-a8a8-410d-b292-4aa1690049d3', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'STUDYMATE-1767335144221-NOK8AM', '2026-01-02 06:25:44.308+00', 'certificate-STUDYMATE-1767335144221-NOK8AM.pdf', '{"course_title": "Lập trình Web với React 1", "student_name": "Nguyễn Hiếu1", "instructor_name": "Phạm Thế Sơn", "progress_percentage": 100}', '2026-01-02 06:25:44.309+00', '2026-01-02 06:25:44.309+00');
INSERT INTO "public"."certificates" VALUES ('b21f71f1-c667-4459-bb76-9acdf11d885e', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'STUDYMATE-1767339973159-70LCW2', '2026-01-02 07:46:13.282+00', 'certificate-STUDYMATE-1767339973159-70LCW2.pdf', '{"course_title": "Lập trình Web với React 1", "student_name": "Nguyễn hiếu", "instructor_name": "Phạm Thế Sơn", "progress_percentage": 100}', '2026-01-02 07:46:13.282+00', '2026-01-02 07:46:13.282+00');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS "public"."comments";
CREATE TABLE "public"."comments" (
  "id" uuid NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "course_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "parent_id" uuid,
  "is_edited" bool DEFAULT false,
  "edited_at" timestamptz(6),
  "status" "public"."enum_comments_status" DEFAULT 'active'::enum_comments_status,
  "likes_count" int4 DEFAULT 0,
  "reports_count" int4 DEFAULT 0,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."comments"."parent_id" IS 'For nested replies - null for top-level comments';
COMMENT ON COLUMN "public"."comments"."is_edited" IS 'Track if comment has been edited';
COMMENT ON COLUMN "public"."comments"."edited_at" IS 'Timestamp when comment was last edited';
COMMENT ON COLUMN "public"."comments"."status" IS 'active=visible, hidden=by admin, deleted=soft delete';
COMMENT ON COLUMN "public"."comments"."metadata" IS 'Extra metadata like mentions, attachments, etc.';

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO "public"."comments" VALUES ('6a575d2c-bcff-4e2b-a0ed-e060f41155a3', '4545', '770e8400-e29b-41d4-a716-446655440001', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2026-01-01 08:32:01.187+00', '2026-01-01 08:32:01.187+00');
INSERT INTO "public"."comments" VALUES ('9c963543-4a48-44f5-9004-486dc190d497', 'ádasd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 1, 0, '{"likedBy": ["0c35e25a-187b-4cd3-8eca-0573b46ab7d2"]}', '2025-12-30 15:48:05.431+00', '2025-12-30 15:48:53.47+00');
INSERT INTO "public"."comments" VALUES ('c380de93-671a-4865-ae7e-65fda7dbcd2a', 'ádasdasd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:48:58.219+00', '2025-12-30 15:48:58.219+00');
INSERT INTO "public"."comments" VALUES ('0e716c5c-a446-4b0d-9f0a-6184eb18b5e8', 'qưeqwe', '770e8400-e29b-41d4-a716-446655440004', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2026-01-01 11:57:22.128+00', '2026-01-01 11:57:22.128+00');
INSERT INTO "public"."comments" VALUES ('f764b19f-dae6-47ed-89ad-e629265e6dba', 'a', '770e8400-e29b-41d4-a716-446655440001', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2026-01-02 07:32:58.107+00', '2026-01-02 07:32:58.107+00');
INSERT INTO "public"."comments" VALUES ('0ee2a070-2259-4176-8589-dd3442926822', 'rtr', '770e8400-e29b-41d4-a716-446655440001', 'ecf55b08-c063-4554-b92e-0d384f2869dd', NULL, 'f', NULL, 'active', 0, 0, '{}', '2026-01-02 07:46:24.161+00', '2026-01-02 07:46:24.161+00');
INSERT INTO "public"."comments" VALUES ('98c21af8-a3f9-42fc-a4d9-a1547174472e', 'sấdasd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 1, 0, '{"likedBy": ["0c35e25a-187b-4cd3-8eca-0573b46ab7d2"]}', '2025-12-30 15:49:00.104+00', '2025-12-30 15:50:01.459+00');
INSERT INTO "public"."comments" VALUES ('2e5fa803-f99f-41eb-a3e3-16a5b47c04a8', '3333', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 1, 0, '{"likedBy": ["0c35e25a-187b-4cd3-8eca-0573b46ab7d2"]}', '2025-12-30 15:49:03.052+00', '2025-12-30 15:50:26.029+00');
INSERT INTO "public"."comments" VALUES ('eb92a5fd-c56b-460a-b4e3-918e5d07311c', 'adasd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:51:25.355+00', '2025-12-30 15:51:25.355+00');
INSERT INTO "public"."comments" VALUES ('ea7afbb5-770c-4b5c-93af-e4cfa5a2e1ac', 'đâsd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:51:26.779+00', '2025-12-30 15:51:26.779+00');
INSERT INTO "public"."comments" VALUES ('d765d1d5-4e94-4435-93bd-b801a01fb5de', 'ádada', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:51:27.834+00', '2025-12-30 15:51:27.834+00');
INSERT INTO "public"."comments" VALUES ('6e5bf8c0-9fa4-4c2b-a92e-5c9e43bd8a7e', 'adsadad', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:51:29.274+00', '2025-12-30 15:51:29.274+00');
INSERT INTO "public"."comments" VALUES ('79ef57a0-09f9-4234-9d57-2e79cc05b101', 'áddasd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:51:30.424+00', '2025-12-30 15:51:30.424+00');
INSERT INTO "public"."comments" VALUES ('ab650760-51dc-48d5-8c6e-11e30b7e2c26', 'ưerwer', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '5375a474-58b7-42c2-b553-87d0cc438eea', 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:53:14.903+00', '2025-12-30 15:53:14.903+00');
INSERT INTO "public"."comments" VALUES ('34883ccd-6dae-44bf-896f-59747ffa04e5', 'ưerwer', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '5375a474-58b7-42c2-b553-87d0cc438eea', 'f', NULL, 'active', 0, 0, '{}', '2025-12-30 15:53:31.784+00', '2025-12-30 15:53:31.784+00');
INSERT INTO "public"."comments" VALUES ('5375a474-58b7-42c2-b553-87d0cc438eea', 'ádsd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{"likedBy": []}', '2025-12-30 15:51:35.007+00', '2025-12-30 16:05:13.525+00');
INSERT INTO "public"."comments" VALUES ('a03cb861-085d-440d-9773-ab244673abdd', 'ẻwrwer', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{}', '2025-12-30 16:10:11.626+00', '2025-12-30 16:10:18.801+00');
INSERT INTO "public"."comments" VALUES ('f8f569ba-98dd-4943-a114-27fffa4a14e6', 'ewrere', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{}', '2025-12-30 16:09:14.608+00', '2025-12-30 16:10:20.46+00');
INSERT INTO "public"."comments" VALUES ('7a65f2eb-4ae7-4f73-990a-d9fdbba4e65e', 'đâsd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{}', '2025-12-30 16:11:58.264+00', '2025-12-30 16:12:00.363+00');
INSERT INTO "public"."comments" VALUES ('7769b289-8ed4-4ca6-8578-4d1373a8ca85', 'ádads', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{}', '2025-12-30 15:51:33.971+00', '2025-12-30 16:12:02.065+00');
INSERT INTO "public"."comments" VALUES ('6a7bd291-ed8b-4a8c-acc0-56bea1f9bb35', 'ádasd', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{}', '2025-12-30 16:13:59.836+00', '2025-12-30 16:14:01.851+00');
INSERT INTO "public"."comments" VALUES ('af183770-ee97-4cc6-9b8a-202f297bdbd9', 'adsada', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 1, 0, '{"likedBy": ["0c35e25a-187b-4cd3-8eca-0573b46ab7d2"]}', '2025-12-30 15:51:32.865+00', '2025-12-30 16:14:03.808+00');
INSERT INTO "public"."comments" VALUES ('24d07920-280c-4525-af5d-e103bf64c1aa', 'sadasdasdsdsd 1111', '770e8400-e29b-41d4-a716-446655440007', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 't', '2025-12-30 16:14:11.345+00', 'deleted', 0, 0, '{}', '2025-12-30 15:51:31.889+00', '2025-12-30 16:14:13.899+00');
INSERT INTO "public"."comments" VALUES ('a9d65f1d-bb8c-4f12-a6bf-1c479a971d3d', 'sdfsdfd', '770e8400-e29b-41d4-a716-446655440004', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'deleted', 0, 0, '{}', '2025-12-30 16:14:26.226+00', '2025-12-30 16:14:29.048+00');
INSERT INTO "public"."comments" VALUES ('d7557179-391c-477b-83d3-85da95867849', 'zxc', '770e8400-e29b-41d4-a716-446655440004', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2026-01-01 05:39:16.194+00', '2026-01-01 05:39:16.194+00');
INSERT INTO "public"."comments" VALUES ('fe0b8b34-d5de-441f-ab28-7f38dee184d7', 'xczxcxxxx', '770e8400-e29b-41d4-a716-446655440004', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 't', '2026-01-01 05:39:19.939+00', 'active', 0, 0, '{}', '2026-01-01 05:39:17.639+00', '2026-01-01 05:39:19.939+00');
INSERT INTO "public"."comments" VALUES ('1f374a11-b373-454c-b7ee-fe6e2f17b6d7', '4545', '770e8400-e29b-41d4-a716-446655440001', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', NULL, 'f', NULL, 'active', 0, 0, '{}', '2026-01-01 08:31:59.621+00', '2026-01-01 08:31:59.621+00');

-- ----------------------------
-- Table structure for contacts
-- ----------------------------
DROP TABLE IF EXISTS "public"."contacts";
CREATE TABLE "public"."contacts" (
  "id" uuid NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "subject" "public"."enum_contacts_subject" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."enum_contacts_status" DEFAULT 'pending'::enum_contacts_status,
  "priority" "public"."enum_contacts_priority" DEFAULT 'medium'::enum_contacts_priority,
  "user_id" uuid,
  "admin_notes" text COLLATE "pg_catalog"."default",
  "resolved_at" timestamptz(6),
  "ip_address" varchar(255) COLLATE "pg_catalog"."default",
  "user_agent" varchar(500) COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of contacts
-- ----------------------------
INSERT INTO "public"."contacts" VALUES ('b5121171-97fa-47fb-bb3c-ee05230f51d5', 'Nguyễn Minh hiếu', 'nguyenminhhieu28092001k3@gmail.com', 'account_help', 'aaaaaaaaaaaaaaaaaaaaaaaaa', 'in_progress', 'high', NULL, 'done 11 111', '2025-12-28 03:21:44.848+00', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-27 15:47:02.076+00', '2026-01-01 11:48:02.587+00');

-- ----------------------------
-- Table structure for contents
-- ----------------------------
DROP TABLE IF EXISTS "public"."contents";
CREATE TABLE "public"."contents" (
  "id" uuid NOT NULL,
  "course_id" uuid NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "content_type" "public"."enum_contents_content_type" DEFAULT 'lesson'::enum_contents_content_type,
  "body" text COLLATE "pg_catalog"."default",
  "video_url" varchar(255) COLLATE "pg_catalog"."default",
  "order_index" int4 DEFAULT 0,
  "is_free" bool DEFAULT false,
  "status" "public"."enum_contents_status" DEFAULT 'draft'::enum_contents_status,
  "estimated_duration" int4,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of contents
-- ----------------------------
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Giới thiệu Node.js', 'gioi-thieu-nodejs', 'Tìm hiểu về Node.js và môi trường runtime', 'lesson', '<h2>Node.js là gì?</h2><p>Node.js là một runtime environment...</p>', NULL, 1, 't', 'published', 20, '2025-12-27 16:06:56.496011+00', '2025-12-27 16:06:56.496011+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'Express.js Framework', 'expressjs-framework', 'Học cách sử dụng Express.js để xây dựng API', 'video', '<p>Video hướng dẫn Express.js</p>', 'https://example.com/videos/express.mp4', 2, 't', 'published', 30, '2025-12-27 16:06:56.496011+00', '2025-12-27 16:06:56.496011+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', 'Thiết kế Database Schema', 'thiet-ke-database-schema', 'Học cách thiết kế schema hiệu quả', 'lesson', '<h2>Database Design</h2><p>Thiết kế database là bước quan trọng...</p>', NULL, 1, 't', 'published', 25, '2025-12-27 16:06:56.496011+00', '2025-12-27 16:06:56.496011+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', 'Query Optimization', 'query-optimization', 'Tối ưu hóa truy vấn SQL', 'lesson', '<h2>Optimization Techniques</h2><p>Các kỹ thuật tối ưu hóa...</p>', NULL, 2, 't', 'published', 30, '2025-12-27 16:06:56.496011+00', '2025-12-27 16:06:56.496011+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440005', 'Giới thiệu Machine Learning', 'gioi-thieu-machine-learning', 'Tổng quan về Machine Learning', 'lesson', '<h2>ML Overview</h2><p>Machine Learning là gì...</p>', NULL, 1, 't', 'published', 20, '2025-12-27 16:06:56.496011+00', '2025-12-27 16:06:56.496011+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440005', 'Linear Regression', 'linear-regression', 'Học thuật toán Linear Regression', 'video', '<p>Video về Linear Regression</p>', 'https://example.com/videos/linear-regression.mp4', 2, 't', 'published', 25, '2025-12-27 16:06:56.496011+00', '2025-12-27 16:06:56.496011+00');
INSERT INTO "public"."contents" VALUES ('1546b3c6-11d6-4147-a8f0-2f9bc4648929', '770e8400-e29b-41d4-a716-446655440001', 'SOLID – 5 nguyên lý “vàng” giúp viết code sạch và dễ bảo trì', 'solid-5-nguyen-ly-vang-giup-viet-code-sach-va-de-bao-tri', '<p>rong hành trình phát triển phần mềm, chắc hẳn bạn đã từng gặp phải những đoạn code dài, khó hiểu và rất khó mở rộng hay sửa chữa. Đó là dấu hiệu cho thấy thiết kế phần mềm đang gặp vấn đề.</p>', 'document', '<p><a href="https://f8.edu.vn/blog/solid-5-nguyen-ly-vang-giup-viet-code-sach-va-de-bao-tri">https://f8.edu.vn/blog/solid-5-nguyen-ly-vang-giup-viet-code-sach-va-de-bao-tri</a></p><p>&nbsp;</p><p>http://localhost:3000/admin/contents/1546b3c6-11d6-4147-a8f0-2f9bc4648929/edit</p>', NULL, 5, 'f', 'published', 10, '2026-01-01 12:52:10.574+00', '2026-01-01 12:52:56.218+00');
INSERT INTO "public"."contents" VALUES ('91920159-e930-404f-b332-f552f4db2c59', '770e8400-e29b-41d4-a716-446655440003', 'Thông tin cơ bả', 'thong-tin-co-ba', '<h2><strong>Thông tin cơ bảThông tin cơ bảThông tin cơ bả</strong></h2>', 'lesson', '<h2><strong>Thông tin cơ bảThông tin cơ bả</strong></h2>', NULL, 1, 't', 'published', 12, '2026-01-01 03:26:18.625+00', '2026-01-01 03:26:18.625+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'Quiz: React Basics', 'quiz-react-basics', '<p>Kiểm tra kiến thức về React cơ bản</p>', 'quiz', NULL, NULL, 4, 'f', 'published', 10, '2025-12-27 16:06:56.496011+00', '2026-01-01 11:51:58.948+00');
INSERT INTO "public"."contents" VALUES ('962c16d9-ff6e-4208-8143-f40bcdff16ff', '770e8400-e29b-41d4-a716-446655440001', 'Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):', 'single-responsibility-principle-nguyen-ly-trach-nhiem-duy-nhat', '<p><strong>Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):</strong></p>', 'quiz', '<h4><strong>Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):</strong></h4>', NULL, 6, 'f', 'published', 11, '2026-01-01 12:54:52.161+00', '2026-01-01 12:54:52.161+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Components và Props', 'components-va-props', '<p>Học về React Components và cách truyền props</p>', 'lesson', '<h2>Components</h2><p>Components là các khối xây dựng của ứng dụng React...</p>', NULL, 2, 'f', 'published', 20, '2025-12-27 16:06:56.496011+00', '2026-01-01 11:52:10.105+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440004', 'JOIN và Subqueries', 'join-va-subqueries', '<p>Học cách sử dụng JOIN và subqueries</p>', 'video', '<p>Video hướng dẫn JOIN</p>', 'https://example.com/videos/sql-join.mp4', 2, 'f', 'published', 20, '2025-12-27 16:06:56.496011+00', '2026-01-01 11:55:43.466+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', 'SQL SELECT cơ bản', 'sql-select-co-ban', '<p>Học câu lệnh SELECT trong SQL</p><p><strong>ádasd</strong></p><p>&nbsp;</p><p><strong>12323</strong></p>', 'lesson', '<h2>SELECT Statement</h2><p>SELECT là câu lệnh cơ bản nhất...</p>', NULL, 1, 't', 'published', 15, '2025-12-27 16:06:56.496011+00', '2026-01-01 12:02:43.047+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'TRẢI NGHIỆM HỌC THỬ REACT NATIVE, DEVOPS, C++ VÔ CÙNG CHẤT LƯỢNG CÙNG F8', 'gioi-thieu-ve-react', '<p>****F8 từ lâu đã được biết đến là cộng đồng học lập trình uy tín với hàng chục nghìn học viên. Điểm khác biệt lớn nhất của F8 chính là phương pháp học thực chiến – học tới đâu, làm sản phẩm tới đó, luôn có giảng viên và trợ giảng đồng hành sát sao.</p><p>Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy, F8 đã xây dựng 3 lớp học thử với lộ trình rõ ràng.</p>', 'lesson', '<p>****F8 từ lâu đã được biết đến là cộng đồng học lập trình uy tín với hàng chục nghìn học viên. Điểm khác biệt lớn nhất của F8 chính là phương pháp học thực chiến – học tới đâu, làm sản phẩm tới đó, luôn có giảng viên và trợ giảng đồng hành sát sao.</p><p>Để giúp học viên mới cảm nhận rõ ràng chất lượng giảng dạy, F8 đã xây dựng 3 lớp học thử với lộ trình rõ ràng.</p><p><strong>C++ (Miễn phí) – Nền tảng vững chắc cho người mới</strong></p><p>Dành riêng cho các bạn sinh viên IT hoặc những ai bắt đầu hành trình lập trình. Buổi học thử C++ tập trung vào:</p><p>- Biến, vòng lặp, hàm cơ bản</p><p>- Thực hành các bài toán nhỏ như tìm số nguyên tố, quản lý danh sách</p><p>- Rèn luyện tư duy thuật toán và code tối ưu</p><p><i><strong>Link đăng ký học C++: </strong></i><a href="https://forms.gle/1ee37tp3AGAh49Bp7"><i><strong>https://forms.gle/1ee37tp3AGAh49Bp7</strong></i></a></p><p><strong>React Native (Thu phí) – Bước đệm sang thế giới Mobile App</strong></p><p>Nếu bạn đã quen với JavaScript/React và muốn “nhảy” sang phát triển ứng dụng di động, đây là lựa chọn lý tưởng. Trong buổi học thử, học viên được:</p><p>- Cài đặt môi trường, chạy ứng dụng mẫu</p><p>- Dựng các màn hình cơ bản</p><p>- Kết nối API để ứng dụng chạy được ngay trên điện thoại</p><p>Giảng viên trực tiếp đứng lớp là anh Tạ Hoàng Anh với hơn 13 năm kinh nghiệm lập trình, 10 năm giảng dạy.</p><p><i>Link đăng ký học React Native: </i><a href="https://forms.gle/Uy69PqkM6MisCvp26"><i>https://forms.gle/Uy69PqkM6MisCvp26</i></a></p><p><strong>DevOps (Thu phí) – Tiếp cận hạ tầng và triển khai hệ thống chuyên nghiệp</strong></p><p>Với những ai quan tâm đến vận hành, triển khai ứng dụng, lớp học thử DevOps sẽ mang đến trải nghiệm vô cùng thực tế. Bạn sẽ đi qua lộ trình 3 buổi gồm: Linux &amp; Docker, VPC &amp; Networking, triển khai dịch vụ AWS.</p><p>Lớp học do anh Trần Xuân Bảng – Techlead tại Otani, với hơn 5 năm kinh nghiệm trực tiếp giảng dạy.</p><p><i>Link đăng ký DevOps: </i><a href="https://forms.gle/r37cf9TMDQLdhB418"><i>https://forms.gle/r37cf9TMDQLdhB418</i></a></p><p><strong>🎯 Lợi ích khi tham gia lớp học thử F8</strong></p><p>Ngoài lộ trình bài bản, bạn còn nhận được:</p><p>✅ Học và hỏi đáp trực tiếp với giảng viên</p><p>✅ Trợ giảng hỗ trợ xuyên suốt, fixx bug ngay tại lớp</p><p>✅ Được định hướng lộ trình học phù hợp sau khi trải nghiệm</p><p>👉 Nếu bạn đang tìm một môi trường học lập trình nghiêm túc, thực tế và giàu cảm hứng – hãy thử một buổi học tại F8 nha!</p>', NULL, 1, 't', 'published', 15, '2025-12-27 16:06:56.496011+00', '2026-01-01 12:16:57.458+00');
INSERT INTO "public"."contents" VALUES ('e4f73937-da78-4aa2-843f-2b0a10638bea', '770e8400-e29b-41d4-a716-446655440001', 'Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):', 'single-responsibility-principle-nguyen-ly-trach-nhiem-duy-nhat-1', '<p><strong>Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):</strong></p>', 'assignment', '<h4><strong>Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):</strong></h4>', NULL, 111, 'f', 'published', 123, '2026-01-01 12:55:30.493+00', '2026-01-01 12:55:30.493+00');
INSERT INTO "public"."contents" VALUES ('34627b6b-f501-48c4-b5fd-86921d8a157a', '770e8400-e29b-41d4-a716-446655440001', 'Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):', 'single-responsibility-principle-nguyen-ly-trach-nhiem-duy-nhat-1', '<p><strong>Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):</strong></p>', 'assignment', '<h4><strong>Single Responsibility Principle (Nguyên lý trách nhiệm duy nhất):</strong></h4>', NULL, 111, 'f', 'published', 123, '2026-01-01 12:55:30.55+00', '2026-01-01 12:55:30.55+00');
INSERT INTO "public"."contents" VALUES ('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'State và Hooks', 'state-va-hooks', '<p>Học về React State và Hooks API</p>', 'video', '<p>Video hướng dẫn về State và Hooks</p>', 'http://localhost:3000/minio/studymate/1767253621823-A_n_Ta_i_Ma_i_NgA_y_La_i_vA_Ha_i.mp4', 3, 'f', 'published', 25, '2025-12-27 16:06:56.496011+00', '2026-01-02 07:53:48.248+00');

-- ----------------------------
-- Table structure for conversations
-- ----------------------------
DROP TABLE IF EXISTS "public"."conversations";
CREATE TABLE "public"."conversations" (
  "id" uuid NOT NULL,
  "user1_id" uuid NOT NULL,
  "user2_id" uuid NOT NULL,
  "last_message_id" uuid,
  "last_message_at" timestamptz(6),
  "user1_unread_count" int4 DEFAULT 0,
  "user2_unread_count" int4 DEFAULT 0,
  "is_active" bool DEFAULT true,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of conversations
-- ----------------------------
INSERT INTO "public"."conversations" VALUES ('f733911f-60ab-4384-a4dd-ca679363227b', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '550e8400-e29b-41d4-a716-446655440002', 'fca29e82-ad72-4098-87dd-8c4c9b356c26', '2025-12-27 18:00:13.319+00', 0, 1, 't', '2025-12-27 18:00:10.723+00', '2025-12-27 18:00:13.319+00');
INSERT INTO "public"."conversations" VALUES ('4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'dd50c0d3-7907-4cc3-b28e-ac30f2be7bdb', '2026-01-02 11:15:34.663+00', 0, 0, 't', '2025-12-27 18:01:48.073+00', '2026-01-02 11:58:27.896+00');
INSERT INTO "public"."conversations" VALUES ('b503bd0c-c235-4ba0-998d-b8d731f9cc24', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '00000000-0000-0000-0000-000000000001', 'aa4034c3-177a-4907-9dd7-caaab5cbe148', '2026-01-02 11:58:57.406+00', 0, 1, 't', '2026-01-02 10:12:47.238+00', '2026-01-02 11:58:57.406+00');
INSERT INTO "public"."conversations" VALUES ('a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '00000000-0000-0000-0000-000000000001', '4c448be3-86a5-4f9c-9ce0-b191f7d03206', '2026-01-02 13:34:44.671+00', 0, 1, 't', '2026-01-02 09:58:23.684+00', '2026-01-02 13:34:44.672+00');
INSERT INTO "public"."conversations" VALUES ('1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'e12181bf-8f7d-42b5-985d-ccdc1f05b182', '2391371e-3fb4-40d3-9c86-e8714836f25b', '2026-01-01 08:13:24.767+00', 0, 15, 't', '2026-01-01 08:04:58.326+00', '2026-01-01 08:13:24.767+00');
INSERT INTO "public"."conversations" VALUES ('6a198d1d-2d31-4cc7-8690-9941788a036b', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '550e8400-e29b-41d4-a716-446655440004', '452d0dc3-7331-4ec2-aa3e-5b0a8bcf42f5', '2025-12-28 02:56:22.688+00', 0, 1, 't', '2025-12-28 02:55:32.771+00', '2025-12-28 02:56:22.688+00');
INSERT INTO "public"."conversations" VALUES ('aff76611-b0f1-4036-9421-7468fe80bb1f', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'e12181bf-8f7d-42b5-985d-ccdc1f05b182', '296931ac-0c3e-4d1c-944b-7280e3117a1c', '2026-01-02 03:36:13.783+00', 0, 0, 't', '2026-01-02 03:35:43.971+00', '2026-01-02 03:36:17.32+00');
INSERT INTO "public"."conversations" VALUES ('ab1051c9-b948-4c44-bcb2-9969a69fb3c3', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '550e8400-e29b-41d4-a716-446655440001', 'b241193f-e86e-49b5-99a1-004113bd8867', '2026-01-01 07:57:35.413+00', 0, 3, 't', '2025-12-28 03:53:27.043+00', '2026-01-01 07:57:35.413+00');
INSERT INTO "public"."conversations" VALUES ('1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '75937694-d184-49ac-8924-1b7df5018e0f', '3723ae41-96f9-497d-b279-22a1d7fe0102', '2026-01-02 02:59:10.353+00', 0, 6, 't', '2026-01-01 08:52:43.842+00', '2026-01-02 02:59:10.354+00');

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS "public"."courses";
CREATE TABLE "public"."courses" (
  "id" uuid NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "slug" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "short_description" varchar(500) COLLATE "pg_catalog"."default",
  "thumbnail" varchar(255) COLLATE "pg_catalog"."default",
  "instructor_id" uuid NOT NULL,
  "level" "public"."enum_courses_level" DEFAULT 'beginner'::enum_courses_level,
  "price" numeric(10,2) DEFAULT 0,
  "status" "public"."enum_courses_status" DEFAULT 'draft'::enum_courses_status,
  "enrolled_count" int4 DEFAULT 0,
  "average_rating" numeric(3,2),
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL,
  "category_id" uuid
)
;

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440002', 'Node.js và Express.js', 'nodejs-va-expressjs', 'Khóa học về backend development với Node.js và Express.js. Học cách xây dựng RESTful API, authentication, và các best practices.', 'Xây dựng backend server với Node.js và Express.js', NULL, '550e8400-e29b-41d4-a716-446655440011', 'intermediate', 0.00, 'published', 120, 4.60, '2025-12-27 16:06:56.481416+00', '2025-12-27 16:06:56.481416+00', '660e8400-e29b-41d4-a716-446655440011');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440003', 'Cơ sở dữ liệu nâng cao', 'co-so-du-lieu-nang-cao', 'Khóa học về thiết kế và tối ưu hóa cơ sở dữ liệu. Học về indexing, query optimization, transactions, và database design patterns.', 'Thiết kế và tối ưu hóa cơ sở dữ liệu PostgreSQL', NULL, '550e8400-e29b-41d4-a716-446655440011', 'advanced', 0.00, 'published', 90, 4.70, '2025-12-27 16:06:56.481416+00', '2025-12-27 16:06:56.481416+00', '660e8400-e29b-41d4-a716-446655440002');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440004', 'SQL Cơ bản cho Người mới bắt đầu', 'sql-co-ban-cho-nguoi-moi-bat-dau', 'Khóa học SQL từ đầu, phù hợp cho người mới bắt đầu. Học các câu lệnh SELECT, INSERT, UPDATE, DELETE và các hàm SQL cơ bản.', 'Học SQL từ cơ bản, các câu lệnh và truy vấn cơ bản', NULL, '550e8400-e29b-41d4-a716-446655440012', 'beginner', 0.00, 'published', 200, 4.40, '2025-12-27 16:06:56.481416+00', '2025-12-27 16:06:56.481416+00', '660e8400-e29b-41d4-a716-446655440002');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440006', 'Deep Learning với TensorFlow', 'deep-learning-voi-tensorflow', 'Khóa học nâng cao về Deep Learning, Neural Networks, và cách sử dụng TensorFlow để xây dựng các mô hình AI phức tạp.', 'Deep Learning và Neural Networks với TensorFlow', NULL, '550e8400-e29b-41d4-a716-446655440010', 'expert', 0.00, 'published', 75, 4.80, '2025-12-27 16:06:56.481416+00', '2025-12-27 16:06:56.481416+00', '660e8400-e29b-41d4-a716-446655440004');
INSERT INTO "public"."courses" VALUES ('1179af1a-65ee-4bd4-8ff2-a863753f049b', 'iêu đề khóa họciêu đề khóa họciêu đề khóa học', 'iu-kha-hciu-kha-hciu-kha-hc', 'iêu đề khóa họciêu đề khóa họciêu đề khóa học', 'iêu đề khóa họciêu đề khóa học', 'https://www.bgr.com/bgr/tech/alibaba-launches-new-qwen3-ai-with-major-upgrades-to-rival-deepseek/alibaba-qwen-ai-model-bgr.webp', '550e8400-e29b-41d4-a716-446655440010', 'beginner', 0.00, 'published', 0, NULL, '2025-12-28 05:37:24.556+00', '2025-12-30 16:19:02.474+00', '660e8400-e29b-41d4-a716-446655440013');
INSERT INTO "public"."courses" VALUES ('ad892efb-e54c-452d-be36-9bcc016dbebb', 'Kiến Thức Nhập Môn IT', 'kin-thc-nhp-mn-it', '<h2><strong>Bạn sẽ học được gì?</strong></h2><ol><li>Các kiến thức cơ bản, nền móng của ngành IT</li><li>Các mô hình, kiến trúc cơ bản khi triển khai ứng dụng</li><li>Các khái niệm, thuật ngữ cốt lõi khi triển khai ứng dụng</li><li>Hiểu hơn về cách internet và máy vi tính hoạt động</li></ol>', 'Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.', 'https://topdev.vn/blog/wp-content/uploads/2021/02/tai-sao-lap-trinh-vien-nen-hoc-cau-truc-du-lieu-va-giai-thuat-1.png', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'beginner', 10000000.00, 'published', 0, NULL, '2026-01-01 08:38:07.672+00', '2026-01-01 08:48:02.318+00', '660e8400-e29b-41d4-a716-446655440002');
INSERT INTO "public"."courses" VALUES ('af19375c-366c-4472-98cc-db3d60550a17', 'Tiêu đề khóa họTiêu đề khóa họ', 'tiu-kha-htiu-kha-h', 'Tiêu đề khóa họTiêu đề khóa họTiêu đề khóa họ', 'Tiêu đề khTiêu đề khóa họTiêu đề khóa họTiêu đề khóa họóa họ', 'https://www.duolingo.com/leaderboard', '550e8400-e29b-41d4-a716-446655440020', 'beginner', 0.00, 'draft', 0, NULL, '2025-12-27 17:26:38.803+00', '2025-12-27 17:29:22.296+00', '660e8400-e29b-41d4-a716-446655440002');
INSERT INTO "public"."courses" VALUES ('8323e933-9208-41cc-8355-6192bdcccfdf', 'Tiêu đề khóa họ', 'tiu-kha-h', 'Tiêu đề khóa họTiêu đề khóa họTiêu đề khóa họ', 'Tiêu đề khóa họTiêu đề khóa họTiêu đề khóa họ', NULL, '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'beginner', 0.00, 'draft', 0, NULL, '2025-12-28 05:33:54.86+00', '2025-12-28 05:33:54.86+00', '660e8400-e29b-41d4-a716-446655440013');
INSERT INTO "public"."courses" VALUES ('8a63ba69-1e35-40ec-80b8-38b54b5e63eb', 'Tiêu đề khóa họ 1', 'tiu-kha-h-1', 'Tiêu đề khóa họTiêu đề khóa họ', 'Tiêu đề khóa hTiêu đề khóa họọ', 'https://www.duolingo.com/leaderboard', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'beginner', 0.00, 'published', 1, NULL, '2025-12-28 04:21:09.703+00', '2025-12-28 05:34:45.998+00', '660e8400-e29b-41d4-a716-446655440013');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440008', 'An toàn thông tin', 'an-toan-thong-tin', 'Khóa học về bảo mật thông tin, cryptography, network security, và các kỹ thuật bảo vệ hệ thống khỏi các mối đe dọa.', 'Bảo mật thông tin và an ninh mạng', NULL, '550e8400-e29b-41d4-a716-446655440011', 'intermediate', 0.00, 'published', 100, 5.00, '2025-12-27 16:06:56.481416+00', '2025-12-27 16:06:56.481416+00', '660e8400-e29b-41d4-a716-446655440003');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440001', 'Lập trình Web với React 1', 'lp-trnh-web-vi-react-1', '<p>Khóa học toàn diện về React, từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React, Hooks, Redux và các công nghệ liên quan. 1</p>', 'Học React từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại 1', 'http://localhost:3000/minio/studymate/1767267398412-Screenshot_2025-11-23_222925.png', '550e8400-e29b-41d4-a716-446655440010', 'intermediate', 0.00, 'published', 152, 4.00, '2025-12-27 16:06:56.481416+00', '2026-01-02 07:46:37.559+00', '660e8400-e29b-41d4-a716-446655440011');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440005', 'Machine Learning cơ bản', 'machine-learning-co-ban', 'Khóa học giới thiệu về Machine Learning, các thuật toán cơ bản như Linear Regression, Classification, và cách sử dụng scikit-learn.', 'Giới thiệu Machine Learning và các thuật toán cơ bản', NULL, '550e8400-e29b-41d4-a716-446655440010', 'beginner', 0.00, 'published', 181, 4.60, '2025-12-27 16:06:56.481416+00', '2025-12-29 14:18:24.519+00', '660e8400-e29b-41d4-a716-446655440004');
INSERT INTO "public"."courses" VALUES ('770e8400-e29b-41d4-a716-446655440007', 'Thuật toán và Cấu trúc dữ liệu', 'thuat-toan-va-cau-truc-du-lieu', 'Khóa học về các thuật toán cơ bản và nâng cao, cấu trúc dữ liệu như Array, Linked List, Tree, Graph và cách áp dụng trong thực tế. 1', 'Học thuật toán và cấu trúc dữ liệu từ cơ bản 1', 'https://topdev.vn/blog/wp-content/uploads/2021/02/tai-sao-lap-trinh-vien-nen-hoc-cau-truc-du-lieu-va-giai-thuat-1.png', '550e8400-e29b-41d4-a716-446655440012', 'intermediate', 0.00, 'published', 250, 4.50, '2025-12-27 16:06:56.481416+00', '2026-01-01 08:34:31.858+00', '660e8400-e29b-41d4-a716-446655440013');
INSERT INTO "public"."courses" VALUES ('fb845366-db42-4406-8e92-c849e955d691', 'ến Thức Nhập Môn IT', 'n-thc-nhp-mn-it', '<h1><strong>ến Thức Nhập Môn ITến Thức Nhập Môn ITến Thức Nhập Môn ITến Thức Nhập Môn IT</strong></h1>', 'ến Thức Nhập Môn ITến Thức Nhập Môn IT', 'http://localhost:3000/minio/studymate/1767266801136-Screenshot_2025-11-22_093033.png', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'beginner', 10000.00, 'published', 0, NULL, '2026-01-01 08:54:40.094+00', '2026-01-01 11:32:01.025+00', '660e8400-e29b-41d4-a716-446655440002');

-- ----------------------------
-- Table structure for email_verifications
-- ----------------------------
DROP TABLE IF EXISTS "public"."email_verifications";
CREATE TABLE "public"."email_verifications" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "otp_code" varchar(6) COLLATE "pg_catalog"."default" NOT NULL,
  "attempts" int4 DEFAULT 0,
  "expires_at" timestamptz(6) NOT NULL,
  "verified_at" timestamptz(6),
  "is_verified" bool DEFAULT false,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of email_verifications
-- ----------------------------
INSERT INTO "public"."email_verifications" VALUES ('acf5ddce-db08-42a6-8278-f903051b0322', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'nguyenminhhieu28092001k3@gmail.com', '548512', 2, '2026-01-01 04:01:53.18+00', '2026-01-01 03:49:15.001+00', 't', '2026-01-01 03:46:53.181+00', '2026-01-01 03:49:15.001+00');
INSERT INTO "public"."email_verifications" VALUES ('c336f11d-c967-4ff5-853c-05332f6f9a1e', '478234ce-bc97-45b4-a9ea-7bd1adec8d10', '548512@abc.vom', '172200', 1, '2026-01-01 04:05:00.588+00', '2026-01-01 03:50:23.234+00', 't', '2026-01-01 03:50:00.596+00', '2026-01-01 03:50:23.234+00');
INSERT INTO "public"."email_verifications" VALUES ('177f20b4-5421-41f3-975d-b3b2570f083d', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'nguyenminhhieu28092001k4@gmail.com', '419479', 1, '2026-01-01 08:31:57.239+00', '2026-01-01 08:17:19.52+00', 't', '2026-01-01 08:16:57.243+00', '2026-01-01 08:17:19.52+00');

-- ----------------------------
-- Table structure for enrollments
-- ----------------------------
DROP TABLE IF EXISTS "public"."enrollments";
CREATE TABLE "public"."enrollments" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "course_id" uuid NOT NULL,
  "status" "public"."enum_enrollments_status" DEFAULT 'pending'::enum_enrollments_status,
  "enrolled_at" timestamptz(6),
  "progress_percentage" numeric(5,2) DEFAULT 0,
  "total_time_spent" int4 DEFAULT 0,
  "last_accessed" timestamptz(6),
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of enrollments
-- ----------------------------
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'active', '2025-11-27 16:06:56.490971+00', 65.50, 1800, '2025-12-27 14:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 'active', '2025-12-07 16:06:56.490971+00', 45.00, 1200, '2025-12-26 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440005', 'completed', '2025-10-28 16:06:56.490971+00', 100.00, 3600, '2025-12-22 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'active', '2025-12-12 16:06:56.490971+00', 78.25, 2100, '2025-12-27 13:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440007', 'active', '2025-12-17 16:06:56.490971+00', 30.00, 900, '2025-12-27 10:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 'completed', '2025-11-12 16:06:56.490971+00', 100.00, 2400, '2025-12-25 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'active', '2025-12-22 16:06:56.490971+00', 15.00, 450, '2025-12-27 15:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440005', 'active', '2025-12-24 16:06:56.490971+00', 8.50, 300, '2025-12-27 04:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'active', '2025-12-02 16:06:56.490971+00', 55.75, 1500, '2025-12-27 12:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440008', 'active', '2025-12-15 16:06:56.490971+00', 40.00, 1100, '2025-12-27 08:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440006', 'active', '2025-12-20 16:06:56.490971+00', 25.00, 750, '2025-12-27 14:06:56.490971+00', '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('880e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440007', 'pending', '2025-12-26 16:06:56.490971+00', 0.00, 0, NULL, '2025-12-27 16:06:56.490971+00', '2025-12-27 16:06:56.490971+00');
INSERT INTO "public"."enrollments" VALUES ('b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', 'completed', '2025-12-28 05:55:31.997+00', 100.00, 0, '2026-01-02 13:00:14.303+00', '2025-12-28 05:55:31.997+00', '2026-01-02 13:00:14.309+00');
INSERT INTO "public"."enrollments" VALUES ('f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', 'completed', '2026-01-02 07:44:29.955+00', 88.00, 0, '2026-01-02 12:00:34.306+00', '2026-01-02 07:44:29.956+00', '2026-01-02 12:00:34.31+00');
INSERT INTO "public"."enrollments" VALUES ('5073fd52-cadc-4cae-a63b-780c0086e9c0', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440007', 'active', '2025-12-27 17:10:56.371+00', 1.00, 0, '2026-01-02 12:10:04.198+00', '2025-12-27 17:10:56.371+00', '2026-01-02 12:10:04.198+00');
INSERT INTO "public"."enrollments" VALUES ('4ce03133-477e-4076-b633-b5c2ce0b845b', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '8a63ba69-1e35-40ec-80b8-38b54b5e63eb', 'active', '2025-12-28 05:14:00.283+00', 12.00, 0, '2025-12-28 05:44:50.339+00', '2025-12-28 05:14:00.284+00', '2025-12-28 05:44:50.339+00');
INSERT INTO "public"."enrollments" VALUES ('eca3f56a-a0ee-4acf-8483-b19539491578', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440005', 'active', '2025-12-29 14:18:24.502+00', 0.00, 0, '2026-01-02 05:30:12.435+00', '2025-12-29 14:18:24.502+00', '2026-01-02 05:30:12.44+00');

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS "public"."messages";
CREATE TABLE "public"."messages" (
  "id" uuid NOT NULL,
  "conversation_id" uuid NOT NULL,
  "sender_id" uuid NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "message_type" "public"."enum_messages_message_type" DEFAULT 'text'::enum_messages_message_type,
  "is_read" bool DEFAULT false,
  "read_at" timestamptz(6),
  "deleted_at" timestamptz(6),
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of messages
-- ----------------------------
INSERT INTO "public"."messages" VALUES ('fca29e82-ad72-4098-87dd-8c4c9b356c26', 'f733911f-60ab-4384-a4dd-ca679363227b', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hi', 'text', 'f', NULL, NULL, '2025-12-27 18:00:13.312+00', '2025-12-27 18:00:13.312+00');
INSERT INTO "public"."messages" VALUES ('9a30caee-6285-4782-b737-63008ff21d5c', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hi e', 'text', 't', '2025-12-27 18:02:09.922+00', NULL, '2025-12-27 18:01:51.102+00', '2025-12-27 18:02:09.923+00');
INSERT INTO "public"."messages" VALUES ('ce18b7ab-8670-46ef-8911-e84c380bbc1a', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'xin chao', 'text', 't', '2025-12-27 18:02:18.499+00', NULL, '2025-12-27 18:02:15.037+00', '2025-12-27 18:02:18.5+00');
INSERT INTO "public"."messages" VALUES ('9059d8c6-84bb-4b5e-bb06-532103817a23', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '1', 'text', 't', '2025-12-27 18:12:11.364+00', NULL, '2025-12-27 18:11:56.822+00', '2025-12-27 18:12:11.364+00');
INSERT INTO "public"."messages" VALUES ('eed43633-823a-4c3a-bb52-2e9988a2d948', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'qqqq', 'text', 't', '2025-12-27 18:12:11.364+00', NULL, '2025-12-27 18:12:05.582+00', '2025-12-27 18:12:11.364+00');
INSERT INTO "public"."messages" VALUES ('d532e873-b104-4eca-8991-a3096d5d0076', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'aasss', 'text', 't', '2025-12-27 18:12:34.06+00', NULL, '2025-12-27 18:12:23.715+00', '2025-12-27 18:12:34.06+00');
INSERT INTO "public"."messages" VALUES ('b81c137d-a4c3-4c7d-98cf-99ff411d9ef1', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sss', 'text', 't', '2025-12-27 18:14:55.903+00', NULL, '2025-12-27 18:14:48.55+00', '2025-12-27 18:14:55.903+00');
INSERT INTO "public"."messages" VALUES ('fe4525bc-e438-431e-b08d-aafba98ef396', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '11', 'text', 't', '2025-12-27 18:14:55.903+00', NULL, '2025-12-27 18:14:53.273+00', '2025-12-27 18:14:55.903+00');
INSERT INTO "public"."messages" VALUES ('2eb0cd2a-6eec-456d-b2c1-44cfa074e8d5', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'aaa', 'text', 't', '2025-12-27 18:15:08.538+00', NULL, '2025-12-27 18:15:01.7+00', '2025-12-27 18:15:08.538+00');
INSERT INTO "public"."messages" VALUES ('cb8d7b1f-d3eb-4732-aa7a-197dd33aa2b2', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'xss', 'text', 't', '2025-12-27 18:15:18.993+00', NULL, '2025-12-27 18:15:14.924+00', '2025-12-27 18:15:18.994+00');
INSERT INTO "public"."messages" VALUES ('98fcb709-8862-40a3-8f76-f50ad6f34f90', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sss', 'text', 't', '2025-12-27 18:15:18.993+00', NULL, '2025-12-27 18:15:16.067+00', '2025-12-27 18:15:18.994+00');
INSERT INTO "public"."messages" VALUES ('3299a50d-c82d-40bf-9406-1702c886d835', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sssss', 'text', 't', '2025-12-27 18:16:45.442+00', NULL, '2025-12-27 18:15:44.014+00', '2025-12-27 18:16:45.443+00');
INSERT INTO "public"."messages" VALUES ('7a37fcff-bdaf-44d6-b4ba-78cfe933e215', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '111', 'text', 't', '2025-12-27 18:17:24.798+00', NULL, '2025-12-27 18:17:18.157+00', '2025-12-27 18:17:24.798+00');
INSERT INTO "public"."messages" VALUES ('29278433-ed4e-44de-ad4b-58369c7af93c', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '22', 'text', 't', '2025-12-27 18:17:24.798+00', NULL, '2025-12-27 18:17:22.217+00', '2025-12-27 18:17:24.798+00');
INSERT INTO "public"."messages" VALUES ('90acac13-555c-4537-a55c-74f4758bb111', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '333', 'text', 't', '2025-12-27 18:17:33.543+00', NULL, '2025-12-27 18:17:29.443+00', '2025-12-27 18:17:33.543+00');
INSERT INTO "public"."messages" VALUES ('2e51c274-0ff5-49c2-b311-8e21fa87a4c1', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '444', 'text', 't', '2025-12-27 18:18:26.226+00', NULL, '2025-12-27 18:18:06.833+00', '2025-12-27 18:18:26.226+00');
INSERT INTO "public"."messages" VALUES ('eff90e5a-f43d-4779-86c6-d06513385f2b', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '555', 'text', 't', '2025-12-27 18:18:26.226+00', NULL, '2025-12-27 18:18:11.187+00', '2025-12-27 18:18:26.226+00');
INSERT INTO "public"."messages" VALUES ('077dc5d6-660f-4215-b3bd-691f22272aa0', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '66', 'text', 't', '2025-12-27 18:20:24.486+00', NULL, '2025-12-27 18:18:33.676+00', '2025-12-27 18:20:24.487+00');
INSERT INTO "public"."messages" VALUES ('5d6586ca-d631-47cd-9b07-b80d621598a8', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'dsdsd', 'text', 't', '2025-12-27 18:21:06.928+00', NULL, '2025-12-27 18:20:32.867+00', '2025-12-27 18:21:06.928+00');
INSERT INTO "public"."messages" VALUES ('28ef7c7b-c8b7-4778-b0f4-8ad9e723e41e', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'dd', 'text', 't', '2025-12-27 18:21:06.928+00', NULL, '2025-12-27 18:20:44.159+00', '2025-12-27 18:21:06.928+00');
INSERT INTO "public"."messages" VALUES ('e3c2e8a0-4f03-44c5-9f80-c760d9f1c20f', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ddd', 'text', 't', '2025-12-27 18:22:21.755+00', NULL, '2025-12-27 18:21:11.209+00', '2025-12-27 18:22:21.756+00');
INSERT INTO "public"."messages" VALUES ('b7bebd0f-df36-44a6-8558-dc5bd9e8b69a', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ssss', 'text', 't', '2025-12-27 18:25:49.433+00', NULL, '2025-12-27 18:25:38.219+00', '2025-12-27 18:25:49.433+00');
INSERT INTO "public"."messages" VALUES ('372c949a-e323-4531-acb2-da27fd2e1c17', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '1', 'text', 't', '2025-12-27 18:25:56.25+00', NULL, '2025-12-27 18:25:53.674+00', '2025-12-27 18:25:56.251+00');
INSERT INTO "public"."messages" VALUES ('452d0dc3-7331-4ec2-aa3e-5b0a8bcf42f5', '6a198d1d-2d31-4cc7-8690-9941788a036b', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '2', 'text', 'f', NULL, NULL, '2025-12-28 02:56:22.683+00', '2025-12-28 02:56:22.683+00');
INSERT INTO "public"."messages" VALUES ('b59a7590-3802-4557-8bc5-bac5e13f1dfb', 'ab1051c9-b948-4c44-bcb2-9969a69fb3c3', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '1', 'text', 'f', NULL, NULL, '2025-12-28 03:53:29.391+00', '2025-12-28 03:53:29.391+00');
INSERT INTO "public"."messages" VALUES ('1715be13-ab27-473a-9acd-3e389e1bd7ae', 'ab1051c9-b948-4c44-bcb2-9969a69fb3c3', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '111', 'text', 'f', NULL, NULL, '2025-12-28 04:09:19.325+00', '2025-12-28 04:09:19.325+00');
INSERT INTO "public"."messages" VALUES ('b241193f-e86e-49b5-99a1-004113bd8867', 'ab1051c9-b948-4c44-bcb2-9969a69fb3c3', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'xin chào', 'text', 'f', NULL, NULL, '2026-01-01 07:57:35.384+00', '2026-01-01 07:57:35.384+00');
INSERT INTO "public"."messages" VALUES ('2fe1abbc-ab81-4da4-a898-27adc57e3b80', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưerwer', 'text', 'f', NULL, NULL, '2026-01-01 08:08:29.891+00', '2026-01-01 08:08:29.891+00');
INSERT INTO "public"."messages" VALUES ('6b13d84d-5725-456c-9c79-2e0ee176e54d', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưerwerwer', 'text', 'f', NULL, NULL, '2026-01-01 08:08:31.573+00', '2026-01-01 08:08:31.573+00');
INSERT INTO "public"."messages" VALUES ('3727daac-e22f-45ec-af69-35889761cee9', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưerwerwer', 'text', 'f', NULL, NULL, '2026-01-01 08:08:33.05+00', '2026-01-01 08:08:33.05+00');
INSERT INTO "public"."messages" VALUES ('61da5cbb-f4f3-4eb4-882a-04e1b6942b9a', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'rêtrt', 'text', 'f', NULL, NULL, '2026-01-01 08:08:44.891+00', '2026-01-01 08:08:44.891+00');
INSERT INTO "public"."messages" VALUES ('f73ca601-879a-4a39-982a-f8d679452545', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ểtrt', 'text', 'f', NULL, NULL, '2026-01-01 08:08:47.116+00', '2026-01-01 08:08:47.116+00');
INSERT INTO "public"."messages" VALUES ('6f37b4fc-4f45-4dff-9e76-f298dac4dfc0', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ểtrter', 'text', 'f', NULL, NULL, '2026-01-01 08:08:59.796+00', '2026-01-01 08:08:59.796+00');
INSERT INTO "public"."messages" VALUES ('09f2b52f-6eb5-438d-9331-176f4b7e73a4', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ểtrt', 'text', 'f', NULL, NULL, '2026-01-01 08:09:58.041+00', '2026-01-01 08:09:58.041+00');
INSERT INTO "public"."messages" VALUES ('df1f21e8-5b68-4b6d-af0e-24e614ce472e', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'rtet', 'text', 'f', NULL, NULL, '2026-01-01 08:09:59.265+00', '2026-01-01 08:09:59.265+00');
INSERT INTO "public"."messages" VALUES ('8070d586-011f-4150-b6fb-7073266537d8', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưerwerewr', 'text', 'f', NULL, NULL, '2026-01-01 08:10:12.761+00', '2026-01-01 08:10:12.761+00');
INSERT INTO "public"."messages" VALUES ('aaa56f26-904b-42af-8002-a9aba0c79154', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưerwer', 'text', 'f', NULL, NULL, '2026-01-01 08:10:14.294+00', '2026-01-01 08:10:14.294+00');
INSERT INTO "public"."messages" VALUES ('bb02a3af-2fa3-4b59-9d53-3c86013ac3d0', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 'f', NULL, NULL, '2026-01-01 08:11:48.427+00', '2026-01-01 08:11:48.427+00');
INSERT INTO "public"."messages" VALUES ('ad48ec15-707e-459a-a71a-09ae757f51e9', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'trtr', 'text', 'f', NULL, NULL, '2026-01-01 08:13:19.036+00', '2026-01-01 08:13:19.036+00');
INSERT INTO "public"."messages" VALUES ('5bd3f8f9-d124-4968-aa2a-eb253603be7e', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '345345', 'text', 'f', NULL, NULL, '2026-01-01 08:13:21.717+00', '2026-01-01 08:13:21.717+00');
INSERT INTO "public"."messages" VALUES ('a832027b-c788-45b9-bb37-a1e7db701478', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '345345', 'text', 'f', NULL, NULL, '2026-01-01 08:13:22.876+00', '2026-01-01 08:13:22.876+00');
INSERT INTO "public"."messages" VALUES ('2391371e-3fb4-40d3-9c86-e8714836f25b', '1e79b6f6-55e4-4ac3-838b-bfa1a84ce972', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '34534534', 'text', 'f', NULL, NULL, '2026-01-01 08:13:24.754+00', '2026-01-01 08:13:24.754+00');
INSERT INTO "public"."messages" VALUES ('c690d0cb-1f57-4e10-9604-63e9280c94b1', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '1', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2025-12-28 02:56:14.181+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('52d4beee-d96f-4b21-8db4-86f414a3fc9e', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '111', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2025-12-28 02:56:26.186+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('e39627c3-d21c-44c0-a388-1f921b06b115', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '111', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2025-12-28 03:53:07.941+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('950e4181-07d5-4f76-bec8-955d360ed18a', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:01:25.274+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('9e6b9bf9-a717-42ad-8e41-f3fff6b47092', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ấdsd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:01:27.196+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('e00705bc-78ca-4989-b345-9d30c090b431', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasdasd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:01:30.091+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('28564c85-2959-4b86-9adf-c547ca439401', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:01:38.799+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('8c9c5e8c-ce28-4730-bed1-a13787332d3a', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasdasdsd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:01:42.213+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('98841298-20c7-487c-8795-a8c271903eed', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasdasd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:01:46.636+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('1a30be83-564a-4f1f-87fa-e87710ff1419', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:15:41.622+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('a7ed036b-f8c4-426a-8292-b0a2730f0c4f', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', '2026-01-01 08:17:32.792+00', NULL, '2026-01-01 08:15:43.027+00', '2026-01-01 08:17:32.793+00');
INSERT INTO "public"."messages" VALUES ('9b40a200-4f97-47cf-8194-05e96ef4490a', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sadasd', 'text', 't', '2026-01-01 08:17:57.486+00', NULL, '2026-01-01 08:17:35.844+00', '2026-01-01 08:17:57.487+00');
INSERT INTO "public"."messages" VALUES ('e9e143bb-7216-4f84-bb15-faba2ceb6b8f', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ádasd', 'text', 't', '2026-01-01 08:17:57.486+00', NULL, '2026-01-01 08:17:52.727+00', '2026-01-01 08:17:57.487+00');
INSERT INTO "public"."messages" VALUES ('d7f9ac70-2f92-479a-8a7e-d249ed4d0d2c', '1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'êe', 'text', 'f', NULL, NULL, '2026-01-02 02:42:48.295+00', '2026-01-02 02:42:48.295+00');
INSERT INTO "public"."messages" VALUES ('db8f8e32-b435-4190-abeb-627b0ba858dc', '1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '1111', 'text', 'f', NULL, NULL, '2026-01-02 02:50:42.013+00', '2026-01-02 02:50:42.013+00');
INSERT INTO "public"."messages" VALUES ('ab9527c6-7715-4ffc-8d63-fc31c4d80d97', '1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '32323', 'text', 'f', NULL, NULL, '2026-01-02 02:50:46.351+00', '2026-01-02 02:50:46.351+00');
INSERT INTO "public"."messages" VALUES ('20b32b21-f535-4995-b9b1-f15ab4252670', '1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'qeqeqwe', 'text', 'f', NULL, NULL, '2026-01-02 02:54:16.524+00', '2026-01-02 02:54:16.524+00');
INSERT INTO "public"."messages" VALUES ('04b3cdab-0c74-4460-9104-85c5b91273a2', '1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sadasd', 'text', 'f', NULL, NULL, '2026-01-02 02:56:17.83+00', '2026-01-02 02:56:17.83+00');
INSERT INTO "public"."messages" VALUES ('3723ae41-96f9-497d-b279-22a1d7fe0102', '1d9cdcac-491f-4226-9e3b-2e8e1d231731', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '23323', 'text', 'f', NULL, NULL, '2026-01-02 02:59:10.324+00', '2026-01-02 02:59:10.324+00');
INSERT INTO "public"."messages" VALUES ('b966e4d4-f97d-4913-ac99-b6579c2af4e3', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '1', 'text', 't', NULL, NULL, '2026-01-02 03:04:51.069+00', '2026-01-02 03:04:59.407+00');
INSERT INTO "public"."messages" VALUES ('ce2cee6c-ae56-4b1b-a5c1-3d4d5346fd39', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'xin chào', 'text', 't', NULL, NULL, '2026-01-02 03:04:47.111+00', '2026-01-02 03:04:59.407+00');
INSERT INTO "public"."messages" VALUES ('b77982af-cc8a-4a2e-ac42-d1bdba9934e2', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '1', 'text', 't', NULL, NULL, '2026-01-02 03:04:53.853+00', '2026-01-02 03:04:59.407+00');
INSERT INTO "public"."messages" VALUES ('4aea28a2-b040-4942-a6ca-ebabba965e93', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '1111', 'text', 't', NULL, NULL, '2026-01-02 03:04:56.309+00', '2026-01-02 03:04:59.407+00');
INSERT INTO "public"."messages" VALUES ('e40ad771-23c4-4c5c-b0ba-26ff5bb91c5b', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '111', 'text', 't', NULL, NULL, '2026-01-02 03:05:02.037+00', '2026-01-02 03:05:04.921+00');
INSERT INTO "public"."messages" VALUES ('6660d2cf-4849-44ff-a7f3-92f8a7f26b27', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '222', 'text', 't', '2026-01-02 03:05:15.775+00', NULL, '2026-01-02 03:05:08.212+00', '2026-01-02 03:05:15.775+00');
INSERT INTO "public"."messages" VALUES ('09a6f7ca-b750-40cf-940b-4736e5e83c98', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '22', 'text', 't', '2026-01-02 03:05:15.775+00', NULL, '2026-01-02 03:05:10.578+00', '2026-01-02 03:05:15.775+00');
INSERT INTO "public"."messages" VALUES ('a6a14935-7780-4ba2-82c9-d47461d4c528', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'aaa', 'text', 't', NULL, NULL, '2026-01-02 03:05:23.515+00', '2026-01-02 03:05:41.134+00');
INSERT INTO "public"."messages" VALUES ('7aefca6c-0ca6-48bf-bcf1-5f2944d7a71c', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'aaaa', 'text', 't', NULL, NULL, '2026-01-02 03:05:25.76+00', '2026-01-02 03:05:41.134+00');
INSERT INTO "public"."messages" VALUES ('ef2c3d01-475a-40f6-9750-1aa98518996e', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sdsdsd', 'text', 't', NULL, NULL, '2026-01-02 03:05:29.112+00', '2026-01-02 03:05:41.134+00');
INSERT INTO "public"."messages" VALUES ('4fc3786a-9b0b-428a-8c08-94adad2293ac', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'dfdfd', 'text', 't', NULL, NULL, '2026-01-02 03:05:37.098+00', '2026-01-02 03:05:41.134+00');
INSERT INTO "public"."messages" VALUES ('0f2b0b52-a540-4d5d-afa8-58a296453bb2', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'dfdfd', 'text', 't', NULL, NULL, '2026-01-02 03:05:40.271+00', '2026-01-02 03:05:41.134+00');
INSERT INTO "public"."messages" VALUES ('ae9ef562-97ef-424d-abb7-2987fa88d727', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'dsd', 'text', 't', NULL, NULL, '2026-01-02 03:06:08.526+00', '2026-01-02 03:06:23.487+00');
INSERT INTO "public"."messages" VALUES ('08375337-510b-478b-a27b-0206ac00a49a', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'âsas', 'text', 't', NULL, NULL, '2026-01-02 03:06:12.385+00', '2026-01-02 03:06:23.487+00');
INSERT INTO "public"."messages" VALUES ('c82b2201-b017-43c0-9ca9-afe1a6794a74', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ssdsds', 'text', 't', NULL, NULL, '2026-01-02 03:06:21.478+00', '2026-01-02 03:06:23.487+00');
INSERT INTO "public"."messages" VALUES ('2b5f171f-f5b4-47c3-bb5e-8cf8e3444366', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sdsdsd', 'text', 't', '2026-01-02 03:10:32.844+00', NULL, '2026-01-02 03:06:25.988+00', '2026-01-02 03:10:32.844+00');
INSERT INTO "public"."messages" VALUES ('77da98d9-281e-43a8-8767-47b1da44ab0b', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'rtrt', 'text', 't', '2026-01-02 03:10:32.844+00', NULL, '2026-01-02 03:06:30.422+00', '2026-01-02 03:10:32.844+00');
INSERT INTO "public"."messages" VALUES ('3342a08e-9609-43c9-b12b-bf2eceeb10e0', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'qưe', 'text', 't', '2026-01-02 03:12:32.396+00', NULL, '2026-01-02 03:12:27.016+00', '2026-01-02 03:12:32.396+00');
INSERT INTO "public"."messages" VALUES ('86a69780-9ac9-4b6b-a963-e3f00c6c0755', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sssss', 'text', 't', NULL, NULL, '2026-01-02 03:15:02.328+00', '2026-01-02 03:15:05.594+00');
INSERT INTO "public"."messages" VALUES ('d7cfc615-fdc3-42d6-9939-2f64f6f1a329', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sdsd', 'text', 't', NULL, NULL, '2026-01-02 03:15:09.222+00', '2026-01-02 03:15:13.726+00');
INSERT INTO "public"."messages" VALUES ('fd6a9f1f-1194-4129-93d7-7196954e5ef4', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'âs', 'text', 't', NULL, NULL, '2026-01-02 03:15:17.465+00', '2026-01-02 03:15:17.748+00');
INSERT INTO "public"."messages" VALUES ('b1699754-8ba8-484d-9b9d-c8220936b6a7', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sdasdasd', 'text', 't', NULL, NULL, '2026-01-02 03:16:31.58+00', '2026-01-02 03:16:34.23+00');
INSERT INTO "public"."messages" VALUES ('456db825-bffe-4cfb-bad5-ab41f1a5baae', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'qưeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:17:29.086+00', '2026-01-02 03:17:32.474+00');
INSERT INTO "public"."messages" VALUES ('2648e022-cb51-462f-a2d0-4725e05ee97b', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '354345345', 'text', 't', NULL, NULL, '2026-01-02 03:17:43.526+00', '2026-01-02 03:17:57.318+00');
INSERT INTO "public"."messages" VALUES ('85860e18-f446-4158-9463-8bda53b80e81', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ưeerewr', 'text', 't', NULL, NULL, '2026-01-02 03:18:57.694+00', '2026-01-02 03:19:04.293+00');
INSERT INTO "public"."messages" VALUES ('f33c5268-ac16-4f0b-a06b-83d7fbc81f9b', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'êrr', 'text', 't', NULL, NULL, '2026-01-02 03:19:19.822+00', '2026-01-02 03:19:23.835+00');
INSERT INTO "public"."messages" VALUES ('fe405570-90da-4cde-9278-aafb3ba29e45', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasdsd', 'text', 't', NULL, NULL, '2026-01-02 03:19:52.322+00', '2026-01-02 03:20:13.754+00');
INSERT INTO "public"."messages" VALUES ('361501b5-7558-49aa-b4c2-54a6279c842c', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsd', 'text', 't', NULL, NULL, '2026-01-02 03:19:53.992+00', '2026-01-02 03:20:13.754+00');
INSERT INTO "public"."messages" VALUES ('789cbb4f-6325-4186-aede-abf9a8cf34ce', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'qưeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:20:29.46+00', '2026-01-02 03:20:30.398+00');
INSERT INTO "public"."messages" VALUES ('9bb736b6-0459-4e56-bcfb-807c46bd4cf7', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'qưeqe', 'text', 't', NULL, NULL, '2026-01-02 03:20:32.852+00', '2026-01-02 03:20:34.19+00');
INSERT INTO "public"."messages" VALUES ('af17816c-f7e2-4ae6-a310-d8016fe0cf9a', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', NULL, NULL, '2026-01-02 03:21:06.751+00', '2026-01-02 03:21:11.567+00');
INSERT INTO "public"."messages" VALUES ('8cf55005-f646-4921-8305-ced3fb46f93b', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsad', 'text', 't', NULL, NULL, '2026-01-02 03:21:15.808+00', '2026-01-02 03:21:18.175+00');
INSERT INTO "public"."messages" VALUES ('41a91be1-103b-47df-8596-dad445c56948', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:22:24.015+00', '2026-01-02 03:22:25.532+00');
INSERT INTO "public"."messages" VALUES ('64aa6da1-404a-4cf9-8e97-6dfff165f5d9', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'qưeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:22:28.647+00', '2026-01-02 03:22:29.632+00');
INSERT INTO "public"."messages" VALUES ('1760bee0-476b-4d67-8011-cddf3022b420', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ewe', 'text', 't', NULL, NULL, '2026-01-02 03:23:33.026+00', '2026-01-02 03:23:39.213+00');
INSERT INTO "public"."messages" VALUES ('aa9a5bf3-b759-488e-89a5-01527a9a9dfb', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ưưere', 'text', 't', NULL, NULL, '2026-01-02 03:23:36.587+00', '2026-01-02 03:23:39.213+00');
INSERT INTO "public"."messages" VALUES ('bb86378e-a134-44a4-b742-6c81e4ae2884', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'đá', 'text', 't', '2026-01-02 03:23:51.135+00', NULL, '2026-01-02 03:23:42.256+00', '2026-01-02 03:23:51.135+00');
INSERT INTO "public"."messages" VALUES ('ca0b15c9-60b7-4e99-8a2f-4ecc01c7d8c6', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'âs', 'text', 't', '2026-01-02 03:23:51.135+00', NULL, '2026-01-02 03:23:44.701+00', '2026-01-02 03:23:51.135+00');
INSERT INTO "public"."messages" VALUES ('daecb54f-e5e4-4318-a107-53ca023bdcdc', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'rewr', 'text', 't', NULL, NULL, '2026-01-02 03:24:10.812+00', '2026-01-02 03:24:26.351+00');
INSERT INTO "public"."messages" VALUES ('b1117c2c-75fb-47ae-92b0-29dfcb735836', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ẻwererwer', 'text', 't', NULL, NULL, '2026-01-02 03:24:15.865+00', '2026-01-02 03:24:26.351+00');
INSERT INTO "public"."messages" VALUES ('e1a4511b-db82-48cb-a9d9-6b332d61baa6', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'qưeeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:24:30.932+00', '2026-01-02 03:24:33.442+00');
INSERT INTO "public"."messages" VALUES ('60503a6b-7dae-4243-92dd-88bcec78c1ba', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'qưeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:24:38.337+00', '2026-01-02 03:24:40.143+00');
INSERT INTO "public"."messages" VALUES ('55aeb890-d053-417e-815a-e9ed43ad62fa', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ewrwer', 'text', 't', NULL, NULL, '2026-01-02 03:25:00.2+00', '2026-01-02 03:25:02.355+00');
INSERT INTO "public"."messages" VALUES ('e52ca245-6da9-4be6-b330-7998311574fc', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'qưeqwewe', 'text', 't', NULL, NULL, '2026-01-02 03:26:29.684+00', '2026-01-02 03:26:31.156+00');
INSERT INTO "public"."messages" VALUES ('2cd12bf1-e79f-4151-9836-749daa38120f', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'qưeweewq', 'text', 't', NULL, NULL, '2026-01-02 03:26:34.008+00', '2026-01-02 03:26:36.3+00');
INSERT INTO "public"."messages" VALUES ('cb5188c5-634b-427c-affe-d02340b53b4c', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sdsad', 'text', 't', '2026-01-02 03:26:56.768+00', NULL, '2026-01-02 03:26:42.904+00', '2026-01-02 03:26:56.768+00');
INSERT INTO "public"."messages" VALUES ('f3d7c971-5197-45a7-95fc-d3694a3dfe70', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ek', 'text', 't', '2026-01-02 03:26:56.768+00', NULL, '2026-01-02 03:26:44.998+00', '2026-01-02 03:26:56.768+00');
INSERT INTO "public"."messages" VALUES ('0cb36d83-b1ce-474b-bb61-b0f326955fa2', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'xin chao', 'text', 't', '2026-01-02 03:26:56.768+00', NULL, '2026-01-02 03:26:49.366+00', '2026-01-02 03:26:56.768+00');
INSERT INTO "public"."messages" VALUES ('8f6e813e-e64f-40b8-8d03-105e0fa8739f', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ban co khoe ko', 'text', 't', '2026-01-02 03:26:56.768+00', NULL, '2026-01-02 03:26:53.192+00', '2026-01-02 03:26:56.768+00');
INSERT INTO "public"."messages" VALUES ('2e516c92-f32b-4cfd-b788-f1f45b460958', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '33', 'text', 't', NULL, NULL, '2026-01-02 03:27:00.534+00', '2026-01-02 03:27:21.146+00');
INSERT INTO "public"."messages" VALUES ('7e7851ab-a287-460d-9bc0-f13931ecd358', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sđ', 'text', 't', NULL, NULL, '2026-01-02 03:27:17.607+00', '2026-01-02 03:27:21.146+00');
INSERT INTO "public"."messages" VALUES ('babf86d0-7f91-4caf-a21e-60affe1c1a3d', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsd', 'text', 't', NULL, NULL, '2026-01-02 03:27:22.001+00', '2026-01-02 03:27:23.133+00');
INSERT INTO "public"."messages" VALUES ('07a66342-4e25-4ecc-a79e-3f0c20048b95', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'sđs', 'text', 't', NULL, NULL, '2026-01-02 03:27:25.721+00', '2026-01-02 03:27:27.654+00');
INSERT INTO "public"."messages" VALUES ('909b1f14-0b1d-425c-a972-482966721e36', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '66', 'text', 't', NULL, NULL, '2026-01-02 03:28:04.487+00', '2026-01-02 03:28:12.526+00');
INSERT INTO "public"."messages" VALUES ('9e9799d8-d105-4136-bff8-912248b0470e', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'http://localhost:3000/chat/0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'text', 't', NULL, NULL, '2026-01-02 03:28:07.053+00', '2026-01-02 03:28:12.526+00');
INSERT INTO "public"."messages" VALUES ('5d117c3c-c775-4eb1-a98f-beed43d02f9f', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'qưeqwe', 'text', 't', NULL, NULL, '2026-01-02 03:28:24.384+00', '2026-01-02 03:28:25.317+00');
INSERT INTO "public"."messages" VALUES ('1ff4b27c-8bb6-476b-bacd-7cdff16f0a44', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsđ', 'text', 't', NULL, NULL, '2026-01-02 03:30:47.737+00', '2026-01-02 03:35:26.242+00');
INSERT INTO "public"."messages" VALUES ('62398649-1b8d-460a-a998-2045dbcd0fde', 'aff76611-b0f1-4036-9421-7468fe80bb1f', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ádd', 'text', 't', '2026-01-02 03:36:11.203+00', NULL, '2026-01-02 03:35:47.097+00', '2026-01-02 03:36:11.203+00');
INSERT INTO "public"."messages" VALUES ('296931ac-0c3e-4d1c-944b-7280e3117a1c', 'aff76611-b0f1-4036-9421-7468fe80bb1f', 'e12181bf-8f7d-42b5-985d-ccdc1f05b182', 'âsds', 'text', 't', NULL, NULL, '2026-01-02 03:36:13.764+00', '2026-01-02 03:36:17.316+00');
INSERT INTO "public"."messages" VALUES ('639058e1-8c30-454e-8efe-5b27e664ed22', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sdasdasd', 'text', 't', '2026-01-02 10:12:48.861+00', NULL, '2026-01-02 09:58:31.058+00', '2026-01-02 10:12:48.862+00');
INSERT INTO "public"."messages" VALUES ('78736544-8063-4bc8-9be7-5483df8f08f2', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', '👋 Xin chào! Tôi là StudyMate AI, trợ lý học tập thông minh của bạn. Tôi có thể giúp bạn:

✅ Giải đáp thắc mắc về khóa học
✅ Đề xuất lộ trình học tập
✅ Hỗ trợ làm bài tập và code
✅ Giải thích khái niệm phức tạp
✅ Phân tích tiến độ học tập

Hãy đặt câu hỏi để bắt đầu!', 'text', 't', '2026-01-02 09:58:35.416+00', NULL, '2026-01-02 09:58:23.716+00', '2026-01-02 09:58:35.416+00');
INSERT INTO "public"."messages" VALUES ('50afeaf4-2ca1-4fca-991e-4f82b7337931', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsadsd', 'text', 't', '2026-01-02 10:12:48.861+00', NULL, '2026-01-02 09:58:43.928+00', '2026-01-02 10:12:48.862+00');
INSERT INTO "public"."messages" VALUES ('ae8580c0-950e-49bb-b398-cdc8432fd3ca', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsad', 'text', 't', '2026-01-02 10:12:48.861+00', NULL, '2026-01-02 10:12:01.327+00', '2026-01-02 10:12:48.862+00');
INSERT INTO "public"."messages" VALUES ('b62c3d1d-d73b-49f0-b072-e778f27276e6', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádsd', 'text', 't', '2026-01-02 10:12:48.861+00', NULL, '2026-01-02 10:12:02.621+00', '2026-01-02 10:12:48.862+00');
INSERT INTO "public"."messages" VALUES ('91a7194b-37f4-4cda-80bb-acc2037acc34', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ádsads', 'text', 't', NULL, NULL, '2026-01-02 10:13:04.424+00', '2026-01-02 10:13:05.067+00');
INSERT INTO "public"."messages" VALUES ('dfc414a4-da17-414b-977f-abab2862dca4', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'adasdasd', 'text', 't', NULL, NULL, '2026-01-02 10:13:13.312+00', '2026-01-02 10:13:15.597+00');
INSERT INTO "public"."messages" VALUES ('4cfb1f36-d426-4d88-aa83-88f95ebfc287', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ádasd', 'text', 't', NULL, NULL, '2026-01-02 10:13:21.23+00', '2026-01-02 10:13:23.695+00');
INSERT INTO "public"."messages" VALUES ('9b108152-7600-4e0d-b71d-d5c29b99131a', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'xin chào', 'text', 'f', NULL, NULL, '2026-01-02 10:19:32.649+00', '2026-01-02 10:19:32.649+00');
INSERT INTO "public"."messages" VALUES ('88030127-88be-479e-b39e-fa7aaf90f922', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', '2026-01-02 10:22:07.003+00', NULL, '2026-01-02 10:21:54.002+00', '2026-01-02 10:22:07.003+00');
INSERT INTO "public"."messages" VALUES ('eed151b7-e3f4-417a-b8d4-68b877690cd8', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ádasdas', 'text', 't', NULL, NULL, '2026-01-02 10:22:09.367+00', '2026-01-02 10:22:11.145+00');
INSERT INTO "public"."messages" VALUES ('3007af5c-970a-473d-8f0c-ba3b7e7414a8', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', NULL, NULL, '2026-01-02 10:22:17.52+00', '2026-01-02 10:22:19.015+00');
INSERT INTO "public"."messages" VALUES ('e650e669-d443-482c-a487-871c6cd15d14', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '4545', 'text', 't', '2026-01-02 10:45:36.397+00', NULL, '2026-01-02 10:45:18.886+00', '2026-01-02 10:45:36.397+00');
INSERT INTO "public"."messages" VALUES ('83a4a0f9-a8ed-4be6-8092-3fb35a7ab8fd', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ewrwerewr', 'text', 't', NULL, NULL, '2026-01-02 10:45:40.882+00', '2026-01-02 10:45:43.031+00');
INSERT INTO "public"."messages" VALUES ('08f9a944-3bef-49f6-8763-de82a0b045ef', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sdad', 'text', 't', NULL, NULL, '2026-01-02 10:46:01.857+00', '2026-01-02 10:46:02.907+00');
INSERT INTO "public"."messages" VALUES ('be08830d-80af-4d9e-af72-2ca774c66d21', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'âsđ', 'text', 't', NULL, NULL, '2026-01-02 10:46:03.932+00', '2026-01-02 10:46:05.131+00');
INSERT INTO "public"."messages" VALUES ('22f40f6e-b58b-40e6-a8d5-1e51733e227e', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sdasd', 'text', 't', NULL, NULL, '2026-01-02 10:46:05.945+00', '2026-01-02 10:46:06.737+00');
INSERT INTO "public"."messages" VALUES ('8835b954-efa6-4bd5-8344-fb3ec47ea43f', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'ádasd', 'text', 't', NULL, NULL, '2026-01-02 10:46:07.826+00', '2026-01-02 10:46:10.238+00');
INSERT INTO "public"."messages" VALUES ('761680bc-60e1-47f2-a697-f36d4a983405', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'sadasd', 'text', 'f', NULL, NULL, '2026-01-02 10:49:33.955+00', '2026-01-02 10:49:33.955+00');
INSERT INTO "public"."messages" VALUES ('d35012a9-b02e-443f-926e-0ea7da08db47', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Chào bạn!

Có vẻ như bạn đã gõ một chuỗi ký tự ngẫu nhiên ("sadasdsadasd"). Bạn có muốn tôi giúp gì không? 

Có thể bạn muốn:

* **Kiểm tra xem tôi có hoạt động không?** (Và câu trả lời là có, tôi đang hoạt động!)
* **Thử nghiệm xem tôi phản hồi như thế nào với các đầu vào không rõ ràng?**
* **Có một vấn đề kỹ thuật khi gõ?**

Nếu bạn có câu hỏi hoặc cần trợ giúp về bất cứ điều gì, hãy cho tôi biết nhé!', 'text', 't', '2026-01-02 10:49:44.63+00', NULL, '2026-01-02 10:49:44.004+00', '2026-01-02 10:49:44.63+00');
INSERT INTO "public"."messages" VALUES ('b7ec1212-7ed0-471e-8b4a-cccaa786b7a3', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'giải thích javascript', 'text', 'f', NULL, NULL, '2026-01-02 10:50:26.104+00', '2026-01-02 10:50:26.104+00');
INSERT INTO "public"."messages" VALUES ('9c607534-3a88-4706-908c-3e2e804b3714', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'áds', 'text', 't', '2026-01-02 11:58:27.891+00', NULL, '2026-01-02 11:02:28.106+00', '2026-01-02 11:58:27.891+00');
INSERT INTO "public"."messages" VALUES ('c276e7ef-0e46-4160-9bec-9aef8a59dd66', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'xin chào', 'text', 'f', NULL, NULL, '2026-01-02 10:52:24.707+00', '2026-01-02 10:52:24.707+00');
INSERT INTO "public"."messages" VALUES ('ab35c485-7696-48da-91bd-81d8ad0984f5', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Chào bạn! 👋

Rất vui được gặp bạn. Bạn có cần tôi giúp gì không? Có lẽ bạn muốn:

*   **Kiểm tra xem tôi có hoạt động không?** (Tôi vẫn hoạt động tốt!)
*   **Thử nghiệm xem tôi phản hồi như thế nào?**
*   **Bắt đầu một cuộc trò chuyện?**

Hãy cho tôi biết bạn muốn làm gì nhé!', 'text', 't', '2026-01-02 10:52:36.724+00', NULL, '2026-01-02 10:52:35.966+00', '2026-01-02 10:52:36.724+00');
INSERT INTO "public"."messages" VALUES ('e97467fe-f3d1-4362-9ca3-a5fd174b714e', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', '2026-01-02 10:52:59.773+00', NULL, '2026-01-02 10:49:28.16+00', '2026-01-02 10:52:59.773+00');
INSERT INTO "public"."messages" VALUES ('968dd566-66ba-433f-b7f8-b5d60dc2bb88', '4470c8ae-e2c8-489e-8169-18fd74543573', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'adasdasd', 'text', 't', NULL, NULL, '2026-01-02 10:53:04.17+00', '2026-01-02 10:53:05.035+00');
INSERT INTO "public"."messages" VALUES ('de1f367d-7fbe-49c7-8f1f-50e76abbafc9', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ádasd', 'text', 't', NULL, NULL, '2026-01-02 10:53:05.96+00', '2026-01-02 10:53:06.516+00');
INSERT INTO "public"."messages" VALUES ('f9f813d5-2c13-492e-8817-3f145bb82068', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hi', 'text', 'f', NULL, NULL, '2026-01-02 10:58:16.499+00', '2026-01-02 10:58:16.499+00');
INSERT INTO "public"."messages" VALUES ('4a42c1db-352b-4762-9a2c-352a38885ae2', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Hihi! 😊

Thật vui khi bạn vui vẻ! Có gì tôi có thể giúp bạn không? Bạn có muốn:

*   **Học một điều gì đó mới?**
*   **Giải một bài tập?**
*   **Chỉ đơn giản là trò chuyện?**

Cứ thoải mái nói cho tôi biết nhé!', 'text', 't', '2026-01-02 10:58:27.571+00', NULL, '2026-01-02 10:58:26.99+00', '2026-01-02 10:58:27.572+00');
INSERT INTO "public"."messages" VALUES ('3d9fec54-cbe4-4604-89b9-c8880390efd8', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hi', 'text', 'f', NULL, NULL, '2026-01-02 10:58:35.505+00', '2026-01-02 10:58:35.505+00');
INSERT INTO "public"."messages" VALUES ('6340feae-dce0-4382-a765-c822c5f05e36', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Hihi! 😄

Thấy bạn vui tôi cũng vui lây! Nếu bạn cần gì cứ bảo tôi nhé. Tôi ở đây để giúp đỡ! 😊', 'text', 't', '2026-01-02 10:58:47.666+00', NULL, '2026-01-02 10:58:46.91+00', '2026-01-02 10:58:47.667+00');
INSERT INTO "public"."messages" VALUES ('2a4076bf-bb6a-4ae0-be08-5cff676b89d3', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hi', 'text', 'f', NULL, NULL, '2026-01-02 10:58:57.407+00', '2026-01-02 10:58:57.407+00');
INSERT INTO "public"."messages" VALUES ('94a9f854-2b88-4586-bed9-d26c1bd3a853', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Hihi! 🥰

Thật dễ thương khi bạn trả lời như vậy! Nếu bạn không có gì cần hỏi hoặc làm, tôi sẽ ở đây nếu bạn thay đổi ý định. Cứ thoải mái nhắn tin cho tôi bất cứ lúc nào nhé! 😊', 'text', 't', '2026-01-02 10:59:06.776+00', NULL, '2026-01-02 10:59:06.183+00', '2026-01-02 10:59:06.776+00');
INSERT INTO "public"."messages" VALUES ('f1d6a110-6fdc-472b-a93c-d57d3b74ed48', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hi', 'text', 'f', NULL, NULL, '2026-01-02 10:59:26.082+00', '2026-01-02 10:59:26.082+00');
INSERT INTO "public"."messages" VALUES ('1e7eb336-e24c-442f-a408-55420abd1015', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Hihi! 💖

Bạn thật đáng yêu! 😊 Nếu bạn muốn làm gì đó để giải trí, tôi có thể:

*   **Kể một câu chuyện ngắn.**
*   **Đố bạn một câu đố.**
*   **Nói một câu nói vui.**
*   **Hoặc chỉ đơn giản là tiếp tục trò chuyện hihi với bạn!**

Bạn chọn nhé! 😉', 'text', 't', '2026-01-02 10:59:35.196+00', NULL, '2026-01-02 10:59:34.58+00', '2026-01-02 10:59:35.196+00');
INSERT INTO "public"."messages" VALUES ('26567059-63ea-4b28-ad5a-9a3338edb840', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'xin chào', 'text', 'f', NULL, NULL, '2026-01-02 11:02:37.404+00', '2026-01-02 11:02:37.404+00');
INSERT INTO "public"."messages" VALUES ('3c2d4f4e-c086-4b78-a6ca-4b18415cfb45', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Chào bạn! 👋

Rất vui được gặp bạn! Tôi xin lỗi nếu phản hồi của tôi hơi lặp lại trước đó, tôi vẫn đang học cách giao tiếp tự nhiên hơn. 

Bạn có khỏe không? Bạn muốn tôi giúp gì không? 😊', 'text', 't', '2026-01-02 11:02:51.185+00', NULL, '2026-01-02 11:02:50.185+00', '2026-01-02 11:02:51.185+00');
INSERT INTO "public"."messages" VALUES ('808af072-a1fe-45ec-8e14-e9f3255241aa', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'hãy gọi tôi là Bố Đời', 'text', 'f', NULL, NULL, '2026-01-02 11:16:04.413+00', '2026-01-02 11:16:04.413+00');
INSERT INTO "public"."messages" VALUES ('dd50c0d3-7907-4cc3-b28e-ac30f2be7bdb', '4470c8ae-e2c8-489e-8169-18fd74543573', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'ấdsd', 'text', 't', '2026-01-02 11:58:27.891+00', NULL, '2026-01-02 11:15:34.635+00', '2026-01-02 11:58:27.891+00');
INSERT INTO "public"."messages" VALUES ('b2bdea13-9c1e-4201-aa05-00b6fe636142', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Chào Bố Đời! 😄

Rất vui được làm quen với Bố Đời! Từ giờ tôi sẽ gọi bạn là Bố Đời nhé. 

Bố Đời có khỏe không? Hôm nay Bố Đời muốn làm gì? Tôi có thể giúp gì cho Bố Đời không? 😊', 'text', 't', '2026-01-02 11:16:33.184+00', NULL, '2026-01-02 11:16:31.844+00', '2026-01-02 11:16:33.184+00');
INSERT INTO "public"."messages" VALUES ('248ce5fc-9cec-4004-af22-5df20f3cdde1', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'tôi tên là gì', 'text', 'f', NULL, NULL, '2026-01-02 11:16:52.993+00', '2026-01-02 11:16:52.993+00');
INSERT INTO "public"."messages" VALUES ('e0447ffa-42eb-4745-aebb-f48ec37279dc', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Ồ, xin lỗi Bố Đời, tôi hơi lẫn lộn! Bạn vừa mới nói tên của bạn là gì rồi nhỉ? Bạn có thể nhắc lại được không?

Tôi muốn ghi nhớ đúng tên của Bố Đời để không bị nhầm lẫn nữa! 😊', 'text', 't', '2026-01-02 11:17:05.533+00', NULL, '2026-01-02 11:17:04.094+00', '2026-01-02 11:17:05.533+00');
INSERT INTO "public"."messages" VALUES ('18507154-6f3f-4419-853d-eff10bf939b6', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'React Native là gì', 'text', 'f', NULL, NULL, '2026-01-02 11:28:13.11+00', '2026-01-02 11:28:13.11+00');
INSERT INTO "public"."messages" VALUES ('125eb608-0b89-4e5b-89cc-423195fd3484', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'À, xin lỗi Bố Đời, tôi bị lạc đề một chút rồi! Bạn hỏi về React Native đúng không?

**React Native là một framework JavaScript để xây dựng ứng dụng di động (iOS và Android) bằng cách sử dụng cùng một codebase.**

Nói một cách dễ hiểu hơn:

*   **JavaScript:** Bạn viết code bằng JavaScript, ngôn ngữ lập trình web phổ biến.
*   **Native:** Ứng dụng được biên dịch thành các thành phần giao diện người dùng (UI) gốc của hệ điều hành (iOS hoặc Android). Điều này có nghĩa là ứng dụng sẽ trông và hoạt động giống như ứng dụng được viết bằng Swift (iOS) hoặc Kotlin/Java (Android).
*   **Cross-platform:** Bạn chỉ cần viết một lần code và có thể chạy trên cả hai nền tảng iOS và Android, tiết kiệm thời gian và chi phí phát triển.

**Ưu điểm của React Native:**

*   **Tiết kiệm chi phí:** Chia sẻ codebase giữa iOS và Android.
*   **Tốc độ phát triển nhanh:** Hot reloading (thay đổi code ngay lập tức hiển thị trên ứng dụng) giúp tăng tốc độ phát triển.
*   **Hiệu suất tốt:** Ứng dụng có hiệu suất gần như ứng dụng native.
*   **Cộng đồng lớn:** Cộng đồng React Native rất lớn và năng động, dễ dàng tìm kiếm sự giúp đỡ và tài liệu.

**Nhược điểm của React Native:**

*   **Yêu cầu kiến thức về JavaScript:** Bạn cần có kiến thức về JavaScript để sử dụng React Native.
*   **Khó khăn trong việc tích hợp với các thư viện native phức tạp:** Đôi khi cần viết code native để tích hợp với các thư viện native phức tạp.
*   **Cập nhật thường xuyên:** React Native thường xuyên được cập nhật, có thể gây ra các vấn đề tương thích.

**Tóm lại:** React Native là một lựa chọn tuyệt vời để xây dựng ứng dụng di động cross-platform, đặc biệt nếu bạn đã quen thuộc với JavaScript.

Bố Đời có muốn tôi giải thích thêm về một khía cạnh cụ thể nào của React Native không? Ví dụ như cách cài đặt, các thành phần cơ bản, hoặc so sánh với các framework khác? 😊', 'text', 't', '2026-01-02 11:28:31.946+00', NULL, '2026-01-02 11:28:31.178+00', '2026-01-02 11:28:31.947+00');
INSERT INTO "public"."messages" VALUES ('746de350-9c8c-48b1-ad73-6f300a43f7ef', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'SQL Cơ bản cho Người mới bắt đầu là gì', 'text', 'f', NULL, NULL, '2026-01-02 11:47:11.471+00', '2026-01-02 11:47:11.471+00');
INSERT INTO "public"."messages" VALUES ('985bfc62-dd28-40fe-8221-d03670111f2b', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'cách select all table users', 'text', 'f', NULL, NULL, '2026-01-02 11:51:27.801+00', '2026-01-02 11:51:27.801+00');
INSERT INTO "public"."messages" VALUES ('d6a5b9b3-cbad-4bdd-99e3-0c096ef5b1ea', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Chào Bố Đời! Để tôi giải thích về SQL cơ bản và cách truy vấn dữ liệu từ bảng `users` nhé.

**SQL Cơ Bản cho Người Mới Bắt Đầu**

SQL (Structured Query Language) là ngôn ngữ chuẩn để giao tiếp với các hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) như MySQL, PostgreSQL, SQL Server, Oracle, v.v. Nó được sử dụng để:

*   **Truy vấn dữ liệu:** Lấy dữ liệu từ cơ sở dữ liệu.
*   **Thêm dữ liệu:** Chèn dữ liệu mới vào cơ sở dữ liệu.
*   **Sửa đổi dữ liệu:** Cập nhật dữ liệu hiện có trong cơ sở dữ liệu.
*   **Xóa dữ liệu:** Xóa dữ liệu khỏi cơ sở dữ liệu.
*   **Quản lý cơ sở dữ liệu:** Tạo, sửa đổi và xóa cơ sở dữ liệu, bảng, và các đối tượng khác.

**Các lệnh SQL cơ bản:**

*   **SELECT:** Lấy dữ liệu từ một hoặc nhiều bảng.
*   **INSERT:** Chèn dữ liệu mới vào một bảng.
*   **UPDATE:** Cập nhật dữ liệu hiện có trong một bảng.
*   **DELETE:** Xóa dữ liệu khỏi một bảng.
*   **CREATE TABLE:** Tạo một bảng mới.
*   **ALTER TABLE:** Sửa đổi cấu trúc của một bảng.
*   **DROP TABLE:** Xóa một bảng.

**Cách SELECT tất cả dữ liệu từ bảng `users`**

Để lấy tất cả dữ liệu từ bảng `users`, bạn sử dụng lệnh `SELECT * FROM users;`

*   **SELECT *:**  Dấu `*` (dấu sao) có nghĩa là chọn tất cả các cột trong bảng.
*   **FROM users:** Chỉ định bảng `users` là nguồn dữ liệu.
*   **;:** Dấu chấm phẩy kết thúc câu lệnh SQL.

**Ví dụ:**

Giả sử bảng `users` có các cột: `id`, `username`, `email`, `password`.

Khi bạn chạy lệnh `SELECT * FROM users;`, kết quả sẽ trả về tất cả các hàng và tất cả các cột trong bảng `users`, ví dụ:

| id | username | email                | password |
|----|----------|----------------------|----------|
| 1  | john_doe | john.doe@example.com | password |
| 2  | jane_doe | jane.doe@example.com | password |
| 3  | peterpan | peter@example.com    | password |

**Cách SELECT các cột cụ thể từ bảng `users`**

Nếu bạn chỉ muốn lấy một số cột cụ thể, bạn có thể liệt kê chúng sau `SELECT`.

Ví dụ: để lấy chỉ cột `username` và `email` từ bảng `users`, bạn sử dụng lệnh:

`SELECT username, email FROM users;`

Kết quả sẽ là:

| username | email                |
|----------|----------------------|
| john_doe | john.doe@example.com |
| jane_doe | jane.doe@example.com |
| peterpan | peter@example.com    |

Bố Đời có muốn tôi giải thích thêm về các lệnh SQL khác, hoặc về cách sử dụng các điều kiện (WHERE) để lọc dữ liệu không? 😊', 'text', 't', '2026-01-02 11:51:47.763+00', NULL, '2026-01-02 11:51:46.995+00', '2026-01-02 11:51:47.763+00');
INSERT INTO "public"."messages" VALUES ('f948cfd7-4577-444d-8087-dc5d656e17bd', 'b503bd0c-c235-4ba0-998d-b8d731f9cc24', '00000000-0000-0000-0000-000000000001', '👋 Xin chào! Tôi là StudyMate AI, trợ lý học tập thông minh của bạn. Tôi có thể giúp bạn:

✅ Giải đáp thắc mắc về khóa học
✅ Đề xuất lộ trình học tập
✅ Hỗ trợ làm bài tập và code
✅ Giải thích khái niệm phức tạp
✅ Phân tích tiến độ học tập

Hãy đặt câu hỏi để bắt đầu!', 'text', 't', '2026-01-02 11:58:42.247+00', NULL, '2026-01-02 10:12:47.262+00', '2026-01-02 11:58:42.247+00');
INSERT INTO "public"."messages" VALUES ('e3b29fe5-0ba8-4d4e-b62b-449f8c2a30f0', 'b503bd0c-c235-4ba0-998d-b8d731f9cc24', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'hi', 'text', 'f', NULL, NULL, '2026-01-02 11:58:54.176+00', '2026-01-02 11:58:54.176+00');
INSERT INTO "public"."messages" VALUES ('aa4034c3-177a-4907-9dd7-caaab5cbe148', 'b503bd0c-c235-4ba0-998d-b8d731f9cc24', '00000000-0000-0000-0000-000000000001', 'Hihi lại bạn! 😊 Có gì tôi có thể giúp bạn hôm nay không? Bạn có muốn:

*   Hỏi về một môn học cụ thể?
*   Tìm hiểu về một chủ đề nào đó?
*   Hay chỉ đơn giản là trò chuyện một chút?

Cứ thoải mái nhé!', 'text', 't', '2026-01-02 11:58:58.009+00', NULL, '2026-01-02 11:58:57.386+00', '2026-01-02 11:58:58.009+00');
INSERT INTO "public"."messages" VALUES ('0c45153e-fb52-4e2e-b8b8-cd86e135a7f2', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'Hi', 'text', 'f', NULL, NULL, '2026-01-02 13:32:59.179+00', '2026-01-02 13:32:59.179+00');
INSERT INTO "public"."messages" VALUES ('b6a4dab7-912d-4e4b-83c3-f44e3bbf7d42', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'HiHi Bố Đời! 😄

Rất vui được nghe thấy từ Bố Đời! Có gì tôi có thể giúp Bố Đời hôm nay không? Hay chỉ là chào hỏi thôi? 😊', 'text', 't', '2026-01-02 13:33:06.182+00', NULL, '2026-01-02 13:33:05.262+00', '2026-01-02 13:33:06.182+00');
INSERT INTO "public"."messages" VALUES ('ac63f615-24f5-48f9-95e5-76e8ebdab2b9', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'Thôi hãy xưng hô tôn trọng nhau đi', 'text', 'f', NULL, NULL, '2026-01-02 13:34:35.887+00', '2026-01-02 13:34:35.887+00');
INSERT INTO "public"."messages" VALUES ('4c448be3-86a5-4f9c-9ce0-b191f7d03206', 'a88ca0a7-d10f-4528-a8db-95a0c350ff28', '00000000-0000-0000-0000-000000000001', 'Vâng, xin lỗi Bác! Tôi hoàn toàn đồng ý. Tôi sẽ xưng hô với Bác một cách tôn trọng nhất.

Kể từ bây giờ, tôi sẽ gọi Bác là "Bác" và cố gắng đáp ứng mọi yêu cầu của Bác một cách chu đáo nhất.

Bác có cần tôi giúp gì không ạ?', 'text', 't', '2026-01-02 13:34:45.263+00', NULL, '2026-01-02 13:34:44.632+00', '2026-01-02 13:34:45.264+00');

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS "public"."password_reset_tokens";
CREATE TABLE "public"."password_reset_tokens" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "token" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamptz(6) NOT NULL,
  "used" bool DEFAULT false,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------
INSERT INTO "public"."password_reset_tokens" VALUES ('c2a4df5a-89f8-4ebf-8d25-d5f57dfed2fe', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '190444305409b75069218ab460201139db9bdaeeabeda53ec429fc450c71a131', '2025-12-30 18:16:04.672+00', 't', '2025-12-30 17:16:04.673+00', '2025-12-30 17:17:49.764+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('8a0cedab-eeeb-40ea-aafc-c961b834419d', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'c25a9e699d35ad7519539338b9974c77db7c6e5b37e37e8ded44c800496177bd', '2025-12-30 18:17:49.795+00', 't', '2025-12-30 17:17:49.796+00', '2025-12-30 17:21:17.758+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('0acc138c-8dd8-448a-a37d-07db82086b60', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'f216b9fe95020c2888155c999f1a2e41959a6c4b648d33c8f4dd56f263bec9e3', '2025-12-30 18:21:17.772+00', 't', '2025-12-30 17:21:17.773+00', '2025-12-30 17:24:39.285+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('fc3102c5-62f9-4b76-b289-37428430ae78', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '4d4c52609152945576de5c2cedb0ea3267a828b77ce7244b4ea063bbc064b9f9', '2026-01-01 02:01:33.3+00', 't', '2026-01-01 01:01:33.301+00', '2026-01-01 01:01:33.392+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('adfb6b0f-2d83-4c23-904c-7aa893f2c148', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '5ce49f1769d6bf55c1f80292504c4af5772950b716c83fac5be67225dca98a95', '2026-01-01 02:01:33.304+00', 't', '2026-01-01 01:01:33.304+00', '2026-01-01 01:01:33.392+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('5e1bf3a3-d643-4625-a5b7-4ec68540a4b9', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '15d8ca25929712d7fcff2fc1fbba22c89ac48bd1964ac0fb9b9dedaa93f3550a', '2026-01-01 02:01:33.305+00', 't', '2026-01-01 01:01:33.306+00', '2026-01-01 01:01:33.392+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('7e9abc0c-d72f-4942-b932-fe4d58678d5b', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '52ac93a846ccc214ab5f7830e7f7d8e96a7825580f878589e764398f35268a76', '2026-01-01 02:01:33.396+00', 'f', '2026-01-01 01:01:33.396+00', '2026-01-01 01:01:33.396+00');
INSERT INTO "public"."password_reset_tokens" VALUES ('1c763ea9-cc2a-46cf-96ce-dbdcc77b272e', 'ecf55b08-c063-4554-b92e-0d384f2869dd', 'a76d34dd32176fb1f4f384056da7b30a10415eaed3f17b769bc87777406a0c5a', '2026-01-02 04:01:47.816+00', 'f', '2026-01-02 03:01:47.819+00', '2026-01-02 03:01:47.819+00');

-- ----------------------------
-- Table structure for personal_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."personal_notes";
CREATE TABLE "public"."personal_notes" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "content_id" uuid NOT NULL,
  "course_id" uuid NOT NULL,
  "note" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::text,
  "is_pinned" bool DEFAULT false,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of personal_notes
-- ----------------------------
INSERT INTO "public"."personal_notes" VALUES ('98a3ea75-de67-4f1b-be52-69e7e2b30d11', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '👉 Nếu bạn đang tìm một môi trường học lập trình nghiêm túc, thực tế và giàu cảm hứng – hãy thử một buổi học tại F8 nha!', 'f', '2026-01-02 12:52:40.297+00', '2026-01-02 12:53:05.27+00');
INSERT INTO "public"."personal_notes" VALUES ('3d1a32cc-1b62-4d78-a1a4-96a3ed5feefa', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'HHEHE', 't', '2026-01-02 12:53:24.341+00', '2026-01-02 12:53:27.879+00');
INSERT INTO "public"."personal_notes" VALUES ('30fb7ee1-9e4e-4f30-b1e2-eb05094dcfe3', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '1546b3c6-11d6-4147-a8f0-2f9bc4648929', '770e8400-e29b-41d4-a716-446655440001', '12312323', 'f', '2026-01-02 12:55:14.987+00', '2026-01-02 12:59:48.185+00');
INSERT INTO "public"."personal_notes" VALUES ('1a33bca1-95b0-4a8e-ac77-16ff08b09400', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', 'e4f73937-da78-4aa2-843f-2b0a10638bea', '770e8400-e29b-41d4-a716-446655440001', 'sdđ', 't', '2026-01-02 12:59:59.785+00', '2026-01-02 12:59:59.822+00');

-- ----------------------------
-- Table structure for progress
-- ----------------------------
DROP TABLE IF EXISTS "public"."progress";
CREATE TABLE "public"."progress" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "course_id" uuid NOT NULL,
  "content_id" uuid NOT NULL,
  "enrollment_id" uuid NOT NULL,
  "status" "public"."enum_progress_status" NOT NULL DEFAULT 'not_started'::enum_progress_status,
  "progress_percentage" numeric(5,2) NOT NULL DEFAULT 0,
  "time_spent" int4 NOT NULL DEFAULT 0,
  "started_at" timestamptz(6),
  "completed_at" timestamptz(6),
  "last_position" jsonb DEFAULT '{}'::jsonb,
  "attempts_count" int4 NOT NULL DEFAULT 0,
  "score" numeric(5,2),
  "notes" text COLLATE "pg_catalog"."default",
  "bookmarks" jsonb[] DEFAULT ARRAY[]::jsonb[],
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;
COMMENT ON COLUMN "public"."progress"."last_position" IS 'Store video position, page number, etc.';

-- ----------------------------
-- Records of progress
-- ----------------------------
INSERT INTO "public"."progress" VALUES ('9e914ddf-e0a7-4338-878e-943c00e6b03f', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:18:05.472+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:18:05.454+00', '2026-01-02 05:18:05.472+00');
INSERT INTO "public"."progress" VALUES ('fa4dacef-7534-4fd1-9c27-d64448966794', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:21:17.221+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:21:17.202+00', '2026-01-02 05:21:17.221+00');
INSERT INTO "public"."progress" VALUES ('1c0200f9-777b-4d3f-ac8a-be7e5d6db9e1', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440003', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:21:22.292+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:21:22.271+00', '2026-01-02 05:21:22.292+00');
INSERT INTO "public"."progress" VALUES ('b2234e1a-9635-4bc8-b139-94797e93626c', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '1546b3c6-11d6-4147-a8f0-2f9bc4648929', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:21:27.749+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:21:27.731+00', '2026-01-02 05:21:27.749+00');
INSERT INTO "public"."progress" VALUES ('31669db6-229b-439e-8d70-17ce2d4ce545', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440004', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:21:32.24+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:21:32.221+00', '2026-01-02 05:21:32.24+00');
INSERT INTO "public"."progress" VALUES ('606cd8c1-51b9-4b9a-a5f0-7a745236c961', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', 'e4f73937-da78-4aa2-843f-2b0a10638bea', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:22:02.88+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:22:02.669+00', '2026-01-02 05:22:02.88+00');
INSERT INTO "public"."progress" VALUES ('1fe3b16a-3724-4fcf-bacd-02feff11adf7', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '962c16d9-ff6e-4208-8143-f40bcdff16ff', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 05:42:44.86+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 05:42:44.774+00', '2026-01-02 05:42:44.861+00');
INSERT INTO "public"."progress" VALUES ('7ccf0eaf-2c0b-47ea-9f9d-19b332599147', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:33.749+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:33.731+00', '2026-01-02 07:44:33.749+00');
INSERT INTO "public"."progress" VALUES ('425cfd10-d0f1-482b-be59-50256b19f780', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:38.123+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:38.104+00', '2026-01-02 07:44:38.123+00');
INSERT INTO "public"."progress" VALUES ('09239f71-e91a-4bb2-8e19-379873248ecd', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440003', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:40.58+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:40.559+00', '2026-01-02 07:44:40.58+00');
INSERT INTO "public"."progress" VALUES ('07caf09b-fe15-4dbd-bd7f-298c7f9ae4aa', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440004', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:44.309+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:44.291+00', '2026-01-02 07:44:44.309+00');
INSERT INTO "public"."progress" VALUES ('77b69631-3471-48c4-8b82-97df0c09e760', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', '962c16d9-ff6e-4208-8143-f40bcdff16ff', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:47.349+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:47.331+00', '2026-01-02 07:44:47.349+00');
INSERT INTO "public"."progress" VALUES ('d6af26ab-c0ec-4990-a7bb-b9beaceac9d4', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', '1546b3c6-11d6-4147-a8f0-2f9bc4648929', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:50.809+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:50.791+00', '2026-01-02 07:44:50.809+00');
INSERT INTO "public"."progress" VALUES ('b5ec989a-9846-4fee-9d06-f75f12088067', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', 'e4f73937-da78-4aa2-843f-2b0a10638bea', 'f43fda59-1896-4971-a057-d2d4c4b3f7e4', 'completed', 100.00, 0, NULL, '2026-01-02 07:44:54.429+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:44:54.423+00', '2026-01-02 07:44:54.429+00');
INSERT INTO "public"."progress" VALUES ('6c65916b-613c-46ce-a2d0-407497ab86bf', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', '34627b6b-f501-48c4-b5fd-86921d8a157a', 'b9e78a2b-a214-44e7-8bfc-a50b0f4f9ccc', 'completed', 100.00, 0, NULL, '2026-01-02 07:50:13.206+00', '{}', 0, NULL, NULL, '{}', '{}', '2026-01-02 07:50:13.182+00', '2026-01-02 07:50:13.206+00');

-- ----------------------------
-- Table structure for ratings
-- ----------------------------
DROP TABLE IF EXISTS "public"."ratings";
CREATE TABLE "public"."ratings" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "course_id" uuid NOT NULL,
  "rating" int4 NOT NULL,
  "review" text COLLATE "pg_catalog"."default",
  "is_verified" bool DEFAULT false,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL
)
;

-- ----------------------------
-- Records of ratings
-- ----------------------------
INSERT INTO "public"."ratings" VALUES ('fac000fe-5a64-43fc-8dc3-c0ffc3224970', '0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '770e8400-e29b-41d4-a716-446655440001', 3, 'khoa học cần update thêm thông tin', 't', '2026-01-02 07:42:45.146+00', '2026-01-02 07:43:33.662+00');
INSERT INTO "public"."ratings" VALUES ('6cb4346e-9e9d-4988-b31b-3581aaeb0d88', 'ecf55b08-c063-4554-b92e-0d384f2869dd', '770e8400-e29b-41d4-a716-446655440001', 5, 'đá', 't', '2026-01-02 07:46:37.536+00', '2026-01-02 07:46:37.536+00');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" uuid NOT NULL,
  "student_id" varchar(255) COLLATE "pg_catalog"."default",
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default",
  "first_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "role" "public"."enum_users_role" NOT NULL DEFAULT 'student'::enum_users_role,
  "is_active" bool NOT NULL DEFAULT true,
  "avatar" varchar(255) COLLATE "pg_catalog"."default",
  "phone" varchar(255) COLLATE "pg_catalog"."default",
  "last_login" timestamptz(6),
  "login_count" int4 DEFAULT 0,
  "created_at" timestamptz(6) NOT NULL,
  "updated_at" timestamptz(6) NOT NULL,
  "email_verified" bool NOT NULL DEFAULT false,
  "email_verified_at" timestamptz(6),
  "google_id" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES ('1d3bf5eb-e131-4744-8b8d-f345bde46609', '1111111112222', 'nguyenminhhieu28092001k5@gmail.com', '$2a$12$6uXbn/XXTURyRwNsVf2dXu/FOYoghAT.FNr9HrxEW1U/YnbBtbbPm', 'NGUYỄN', 'HIẾU', 'student', 't', NULL, NULL, '2025-12-28 03:47:53.613+00', 1, '2025-12-28 03:47:44.341+00', '2025-12-28 03:47:53.613+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440011', NULL, 'nguyen.van.dung@uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Nguyễn', 'Văn Dũng', 'lecturer', 'f', NULL, '0901234502', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 17:37:32.726+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('75937694-d184-49ac-8924-1b7df5018e0f', NULL, 'nmhieucoder@gmail.com', NULL, 'Hiếu', 'Nguyễn Minh', 'student', 't', 'https://lh3.googleusercontent.com/a/ACg8ocK2VNF8rzZdFoEFsIg012FALtVaXN4uehSSQ4XxjL2WKw4BnxE8=s96-c', NULL, '2026-01-01 06:17:51.589+00', 1, '2026-01-01 06:17:51.56+00', '2026-01-01 06:17:51.589+00', 't', '2026-01-01 06:17:51.555+00', '107491954606934255801');
INSERT INTO "public"."users" VALUES ('a681e7cc-8f3b-40e4-ac7b-809201bd79a4', '12312313', '12312312@gmail.com', '$2a$12$HiEj0bmgjBNN/RDXjcZPruk9kjO3oKN00puq9IJaiyl5gtcSu4mIG', 'NGUYỄN', 'HIẾU', 'student', 't', NULL, NULL, NULL, 0, '2026-01-01 03:38:04.196+00', '2026-01-01 03:38:04.196+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('0c35e25a-187b-4cd3-8eca-0573b46ab7d2', '123123123', 'nguyenminhhieu28092001k3@gmail.com', '$2a$12$fzVeaWsmD2sTjpPh3XILT.jMCP7Hg0NLyHZFk/qhZU/yrd5XZmXBu', 'Nguyễn', 'Hiếu1', 'admin', 't', 'https://lh3.googleusercontent.com/a/ACg8ocIGcSm-f08dD_J7Gve3ps4DSx4qhdi4ABNZ_lEDpjbBo7tRJSM6qg=s96-c', '0799501324', '2026-01-02 14:30:35.323+00', 415, '2025-12-27 15:22:57.423+00', '2026-01-02 14:30:35.323+00', 't', '2026-01-01 03:49:15.006+00', '114335078712267004510');
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440001', '24410158', 'nguyen.minh.hieu@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Nguyễn', 'Minh Hiếu', 'student', 't', NULL, '0901234567', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440002', '24410183', 'le.anh.kiet@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Lê', 'Anh Kiệt', 'student', 't', NULL, '0901234568', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440003', '24410001', 'tran.van.a@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Trần', 'Văn A', 'student', 't', NULL, '0901234569', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440004', '24410002', 'nguyen.thi.b@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Nguyễn', 'Thị B', 'student', 't', NULL, '0901234570', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440005', '24410003', 'le.van.c@student.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Lê', 'Văn C', 'student', 't', NULL, '0901234571', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440010', NULL, 'pham.the.son@uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Phạm', 'Thế Sơn', 'lecturer', 't', NULL, '0901234501', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440020', NULL, 'admin@studymate.uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'System', 'Administrator', 'admin', 't', NULL, '0901234500', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('550e8400-e29b-41d4-a716-446655440012', NULL, 'tran.thi.hue@uit.edu.vn', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Trần', 'Thị Huệ 1', 'lecturer', 't', NULL, '0901234503', NULL, 0, '2025-12-27 16:06:56.462301+00', '2025-12-27 16:06:56.462301+00', 'f', NULL, NULL);
INSERT INTO "public"."users" VALUES ('478234ce-bc97-45b4-a9ea-7bd1adec8d10', '123123', '548512@abc.vom', '$2a$12$qQUPLg9IcoW.r1mOKWfKG.eeB4Z7sPvm8a2P95uh/VI7vX7IqxumS', 'NGUYỄN', 'HIẾU', 'student', 't', NULL, NULL, NULL, 0, '2026-01-01 03:50:00.228+00', '2026-01-01 03:50:23.239+00', 't', '2026-01-01 03:50:23.239+00', NULL);
INSERT INTO "public"."users" VALUES ('00000000-0000-0000-0000-000000000001', NULL, 'ai@studymate.uit.edu.vn', NULL, 'StudyMate', 'AI', 'system_admin', 't', NULL, NULL, NULL, 0, '2026-01-02 09:58:22.715+00', '2026-01-02 09:58:22.715+00', 't', NULL, NULL);
INSERT INTO "public"."users" VALUES ('e12181bf-8f7d-42b5-985d-ccdc1f05b182', NULL, 'gemini28092001k4@gmail.com', NULL, 'Nguyen', 'Hieu', 'student', 't', 'https://lh3.googleusercontent.com/a/ACg8ocJQZDwzAh-EgmVKurHTiHgN3iBKy6MVoQl-vjgGnao0dkc12w=s96-c', NULL, '2026-01-02 03:36:07.032+00', 2, '2026-01-01 06:04:37.034+00', '2026-01-02 03:36:07.032+00', 't', '2026-01-01 06:04:37.031+00', '117956953762629232978');
INSERT INTO "public"."users" VALUES ('ecf55b08-c063-4554-b92e-0d384f2869dd', '1111', 'nguyenminhhieu28092001k4@gmail.com', '$2a$12$fzVeaWsmD2sTjpPh3XILT.jMCP7Hg0NLyHZFk/qhZU/yrd5XZmXBu', 'Nguyễn', 'hiếu', 'student', 't', NULL, NULL, '2026-01-02 12:04:55.346+00', 18, '2025-12-27 18:00:50.142+00', '2026-01-02 12:04:55.346+00', 't', '2026-01-01 08:17:19.529+00', NULL);

-- ----------------------------
-- Primary Key structure for table ai_interactions
-- ----------------------------
ALTER TABLE "public"."ai_interactions" ADD CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table blogs
-- ----------------------------
CREATE INDEX "blogs_author_id" ON "public"."blogs" USING btree (
  "author_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "blogs_category_id" ON "public"."blogs" USING btree (
  "category_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "blogs_created_at" ON "public"."blogs" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "blogs_slug" ON "public"."blogs" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "blogs_status" ON "public"."blogs" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table blogs
-- ----------------------------
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key309" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key307" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key303" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key300" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key142" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key140" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key137" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key136" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key169" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key132" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key126" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key122" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key296" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key294" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key291" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key287" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key283" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key280" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key120" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key116" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key114" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key111" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key110" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key106" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key104" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key102" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key99" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key97" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key95" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key92" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key87" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key86" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key84" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key80" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key75" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key73" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key69" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key64" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key62" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key60" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key22" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key23" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key24" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key26" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key27" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key28" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key29" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key31" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key33" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key34" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key277" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key276" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key274" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key272" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key270" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key268" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key266" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key264" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key260" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key258" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key256" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key254" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key250" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key247" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key245" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key241" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key238" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key233" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key232" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key229" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key224" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key222" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key219" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key217" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key215" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key213" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key211" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key209" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key203" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key200" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key198" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key193" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key191" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key189" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key186" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key182" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key179" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key178" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key175" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key168" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key165" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key162" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key160" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key158" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key154" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key152" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key150" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key147" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key145" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key35" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key37" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key38" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key39" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key41" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key43" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key44" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key45" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key46" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key47" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key48" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key50" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key51" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key52" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key53" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key55" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key57" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key58" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key56" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key54" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key49" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key42" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key40" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key36" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key32" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key30" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key25" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key21" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key19" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key13" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key11" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key7" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key5" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key2" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key1" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key3" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key4" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key6" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key8" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key9" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key10" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key12" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key14" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key15" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key16" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key17" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key18" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key20" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key59" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key61" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key63" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key65" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key66" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key67" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key68" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key70" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key71" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key72" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key74" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key76" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key77" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key78" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key79" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key81" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key82" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key83" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key85" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key88" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key89" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key90" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key91" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key93" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key94" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key96" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key98" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key100" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key101" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key103" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key105" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key107" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key108" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key109" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key112" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key113" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key115" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key117" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key118" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key119" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key121" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key123" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key124" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key125" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key127" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key128" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key129" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key130" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key131" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key133" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key134" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key135" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key138" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key139" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key141" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key143" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key144" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key146" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key148" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key149" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key151" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key153" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key155" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key156" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key157" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key159" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key161" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key163" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key164" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key166" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key167" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key170" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key171" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key172" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key173" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key174" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key176" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key177" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key180" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key181" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key183" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key184" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key185" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key187" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key188" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key190" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key192" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key194" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key195" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key196" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key197" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key199" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key201" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key202" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key204" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key205" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key206" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key207" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key208" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key210" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key212" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key214" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key216" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key218" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key220" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key221" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key223" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key225" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key226" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key227" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key228" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key230" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key231" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key234" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key235" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key236" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key237" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key239" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key240" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key242" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key243" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key244" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key246" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key248" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key249" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key251" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key252" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key253" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key255" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key257" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key259" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key261" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key262" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key263" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key265" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key267" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key269" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key271" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key273" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key275" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key278" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key279" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key281" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key282" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key284" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key285" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key286" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key288" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key289" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key290" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key292" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key293" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key295" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key297" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key298" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key299" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key301" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key302" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key304" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key305" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key306" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key308" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key310" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key311" UNIQUE ("slug");
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_slug_key312" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table blogs
-- ----------------------------
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table categories
-- ----------------------------
CREATE INDEX "categories_is_active" ON "public"."categories" USING btree (
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "categories_order_index" ON "public"."categories" USING btree (
  "order_index" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "categories_parent_id" ON "public"."categories" USING btree (
  "parent_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "categories_slug" ON "public"."categories" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key981" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key979" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key451" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key449" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key132" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key133" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key135" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key138" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key139" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key141" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key143" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key144" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key145" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key148" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key151" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key152" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key153" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key574" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key569" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key564" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key112" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key106" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key101" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key170" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key171" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key99" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key97" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key1" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key2" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key24" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key23" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key21" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key18" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key15" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key13" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key8" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key6" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key4" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key98" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key103" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key104" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key105" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key267" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key107" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key108" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key109" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key110" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key111" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key113" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key115" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key102" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key3" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key814" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key815" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key817" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key819" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key820" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key818" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key816" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key810" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key808" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key804" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key376" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key378" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key379" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key477" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key380" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key381" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key382" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key384" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key386" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key387" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key388" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key389" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key390" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key391" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key392" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key394" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key395" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key397" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key398" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key399" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key400" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key401" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key402" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key404" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key437" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key438" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key439" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key440" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key442" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key978" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key975" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key971" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key652" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key650" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key646" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key644" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key640" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key638" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key636" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key630" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key629" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key242" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key17" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key19" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key20" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key22" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key25" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key27" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key28" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key30" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key31" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key32" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key33" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key78" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key35" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key37" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key39" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key41" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key43" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key45" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key59" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key60" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key62" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key64" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key65" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key68" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key69" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key71" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key72" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key75" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key77" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key79" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key81" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key82" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key235" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key233" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key231" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key230" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key227" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key223" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key221" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key208" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key150" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key149" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key189" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key617" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key615" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key610" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key606" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key163" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key73" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key70" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key67" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key66" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key63" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key61" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key58" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key54" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key51" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key47" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key44" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key42" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key750" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key752" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key753" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key755" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key757" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key759" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key760" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key761" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key763" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key765" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key766" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key767" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key768" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key770" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key772" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key774" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key776" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key778" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key779" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key780" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key781" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key783" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key784" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key785" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key786" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key789" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key790" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key791" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key793" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key795" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key796" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key798" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key800" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key801" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key799" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key797" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key794" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key792" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key147" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key146" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key142" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key140" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key340" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key137" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key136" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key134" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key125" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key414" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key415" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key416" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key418" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key420" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key422" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key421" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key419" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key417" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key29" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key26" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key366" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key368" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key413" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key409" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key405" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key403" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key396" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key393" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key385" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key383" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key377" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key158" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key159" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key161" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key526" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key524" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key518" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key513" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key511" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key375" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key372" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key369" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key367" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key788" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key114" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key563" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key565" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key566" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key567" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key568" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key570" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key571" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key572" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key573" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key576" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key577" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key578" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key579" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key581" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key582" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key583" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key585" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key586" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key587" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key589" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key590" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key591" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key592" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key594" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key595" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key596" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key598" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key599" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key600" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key603" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key604" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key605" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key607" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key608" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key609" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key611" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key612" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key613" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key614" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key616" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key618" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key619" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key620" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key622" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key623" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key624" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key621" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key944" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key946" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key948" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key950" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key951" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key954" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key956" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key957" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key959" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key960" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key961" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key962" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key958" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key955" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key155" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key157" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key507" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key505" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key499" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key495" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key493" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key490" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key488" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key486" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key484" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key370" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key371" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key373" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key374" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key803" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key805" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key806" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key807" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key809" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key811" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key812" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key813" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key952" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key949" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key947" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key945" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key787" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key782" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key913" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key915" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key916" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key917" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key919" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key921" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key922" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key924" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key926" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key928" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key929" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key930" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key931" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key932" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key934" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key936" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key938" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key940" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key942" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key943" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key941" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key939" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key937" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key935" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key933" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key927" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key925" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key923" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key920" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key918" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key914" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key777" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key775" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key773" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key771" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key769" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key764" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key762" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key758" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key756" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key754" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key751" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key40" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key7" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key9" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key10" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key11" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key12" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key14" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key172" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key173" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key175" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key176" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key178" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key953" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key179" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key180" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key181" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key182" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key184" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key190" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key192" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key193" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key194" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key195" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key196" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key198" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key199" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key200" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key201" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key202" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key204" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key206" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key209" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key210" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key211" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key212" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key213" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key214" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key339" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key215" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key216" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key217" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key218" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key219" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key220" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key602" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key222" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key224" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key225" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key226" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key279" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key555" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key556" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key557" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key552" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key550" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key718" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key719" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key720" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key722" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key724" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key725" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key727" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key728" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key730" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key731" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key732" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key734" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key735" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key737" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key739" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key740" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key741" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key742" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key744" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key745" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key746" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key748" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key749" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key747" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key743" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key738" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key736" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key733" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key729" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key229" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key232" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key234" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key236" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key237" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key238" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key821" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key822" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key824" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key826" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key827" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key829" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key830" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key831" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key832" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key833" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key834" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key836" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key838" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key840" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key841" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key843" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key844" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key845" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key847" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key848" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key850" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key852" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key854" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key855" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key857" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key858" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key860" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key862" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key863" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key864" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key866" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key867" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key869" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key871" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key873" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key875" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key877" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key879" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key881" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key883" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key884" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key886" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key888" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key889" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key890" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key891" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key893" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key894" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key896" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key899" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key900" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key901" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key903" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key904" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key906" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key907" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key908" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key909" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key911" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key912" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key910" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key905" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key902" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key632" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key633" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key634" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key635" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key637" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key639" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key641" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key642" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key643" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key645" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key647" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key648" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key649" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key651" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key653" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key654" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key656" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key657" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key659" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key661" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key662" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key665" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key666" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key667" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key668" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key669" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key670" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key672" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key674" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key675" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key479" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key480" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key481" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key482" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key483" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key485" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key487" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key489" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key491" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key492" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key494" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key496" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key497" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key498" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key500" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key501" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key502" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key503" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key504" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key897" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key895" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key892" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key887" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key885" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key882" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key880" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key878" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key876" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key874" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key872" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key870" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key677" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key678" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key679" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key680" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key681" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key683" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key685" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key965" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key688" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key686" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key684" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key682" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key676" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key673" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key671" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key280" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key282" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key283" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key284" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key281" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key278" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key228" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key256" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key257" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key258" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key259" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key260" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key262" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key264" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key266" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key265" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key263" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key261" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key160" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key156" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key154" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key5" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key76" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key100" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key74" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key203" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key197" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key191" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key188" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key473" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key475" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key478" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key868" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key865" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key861" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key859" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key187" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key118" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key119" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key120" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key121" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key126" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key128" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key898" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key127" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key124" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key856" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key853" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key851" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key849" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key846" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key842" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key839" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key837" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key835" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key828" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key825" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key823" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key239" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key240" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key241" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key243" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key244" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key245" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key246" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key247" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key249" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key250" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key361" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key363" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key540" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key535" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key533" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key532" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key601" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key597" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key593" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key588" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key584" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key580" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key575" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key207" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key205" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key164" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key165" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key166" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key162" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key36" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key34" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key129" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key558" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key559" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key560" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key561" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key562" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key167" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key168" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key169" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key130" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key365" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key664" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key364" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key362" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key360" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key251" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key253" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key254" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key255" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key726" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key723" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key721" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key548" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key131" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key447" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key448" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key450" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key452" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key453" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key454" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key455" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key457" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key459" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key461" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key462" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key460" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key458" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key456" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key444" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key446" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key445" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key443" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key441" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key406" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key407" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key408" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key410" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key411" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key412" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key476" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key474" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key186" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key185" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key183" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key177" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key174" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key16" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key269" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key270" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key272" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key274" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key276" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key277" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key463" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key464" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key465" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key466" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key468" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key469" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key471" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key472" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key470" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key467" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key275" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key285" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key286" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key287" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key288" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key290" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key687" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key689" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key802" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key690" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key691" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key692" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key694" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key695" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key696" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key697" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key699" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key701" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key703" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key705" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key707" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key709" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key711" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key712" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key713" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key715" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key716" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key717" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key714" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key710" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key708" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key706" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key704" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key702" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key700" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key698" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key693" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key963" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key964" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key966" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key968" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key969" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key291" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key292" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key293" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key295" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key297" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key298" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key299" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key300" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key301" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key303" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key305" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key306" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key308" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key307" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key304" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key302" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key296" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key294" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key289" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key273" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key271" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key309" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key310" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key312" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key314" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key315" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key316" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key317" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key318" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key320" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key321" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key322" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key323" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key324" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key325" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key327" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key328" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key329" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key330" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key331" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key333" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key335" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key337" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key338" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key341" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key342" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key343" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key344" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key345" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key346" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key347" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key348" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key350" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key351" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key353" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key354" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key355" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key357" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key358" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key359" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key356" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key352" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key349" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key336" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key334" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key332" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key326" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key319" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key423" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key424" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key426" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key428" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key429" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key430" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key432" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key434" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key436" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key435" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key433" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key431" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key427" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key425" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key313" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key311" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key268" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key83" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key84" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key86" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key90" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key91" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key92" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key94" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key95" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key96" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key93" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key89" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key88" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key87" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key85" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key80" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key38" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key252" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key248" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key625" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key626" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key627" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key628" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key631" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key506" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key508" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key509" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key510" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key512" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key514" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key515" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key516" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key517" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key519" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key520" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key521" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key522" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key523" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key967" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key525" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key527" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key528" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key529" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key530" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key531" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key534" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key536" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key537" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key538" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key539" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key541" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key542" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key543" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key544" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key545" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key546" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key547" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key549" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key551" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key553" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key554" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key663" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key660" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key658" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key46" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key48" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key49" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key50" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key52" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key117" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key123" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key122" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key116" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key53" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key55" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key56" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key57" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key655" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key970" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key972" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key973" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key974" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key976" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key977" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key980" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key982" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key983" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key984" UNIQUE ("slug");
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_slug_key985" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table certificates
-- ----------------------------
CREATE INDEX "certificates_certificate_number" ON "public"."certificates" USING btree (
  "certificate_number" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "certificates_course_id" ON "public"."certificates" USING btree (
  "course_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "certificates_enrollment_id" ON "public"."certificates" USING btree (
  "enrollment_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "certificates_user_id" ON "public"."certificates" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "certificates_user_id_course_id" ON "public"."certificates" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "course_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table certificates
-- ----------------------------
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key32" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key30" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key25" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key23" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key19" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key17" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key15" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key11" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key7" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key4" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key1" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key2" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key3" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key5" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key6" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key8" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key9" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key10" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key12" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key13" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key14" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key16" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key18" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key20" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key21" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key22" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key24" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key26" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key27" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key28" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key29" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key31" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key33" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key34" UNIQUE ("certificate_number");
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_certificate_number_key35" UNIQUE ("certificate_number");

-- ----------------------------
-- Primary Key structure for table certificates
-- ----------------------------
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table comments
-- ----------------------------
CREATE INDEX "comments_course_id" ON "public"."comments" USING btree (
  "course_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "comments_course_id_status_parent_id" ON "public"."comments" USING btree (
  "course_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST,
  "parent_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "comments_created_at" ON "public"."comments" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "comments_parent_id" ON "public"."comments" USING btree (
  "parent_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "comments_status" ON "public"."comments" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "comments_user_id" ON "public"."comments" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table comments
-- ----------------------------
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table contacts
-- ----------------------------
CREATE INDEX "contacts_created_at" ON "public"."contacts" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "contacts_email" ON "public"."contacts" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "contacts_status" ON "public"."contacts" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "contacts_subject" ON "public"."contacts" USING btree (
  "subject" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "contacts_user_id" ON "public"."contacts" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table contacts
-- ----------------------------
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table contents
-- ----------------------------
ALTER TABLE "public"."contents" ADD CONSTRAINT "contents_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table conversations
-- ----------------------------
CREATE INDEX "conversations_last_message_at" ON "public"."conversations" USING btree (
  "last_message_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "conversations_user1_id" ON "public"."conversations" USING btree (
  "user1_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "conversations_user2_id" ON "public"."conversations" USING btree (
  "user2_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "unique_conversation" ON "public"."conversations" USING btree (
  "user1_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "user2_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table conversations
-- ----------------------------
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table courses
-- ----------------------------
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1070" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key742" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key743" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key744" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key745" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key746" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key748" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key750" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key752" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key753" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key754" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key755" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key756" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key757" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key758" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key760" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key761" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key762" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key763" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key765" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key767" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key768" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key769" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key766" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key764" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key759" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key751" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key749" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key747" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key741" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key738" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key736" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key101" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key102" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key103" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key105" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key107" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key108" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key106" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key104" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key100" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key97" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key777" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key775" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key773" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key771" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key29" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key30" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key32" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key33" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key34" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key219" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key54" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key53" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key13" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key302" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key300" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key46" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key47" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key49" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key50" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key798" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key799" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key800" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key802" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key803" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key804" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key801" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key797" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key61" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key192" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key190" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key648" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key643" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key639" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key635" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key630" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key629" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key624" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key619" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key613" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key611" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key606" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key604" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key601" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key596" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key591" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key586" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key584" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key583" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key576" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key571" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key572" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key573" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key574" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key568" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key111" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key112" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key113" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key114" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key116" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key118" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key120" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key121" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1067" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key122" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key124" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key125" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key126" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key128" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key562" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key560" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key436" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key969" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key970" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key972" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key973" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key975" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key976" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key977" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key974" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key971" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key437" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key439" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key440" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key441" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key442" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key443" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key444" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key446" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key448" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key449" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key450" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key452" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key453" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key454" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key456" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key457" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key458" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key460" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key462" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key464" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key465" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key699" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key268" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key266" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key265" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key438" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key435" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key427" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key425" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key140" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key143" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key145" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key146" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key729" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key148" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key149" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key150" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key151" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key152" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key154" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key156" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key158" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key159" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key160" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key244" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key245" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key246" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key247" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key248" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key249" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key250" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key406" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key404" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key402" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key401" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key26" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key6" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key40" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key38" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key36" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key52" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key55" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key57" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key58" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key59" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key56" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key147" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key664" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key665" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key666" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key667" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key669" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key670" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key671" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key672" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key673" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key674" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key675" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key676" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key677" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key668" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key42" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key51" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key44" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key291" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key292" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key293" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key294" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key295" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key296" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key297" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key298" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key299" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key398" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key301" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key303" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key305" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key307" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key308" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key309" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key311" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key313" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key315" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key317" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key318" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key319" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key321" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key322" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key323" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key412" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key413" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key415" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key416" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key418" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key419" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key417" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key414" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key325" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key326" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key327" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key329" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key330" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key331" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key332" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key334" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key336" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key337" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key524" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key536" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key538" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key10" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key8" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key73" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key934" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key935" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key937" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key939" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key940" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key941" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key943" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key944" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key945" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key942" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key938" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key936" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key75" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key74" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key682" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key62" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key63" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key65" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key67" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key69" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key71" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key72" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key70" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key68" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key66" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key64" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key7" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key9" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key11" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key12" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key14" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key16" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key17" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key18" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key224" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key225" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key226" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key227" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key228" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key230" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key231" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key232" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key233" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key234" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key258" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key256" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key161" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key162" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key163" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key165" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key167" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key169" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key171" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key173" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key172" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key235" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key237" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key236" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key229" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key20" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key21" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key23" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key24" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key220" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key222" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key223" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key221" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key25" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key22" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key19" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key15" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key35" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key37" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key39" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key41" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key242" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key240" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key238" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key155" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key153" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key31" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key28" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key389" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key390" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key392" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key393" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key394" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key396" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key399" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key400" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key403" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key405" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key407" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key408" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key410" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key411" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key186" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key184" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key180" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key678" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key176" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key133" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key134" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key135" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key137" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key138" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key139" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key420" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key421" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key422" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key423" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key424" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key426" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key428" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key429" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key430" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key431" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key432" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key433" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key434" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key558" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key559" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key561" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key563" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key564" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key565" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key566" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key567" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key569" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key570" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key575" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key577" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key578" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key579" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key580" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key581" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key582" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key585" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key587" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key588" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key589" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key590" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key592" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key593" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key594" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key595" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key597" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key598" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key599" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key600" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key602" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key603" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key605" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key607" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key608" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key609" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key610" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key612" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key614" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key615" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key616" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key869" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key871" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key872" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key874" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key876" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key877" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key879" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key881" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key882" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key883" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key885" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key887" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key888" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key890" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key891" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key893" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key895" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key896" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key897" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key898" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key900" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key902" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key903" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key904" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key906" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key907" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key908" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key909" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key910" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key912" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key914" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key916" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key917" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key918" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key920" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key921" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key924" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key925" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key927" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key929" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key931" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key932" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key933" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key930" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key928" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key926" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key923" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key80" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key82" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key83" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key85" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key86" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key87" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key262" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key170" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key168" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key166" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key164" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key157" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key239" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key241" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key243" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key218" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key144" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key142" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key141" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key136" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key131" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key129" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key127" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key123" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key119" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key117" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key115" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key92" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key94" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key507" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key508" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key466" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key468" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key470" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key471" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key472" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key474" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1014" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key476" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key679" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key680" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key681" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key683" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key684" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key685" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key686" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key688" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key690" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key691" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key692" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key693" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key689" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key687" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key922" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key919" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key915" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key913" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key911" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key905" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key901" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key899" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key894" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key892" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key889" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key886" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key884" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key880" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key878" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key875" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key873" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key870" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key617" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key618" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key620" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key621" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key622" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key623" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key625" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key626" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key627" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key628" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key631" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key632" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key633" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key634" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key636" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key637" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key638" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key640" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key641" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key642" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key644" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key645" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key646" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key647" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key649" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key651" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key652" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key653" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key655" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key656" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key657" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key660" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key661" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key662" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key663" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key659" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key658" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key654" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key650" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key409" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key191" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key193" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key194" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key195" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key197" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key198" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key200" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key201" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key202" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key203" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key205" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key206" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key207" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key209" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key210" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key211" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key212" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key213" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key215" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key217" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key216" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key214" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key208" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key204" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key324" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key320" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key316" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key314" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key312" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key310" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key306" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key304" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key492" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key488" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key486" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key484" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key477" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key475" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key473" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key469" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key467" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key463" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key461" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key459" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key455" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key451" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key447" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key445" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key89" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key90" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key805" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key807" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key808" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key810" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key811" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key812" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key814" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key815" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key816" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key818" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key819" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key820" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key822" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key823" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key824" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key826" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key828" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key830" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key831" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key832" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key833" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key834" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key836" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key837" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key838" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key839" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key835" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key829" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key827" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key825" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key821" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key817" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key813" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key849" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key851" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key853" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key854" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key855" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key856" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key858" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key859" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key860" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key861" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key864" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key865" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key866" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key867" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key868" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key862" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key857" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key852" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key850" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key809" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key806" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key109" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key110" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key840" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key841" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key844" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key846" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key847" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key848" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key845" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key843" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key252" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key253" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key254" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key255" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key257" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key259" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key260" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key261" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key263" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key264" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key267" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key269" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key550" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key548" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key546" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key542" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key540" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key537" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key525" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key526" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key338" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key339" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key340" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key342" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key344" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key345" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key347" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key348" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key349" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key350" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key352" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key354" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key946" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key948" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key950" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key952" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key954" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key955" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key957" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key960" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key962" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key963" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key965" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key967" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key968" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key966" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key964" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key961" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key959" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key958" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key956" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key953" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key951" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key949" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key947" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key355" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key356" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key357" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key358" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key360" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key361" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key362" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key363" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key365" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key527" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key528" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key529" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key530" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key532" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key863" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key534" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key535" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key533" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key531" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key366" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key368" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key369" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key370" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key371" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key372" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key374" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key376" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key378" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key380" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key382" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key383" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key384" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key385" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key386" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key387" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key388" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key397" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key395" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key391" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key381" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key379" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key377" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key375" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key373" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key842" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key130" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key132" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key174" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key175" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key177" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key178" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key179" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key181" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key182" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key183" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key185" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key270" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key273" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key274" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key275" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key276" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key277" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key279" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key280" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key281" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key282" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key283" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key285" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key286" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key287" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key288" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key290" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key289" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key284" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key278" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key272" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key271" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key695" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key696" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key697" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key698" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key701" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key703" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key704" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key705" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key707" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key709" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key711" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key712" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key713" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key715" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key717" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key718" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key719" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key721" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key722" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key724" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key726" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key727" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key730" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key770" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key772" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key774" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key776" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key778" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key978" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key979" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key980" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key982" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key983" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key984" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key986" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key988" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key989" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key990" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key992" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key993" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key994" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key995" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key997" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key998" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key999" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1002" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1004" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1007" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1009" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1011" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1012" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1015" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1017" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1019" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1021" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1023" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1025" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1027" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1029" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1031" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1033" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1035" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1036" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1038" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1039" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1040" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1041" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1042" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1044" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1045" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1046" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1047" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1049" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1050" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1051" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1053" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1054" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1056" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1057" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1058" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1060" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1061" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1062" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1064" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1065" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1066" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1063" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key48" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key199" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key196" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key478" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key479" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key480" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key481" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key482" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key483" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key485" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key487" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key489" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key490" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key491" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key493" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key495" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key496" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key497" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key498" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key500" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key502" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key504" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key733" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key728" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key725" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key723" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key720" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key716" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key714" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key710" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key708" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key706" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key702" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key700" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key509" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key510" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key512" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key513" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key514" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key516" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key517" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key518" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key520" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key521" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key522" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key523" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key519" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key515" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key511" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key93" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key91" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key88" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key84" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key81" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key2" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key3" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key60" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key795" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key796" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1059" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1055" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1052" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1048" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1043" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1037" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1034" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1032" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1030" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1028" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1026" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1024" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1022" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1020" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1018" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1016" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1013" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key539" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key541" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key543" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key544" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key545" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key694" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key547" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key549" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key551" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key552" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key554" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key556" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key557" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key555" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key553" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key187" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key188" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key189" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key251" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key367" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key364" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key359" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key353" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key351" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key346" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key343" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key341" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key335" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key333" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key328" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key45" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key43" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key76" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key78" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key79" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key77" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1010" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1008" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1005" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1003" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1001" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key4" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key5" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key27" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key95" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key96" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key98" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key99" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key506" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key505" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key503" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key501" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key499" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key494" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1000" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key996" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key991" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key987" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key985" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key981" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key779" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key780" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key782" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key783" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key784" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key785" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key786" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key787" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1006" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key789" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key792" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key793" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key794" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key791" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key790" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key788" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key731" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key732" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key734" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key735" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key737" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key739" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key740" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key781" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1068" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1069" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1071" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1072" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1073" UNIQUE ("slug");
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_slug_key1074" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table courses
-- ----------------------------
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table email_verifications
-- ----------------------------
CREATE INDEX "email_verifications_email" ON "public"."email_verifications" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "email_verifications_expires_at" ON "public"."email_verifications" USING btree (
  "expires_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "email_verifications_is_verified" ON "public"."email_verifications" USING btree (
  "is_verified" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "email_verifications_otp_code" ON "public"."email_verifications" USING btree (
  "otp_code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "email_verifications_user_id" ON "public"."email_verifications" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table email_verifications
-- ----------------------------
ALTER TABLE "public"."email_verifications" ADD CONSTRAINT "email_verifications_user_id_key" UNIQUE ("user_id");

-- ----------------------------
-- Primary Key structure for table email_verifications
-- ----------------------------
ALTER TABLE "public"."email_verifications" ADD CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table enrollments
-- ----------------------------
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table messages
-- ----------------------------
CREATE INDEX "messages_conversation_id" ON "public"."messages" USING btree (
  "conversation_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "messages_created_at" ON "public"."messages" USING btree (
  "created_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "messages_sender_id" ON "public"."messages" USING btree (
  "sender_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table messages
-- ----------------------------
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table password_reset_tokens
-- ----------------------------
CREATE INDEX "password_reset_tokens_expires_at" ON "public"."password_reset_tokens" USING btree (
  "expires_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "password_reset_tokens_token" ON "public"."password_reset_tokens" USING btree (
  "token" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "password_reset_tokens_user_id" ON "public"."password_reset_tokens" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table password_reset_tokens
-- ----------------------------
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key269" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key267" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key263" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key260" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key256" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key254" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key251" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key247" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key243" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key240" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key237" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key236" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key234" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key231" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key230" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key228" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key92" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key93" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key94" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key95" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key97" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key98" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key99" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key102" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key103" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key105" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key107" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key133" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key110" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key206" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key208" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key209" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key211" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key212" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key213" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key215" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key217" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key219" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key221" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key222" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key223" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key225" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key226" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key224" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key220" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key218" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key216" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key214" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key210" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key207" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key112" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key113" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key115" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key117" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key119" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key120" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key121" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key123" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key125" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key127" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key128" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key130" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key131" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key132" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key129" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key126" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key124" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key122" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key118" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key116" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key114" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key111" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key109" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key76" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key75" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key71" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key69" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key67" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key134" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key135" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key136" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key137" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key139" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key142" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key143" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key145" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key146" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key147" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key149" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key150" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key152" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key154" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key156" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key157" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key158" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key159" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key161" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key163" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key164" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key166" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key167" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key168" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key169" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key171" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key172" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key174" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key176" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key178" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key180" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key182" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key184" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key186" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key187" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key188" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key190" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key191" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key194" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key195" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key196" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key197" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key199" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key200" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key202" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key203" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key204" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key205" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key201" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key198" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key193" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key192" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key189" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key185" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key183" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key181" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key179" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key177" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key175" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key173" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key170" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key165" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key162" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key160" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key155" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key153" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key151" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key148" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key144" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key141" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key140" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key138" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key65" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key63" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key61" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key58" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key53" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key49" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key46" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key41" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key39" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key35" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key30" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key28" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key26" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key7" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key9" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key10" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key11" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key12" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key13" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key14" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key16" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key108" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key106" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key104" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key101" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key100" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key96" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key90" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key86" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key84" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key79" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key17" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key18" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key19" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key21" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key23" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key24" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key22" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key20" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key15" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key8" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key6" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key2" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key1" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key3" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key4" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key5" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key25" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key27" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key29" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key31" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key32" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key33" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key34" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key36" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key37" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key38" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key40" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key42" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key43" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key44" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key45" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key47" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key48" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key50" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key51" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key52" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key54" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key55" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key56" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key57" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key59" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key60" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key62" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key64" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key66" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key68" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key70" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key72" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key73" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key74" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key77" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key78" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key80" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key81" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key82" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key83" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key85" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key87" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key88" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key89" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key91" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key227" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key229" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key232" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key233" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key235" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key238" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key239" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key241" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key242" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key244" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key245" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key246" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key248" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key249" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key250" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key252" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key253" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key255" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key257" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key258" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key259" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key261" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key262" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key264" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key265" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key266" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key268" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key270" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key271" UNIQUE ("token");
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_key272" UNIQUE ("token");

-- ----------------------------
-- Primary Key structure for table password_reset_tokens
-- ----------------------------
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table personal_notes
-- ----------------------------
CREATE INDEX "personal_notes_content_id" ON "public"."personal_notes" USING btree (
  "content_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "personal_notes_course_id" ON "public"."personal_notes" USING btree (
  "course_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "personal_notes_user_id" ON "public"."personal_notes" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "personal_notes_user_id_content_id" ON "public"."personal_notes" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "content_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table personal_notes
-- ----------------------------
ALTER TABLE "public"."personal_notes" ADD CONSTRAINT "personal_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table progress
-- ----------------------------
CREATE INDEX "progress_completed_at" ON "public"."progress" USING btree (
  "completed_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "progress_content_id" ON "public"."progress" USING btree (
  "content_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "progress_course_id" ON "public"."progress" USING btree (
  "course_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "progress_enrollment_id" ON "public"."progress" USING btree (
  "enrollment_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE INDEX "progress_progress_percentage" ON "public"."progress" USING btree (
  "progress_percentage" "pg_catalog"."numeric_ops" ASC NULLS LAST
);
CREATE INDEX "progress_started_at" ON "public"."progress" USING btree (
  "started_at" "pg_catalog"."timestamptz_ops" ASC NULLS LAST
);
CREATE INDEX "progress_status" ON "public"."progress" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "progress_user_id" ON "public"."progress" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "progress_user_id_content_id" ON "public"."progress" USING btree (
  "user_id" "pg_catalog"."uuid_ops" ASC NULLS LAST,
  "content_id" "pg_catalog"."uuid_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table progress
-- ----------------------------
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ratings
-- ----------------------------
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1055" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1056" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1057" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1058" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1060" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1061" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1062" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1063" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1065" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1067" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1069" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1070" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1071" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1073" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1074" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1075" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1078" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1079" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1080" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1081" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1082" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1083" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1086" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1087" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1089" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1091" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1093" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1094" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1097" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1099" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1100" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1102" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1104" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1106" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1108" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1110" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1113" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1115" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1117" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1119" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1120" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1121" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key58" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key61" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key63" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key64" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key65" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key105" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1122" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1118" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1116" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1114" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1112" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1111" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1109" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1107" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1105" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1103" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1101" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1098" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1096" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1095" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1092" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1090" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1088" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1085" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1084" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1077" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1076" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1072" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1013" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1014" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1011" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1009" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1003" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1001" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key999" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key995" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key989" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key222" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key224" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key226" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key228" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key229" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key231" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key232" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key234" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key235" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key917" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key918" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key919" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key921" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key922" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key923" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key924" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key925" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key927" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key928" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key929" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key930" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key931" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key932" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key935" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key936" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key937" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key939" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key941" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key942" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key943" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key945" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key947" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key948" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key949" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key976" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key977" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key978" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key980" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key982" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key984" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key985" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key986" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key983" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key981" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key979" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key946" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key944" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key940" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key938" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key934" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key259" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key260" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key261" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key262" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key263" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key309" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key310" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key311" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key313" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key315" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key317" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key319" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key170" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key172" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key174" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key176" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key175" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key173" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key171" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key872" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key873" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key874" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key875" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key871" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key507" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key505" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key54" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key51" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key48" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key892" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key893" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key895" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key896" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key897" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key898" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key900" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key901" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key902" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key904" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key906" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key907" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key908" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key909" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key911" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key914" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1041" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1038" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1035" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1033" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key890" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key891" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key888" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key885" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key883" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key879" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key713" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key704" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key610" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key611" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key613" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key615" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key616" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key617" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key614" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key612" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key468" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key469" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key470" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key472" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key473" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key474" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key321" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key323" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key325" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key327" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key329" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key330" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key331" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key332" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key334" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key335" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key337" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key338" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key339" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key341" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key416" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key418" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1031" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key420" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key422" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key915" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key916" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key913" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key912" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key910" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key905" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key903" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key899" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key894" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key46" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key19" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key17" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key15" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key13" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key12" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key425" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key426" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key427" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key428" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key430" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key431" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key433" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key434" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key435" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key436" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key437" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key438" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key439" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key441" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key443" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key444" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key445" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key446" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key447" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key448" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key449" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key451" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key452" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key453" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key454" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key455" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key456" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key457" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key458" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key459" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key461" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key462" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key463" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key460" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key450" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key442" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key440" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key878" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key683" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key676" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key672" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key621" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key88" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key87" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key84" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key42" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key40" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key38" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key36" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key34" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key31" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key8" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key369" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key370" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key371" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key372" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key374" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key375" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key376" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key377" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key378" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key379" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key373" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key2" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key217" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key218" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key219" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key220" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key359" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key361" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key362" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key364" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key366" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key368" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key367" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key365" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key115" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key116" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key117" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key118" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key120" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key122" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key124" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key125" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key126" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key298" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key299" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key300" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key301" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key303" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key304" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key305" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key306" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key307" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key308" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key106" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key108" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key109" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key111" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key112" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key113" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key114" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key56" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key832" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key833" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key834" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key835" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key837" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key838" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key840" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key842" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key843" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key845" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key951" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key953" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key954" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key957" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key959" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key961" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key962" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key964" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key965" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key967" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key969" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key970" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key973" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key974" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key975" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key972" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key320" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key789" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key790" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key791" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key793" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key795" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key797" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key798" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key799" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key800" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key802" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key803" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key804" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key806" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key807" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key808" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key809" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key811" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key813" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key814" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key815" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key816" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key819" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key820" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key821" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key823" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key825" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key827" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key828" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key829" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key830" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key826" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key824" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key822" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key818" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key495" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key493" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key177" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key155" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key156" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key817" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key812" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key810" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key805" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key492" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key491" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key489" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key166" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key167" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key168" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key169" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key971" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key968" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key966" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key619" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key620" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key622" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key623" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key624" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key625" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key626" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key627" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key628" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key629" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key630" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key632" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key633" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key637" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key638" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key639" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key640" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key642" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key644" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key645" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key646" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key647" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key648" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key651" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key652" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key653" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key654" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key655" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key657" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key658" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key659" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key660" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key661" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key664" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key665" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key666" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key667" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key668" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key963" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key960" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key958" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key956" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key955" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key952" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key950" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key846" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key847" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key848" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key849" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key851" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key852" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key853" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key854" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key855" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key856" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key670" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key671" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key673" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key674" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key675" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key677" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key678" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key679" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key680" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key681" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key682" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key684" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key858" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key859" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key860" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key861" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key862" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key865" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key867" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key868" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key869" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key870" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key866" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key864" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key863" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key857" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key850" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key844" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key841" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key839" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key836" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key831" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1123" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1124" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1125" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1126" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1127" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1129" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1131" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1132" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1133" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1135" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1137" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1139" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1140" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1142" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1143" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1144" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1145" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1147" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1148" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1149" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1150" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1152" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1153" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1154" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1155" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1157" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1158" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1159" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1161" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1162" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1163" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1160" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1156" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1151" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1146" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1141" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1138" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1136" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1134" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1130" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1128" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key69" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key68" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key67" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key62" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key60" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key59" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key57" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key407" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key408" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key410" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key411" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key412" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key409" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key405" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key161" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key159" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key153" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key150" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key147" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key73" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key74" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key72" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key71" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key328" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key326" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key324" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key322" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key318" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key316" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key314" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key312" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key302" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key296" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key291" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key281" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key280" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key278" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key669" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key663" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key662" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key656" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key650" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key649" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key643" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key641" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key636" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key635" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key634" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key631" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key276" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key272" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key480" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key481" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key482" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key484" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key486" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key485" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key513" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key514" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key515" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key516" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key518" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key520" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key519" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key517" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key483" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key342" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key343" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key350" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key351" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key352" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key353" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key354" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key356" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key358" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key357" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key355" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key344" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key345" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key347" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key349" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key348" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key346" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key340" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key385" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key386" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key388" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key390" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key392" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key394" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key396" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key397" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key395" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key393" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key391" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key389" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key387" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key381" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key151" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key152" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key154" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key178" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key180" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key181" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key182" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key184" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key185" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key186" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key188" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key189" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key190" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key192" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key194" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key195" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key196" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key198" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key200" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key201" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key202" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key80" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key79" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key77" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key76" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key464" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key465" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key466" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key606" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key607" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key608" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key609" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key258" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key363" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key778" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key781" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key783" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key784" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key785" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key786" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key787" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key788" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key782" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key780" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key779" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key777" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key770" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key765" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key763" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key755" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key753" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key749" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key747" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key742" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key741" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key738" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key736" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key550" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key551" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key552" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key554" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key556" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key557" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key558" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key560" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key561" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key562" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key564" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key565" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key566" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key567" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key568" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key570" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key572" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key573" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key574" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key575" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key576" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key577" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key579" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key581" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key582" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key583" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key584" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key586" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key588" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key589" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key590" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key591" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key592" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key593" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key594" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key595" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key596" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key598" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key599" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key600" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key601" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key602" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key604" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key605" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key603" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key597" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key587" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key585" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key580" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key578" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key571" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key569" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key563" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key559" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key555" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key553" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key543" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key539" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key47" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key49" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key50" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key52" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key53" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key274" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key275" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key277" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key10" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key30" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key32" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key78" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key81" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key82" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key83" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key85" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key86" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key89" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key90" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key93" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key92" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key91" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key128" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key129" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key130" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key132" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key134" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key136" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key801" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key796" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key794" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key792" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key204" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key205" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key207" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key208" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key210" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key212" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key213" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key214" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key215" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key216" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key211" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key209" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key206" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key203" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key199" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key197" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key193" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key191" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key187" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key183" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key179" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key494" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key496" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key497" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key498" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key499" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key500" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key502" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key504" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key503" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key501" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key157" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key158" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key160" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key162" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key164" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key165" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key487" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key488" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key490" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key137" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key138" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key139" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key140" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key142" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key143" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key144" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key145" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key146" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key141" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key135" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key163" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key398" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key399" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key400" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key401" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key402" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1068" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1066" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1064" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1059" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key705" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key706" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key707" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key708" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key709" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key710" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key711" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key712" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key715" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key716" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key717" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key719" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key720" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key721" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key722" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key724" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key726" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key727" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key728" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key729" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key731" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key732" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key733" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key734" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key735" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key730" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key725" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key723" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key718" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key714" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key432" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key429" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1015" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1016" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1020" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1021" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1022" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1024" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1026" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1028" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1029" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1030" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1027" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1025" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1023" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1019" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1018" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1017" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key506" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key508" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key510" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key512" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key511" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key509" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key476" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key478" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key477" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key475" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key471" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key467" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key75" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key33" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key35" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key37" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key39" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key41" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key14" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key16" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key414" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key415" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key479" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key268" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key266" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key253" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key251" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key249" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key247" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key246" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key239" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key238" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key233" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key230" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key133" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key131" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key127" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key95" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key97" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key99" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key101" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key102" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key104" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key123" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key121" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key119" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key110" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key107" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key55" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key360" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key987" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key988" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key990" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key991" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key992" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key993" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key994" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key996" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key997" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key998" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1000" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1002" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1004" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1005" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1006" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1007" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1008" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1010" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1012" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key403" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key404" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key406" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key424" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key264" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key265" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key267" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key269" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key270" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key271" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key273" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key423" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key421" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key419" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key417" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key413" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key18" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key20" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key21" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key23" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key24" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key27" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key28" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key29" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key26" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key25" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key22" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key43" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key44" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key45" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key540" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key541" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key542" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key544" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key545" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key546" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key547" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key548" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key549" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key737" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key739" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key740" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key743" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key744" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key745" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key746" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key748" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key750" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key751" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key752" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key754" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key756" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key757" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key758" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key759" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key760" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key761" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key762" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key764" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key766" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key767" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key768" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key769" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key771" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key772" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key773" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key774" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key775" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key776" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key933" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key926" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key920" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key236" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key237" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key240" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key241" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key242" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key243" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key244" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key245" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key248" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key250" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key252" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key254" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key255" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key256" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key257" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key698" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key693" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key687" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key876" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key877" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key880" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key881" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key882" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key884" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key886" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key887" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key889" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1032" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1034" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1036" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1037" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1039" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1040" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1054" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1051" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key279" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1043" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key282" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key283" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key284" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key285" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key286" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key287" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key288" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key289" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key290" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key292" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key522" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key524" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key525" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key526" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key527" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key528" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key529" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key530" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key532" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key533" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key534" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key536" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key537" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key538" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key535" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key531" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key336" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key333" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key103" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key100" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key227" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key225" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key223" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key221" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key3" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key4" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key5" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key6" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key7" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key9" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key11" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key98" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key96" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key94" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key66" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key70" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key148" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key149" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key380" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key382" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key383" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key384" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key523" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key521" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key293" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key294" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key295" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key297" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key618" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key685" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key686" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key688" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key689" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key690" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key691" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key692" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key694" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key695" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key696" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key697" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key699" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key700" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key701" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key702" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key703" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1042" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1044" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1045" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1046" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1047" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1048" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1049" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1050" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1052" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1053" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_student_id_key1164" UNIQUE ("student_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key451" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key448" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key15" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key13" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key553" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key555" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key556" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key558" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key559" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key557" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key554" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key12" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1128" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1125" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1121" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key949" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key950" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key951" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key953" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key955" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key957" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key958" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key960" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key962" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1116" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key963" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key964" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key965" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key961" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key579" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key758" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key759" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key761" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key763" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key764" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key766" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key767" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key768" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key770" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key771" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key772" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key773" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key775" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key777" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key779" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key780" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key781" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key782" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key783" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key784" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key785" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key786" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key788" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key959" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key956" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key954" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key952" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key855" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key850" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key846" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key842" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key839" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key833" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key828" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key506" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key502" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key154" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key155" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key221" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key223" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key224" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key222" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key220" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key197" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key199" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key198" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key483" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key481" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key948" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key945" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key941" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key939" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key933" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key931" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key929" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key928" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key925" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key923" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key305" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key306" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key307" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key308" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key309" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key311" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key313" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key387" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key385" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key379" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key282" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key279" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key603" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key143" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key144" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key145" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key148" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key149" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key914" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key912" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key909" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key810" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key806" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key804" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key802" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key799" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key794" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key792" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key787" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key778" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key776" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key774" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key880" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key882" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key883" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key884" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key885" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key887" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key889" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key890" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key891" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key893" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key894" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key895" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key897" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key898" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key899" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key900" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key901" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key902" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key896" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key450" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key452" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key453" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key560" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key561" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key562" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key564" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key566" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key567" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key565" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key563" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key10" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key8" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key276" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key892" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key888" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key886" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key881" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key879" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key769" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key765" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key762" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key760" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key581" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key582" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key580" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key578" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key573" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key571" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key421" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key423" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key440" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key438" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key286" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key196" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key22" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key19" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key7" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key9" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key11" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key14" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key16" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key424" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key425" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key426" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key428" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key429" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1049" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1050" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1052" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1053" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1055" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1057" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1059" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1060" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1058" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1056" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1054" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1051" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key431" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key432" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key430" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key427" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key422" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key104" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key106" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key108" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key109" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key111" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key112" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key113" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key114" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key315" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key395" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key393" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key366" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key367" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key368" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key369" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key370" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key372" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key373" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key374" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key375" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key419" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key377" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key376" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key371" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key226" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key227" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key229" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key416" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key418" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key417" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key415" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key230" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key231" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key232" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key233" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key234" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key235" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key184" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key185" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key187" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key637" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key632" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key630" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key625" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key623" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key620" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key211" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key225" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key681" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key682" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key683" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key684" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key685" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key686" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key687" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key688" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key689" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key690" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key691" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key692" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key693" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key694" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key695" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key696" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key697" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key698" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key701" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key702" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key703" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key705" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key706" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key707" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key708" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key710" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key712" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key713" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key714" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key715" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key717" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key718" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key719" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key720" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key723" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key725" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key726" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key729" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key731" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key733" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key734" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key735" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key737" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key739" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key740" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key741" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key742" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key738" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key736" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key732" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key730" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key728" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key727" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key724" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key722" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key721" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key716" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key711" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key709" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key704" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key700" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key699" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key281" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key475" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key473" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key469" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key465" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key391" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key180" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key78" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key79" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key81" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key208" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key205" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key202" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key67" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key20" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key21" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key23" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key24" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key27" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key29" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key30" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key275" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key277" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key662" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key663" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key665" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key666" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key667" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key668" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key669" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key664" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key660" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key298" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key300" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key301" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key302" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key303" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key304" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key389" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key342" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key343" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key345" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key347" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key348" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key349" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key350" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key351" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key352" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key670" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key672" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key673" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key674" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key676" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key677" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key678" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key679" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key675" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key671" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key354" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key356" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key357" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key359" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key360" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key361" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key362" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key364" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key650" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key460" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key458" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key40" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key32" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key33" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key35" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key37" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key39" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key38" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key36" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key34" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key31" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key28" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key87" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key84" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key80" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key77" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key594" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key588" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key166" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key167" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key168" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key169" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key171" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key173" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key177" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key179" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key312" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key310" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key299" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key294" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key289" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key95" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key97" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key98" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key99" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key101" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key161" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key159" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key44" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key317" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key318" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key319" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key321" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key323" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key322" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key320" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key316" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key115" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key82" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key83" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key85" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key86" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key88" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key89" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key214" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key210" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key250" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key116" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key117" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key118" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key120" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key122" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key124" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key125" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key126" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key128" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key129" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key130" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key132" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key134" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key136" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key137" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key138" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key192" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key190" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key186" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key182" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key178" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key175" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key174" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key59" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key314" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key57" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key45" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key47" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key49" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key50" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key52" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key53" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key55" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key56" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key54" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key51" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key325" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key327" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key328" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key329" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key330" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key331" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key332" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key333" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key334" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key326" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key26" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key172" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key170" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key163" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key2" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key268" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key269" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key271" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key272" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key273" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key270" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key3" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key4" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key5" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key6" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key17" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key176" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key18" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key65" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key66" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key68" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key70" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key72" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key324" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key74" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key76" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key147" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key146" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key141" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key135" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key133" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key131" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key127" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key123" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key121" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key119" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key110" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key967" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key968" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key970" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key972" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key974" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key975" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key976" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key977" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key978" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key980" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key982" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key983" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key985" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key987" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key989" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key990" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key991" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key993" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key995" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key997" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key998" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1000" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1001" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1003" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1005" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1006" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1008" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1009" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1011" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1013" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1014" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1015" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1016" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1018" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1019" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1021" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1022" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1024" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1025" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1026" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1027" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1029" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1030" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1031" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1033" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1035" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1034" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1032" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1028" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1023" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1020" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1017" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1012" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1010" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1007" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1004" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1002" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key999" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key996" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key994" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key992" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key988" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key986" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key151" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key152" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key25" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key139" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key140" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key142" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key251" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key252" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key253" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key254" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key255" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key256" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key257" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key258" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key259" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key260" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key261" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key262" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key263" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key335" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key336" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key337" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key339" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key340" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key341" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key922" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key919" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key917" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key984" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key981" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key979" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key973" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key971" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key969" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key107" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key105" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key103" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key100" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key96" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key94" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key91" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key48" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key46" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key42" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key454" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key455" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key456" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key457" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key459" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key461" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key462" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key463" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key464" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key466" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key467" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key743" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key744" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key745" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key747" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key749" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key750" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key751" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key752" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key754" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key755" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key756" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key966" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key757" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key753" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key748" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key746" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key468" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key470" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key471" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key472" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key474" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key476" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key478" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key479" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key480" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key482" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key484" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key485" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key486" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key488" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key490" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key492" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key493" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key494" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key495" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key496" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key497" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key499" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key501" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key503" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key504" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key505" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key507" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key509" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key510" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key511" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key512" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key513" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key515" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key517" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key519" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key521" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key522" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key523" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key524" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key525" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key526" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key528" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key529" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key530" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key532" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key533" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key536" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key537" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key538" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key540" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key541" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key542" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key543" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key544" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key545" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key546" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key547" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key549" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key551" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key552" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key550" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key548" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key539" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key535" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key240" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key241" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key249" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key242" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key243" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key244" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key236" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key508" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key824" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key825" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key826" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key827" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key829" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key830" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key831" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key832" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key834" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key835" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key836" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key837" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key838" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key840" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key841" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key843" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key844" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key845" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key847" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key848" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key849" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key851" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key852" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key853" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key854" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key856" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key857" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key858" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key860" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key862" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key863" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key864" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key865" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key866" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key868" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key869" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key871" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key872" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key873" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key874" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key876" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1036" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1037" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1038" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1040" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1041" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1042" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1043" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1045" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1046" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1047" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1048" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1044" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1039" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key877" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key878" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key875" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key870" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key278" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key280" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key365" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key363" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key358" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key153" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key150" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key228" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key246" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key248" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key247" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key245" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key212" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1063" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1065" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1066" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1068" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1070" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1072" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1074" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1076" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1078" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1080" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1082" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1084" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1085" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1087" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1088" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1089" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1090" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1091" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1092" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1094" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1095" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1096" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1097" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1098" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1100" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1102" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1104" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1105" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1107" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1108" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1109" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1110" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1112" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1113" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1114" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1115" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1111" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1106" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1103" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1101" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1099" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1093" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1086" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1083" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1081" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1079" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1077" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1075" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1073" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1071" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1069" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1067" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1064" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1062" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key213" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key215" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key216" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key217" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key218" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key219" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key355" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key353" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key680" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key657" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key658" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key659" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key661" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key867" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key861" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key859" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key477" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key71" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key69" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key200" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key75" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key188" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key189" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key191" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key193" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key194" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key195" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key90" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key92" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key93" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key283" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key284" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key285" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key433" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key434" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key435" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key436" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key437" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key439" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key441" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key442" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key443" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key444" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key445" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key446" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key447" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key449" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key41" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key43" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key156" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key157" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key158" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key160" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key162" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key164" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key165" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key274" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key583" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key584" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key585" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key586" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key587" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key589" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key590" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key591" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key592" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key593" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key596" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key597" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key598" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key599" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key600" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key601" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key602" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key201" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key203" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key534" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key531" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key527" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key520" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key518" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key516" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1061" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key604" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key606" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key607" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key608" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key609" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key611" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key612" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key613" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key614" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key615" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key610" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key605" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key514" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key181" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key595" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key64" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key62" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key500" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key498" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key237" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key238" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key239" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key204" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key206" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key207" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key209" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key616" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key617" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key618" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key619" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key621" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key622" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key624" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key626" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key627" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key628" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key629" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key631" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key633" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key634" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key635" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key636" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key639" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key640" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key641" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key642" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key643" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key645" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key646" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key647" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key648" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key649" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key644" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key638" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key73" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key378" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key380" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key381" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key382" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key383" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key384" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key386" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key388" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key390" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key392" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key394" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key396" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key397" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key398" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key399" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key400" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key401" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key402" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key404" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key405" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key406" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key408" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key409" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key412" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key413" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key414" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key411" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key410" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key407" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key403" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key58" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key60" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key61" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key63" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key346" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key344" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key338" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key265" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key267" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key266" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key264" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key102" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key420" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key568" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key569" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key570" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key572" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key574" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key575" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key576" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key577" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key789" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key790" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key791" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key793" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key795" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key796" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key797" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key798" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key800" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key801" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key803" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key805" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key807" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key808" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key809" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key812" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key813" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key814" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key816" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key817" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key819" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key821" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key822" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key823" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key820" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key818" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key183" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key491" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key489" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key487" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key287" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key288" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key290" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key291" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key292" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key293" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key295" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key296" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key297" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key651" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key652" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key653" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key654" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key655" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key656" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key815" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key811" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key903" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key904" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key905" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key906" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key907" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key908" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key910" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key911" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key913" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key915" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key916" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key918" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key920" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key921" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key924" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key926" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key927" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key930" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key932" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key934" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key935" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key936" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key937" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key938" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key940" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key942" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key943" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key944" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key946" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key947" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1117" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1118" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1119" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1120" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1122" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1123" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1124" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1126" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1127" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key1129" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key119" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key115" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key111" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key107" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key103" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key100" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key96" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key91" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key85" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key82" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key80" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key78" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key76" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key74" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key72" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key70" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key68" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key66" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key64" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key61" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key60" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key58" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key56" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key53" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key51" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key49" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key48" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key44" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key39" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key35" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key33" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key29" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key25" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key22" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key19" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key14" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key12" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key9" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key7" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key6" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key4" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key1" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key2" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key3" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key5" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key8" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key10" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key11" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key13" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key15" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key16" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key17" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key18" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key20" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key21" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key23" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key24" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key26" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key27" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key28" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key30" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key31" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key32" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key34" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key36" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key37" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key38" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key40" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key41" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key42" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key43" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key45" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key46" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key47" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key50" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key52" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key54" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key55" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key57" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key59" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key62" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key63" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key65" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key67" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key69" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key71" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key73" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key75" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key77" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key79" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key81" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key83" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key84" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key86" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key87" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key88" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key89" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key90" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key92" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key93" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key94" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key95" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key97" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key98" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key99" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key101" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key102" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key104" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key105" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key106" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key108" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key109" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key110" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key112" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key113" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key114" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key116" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key117" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key118" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key120" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key121" UNIQUE ("google_id");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_google_id_key122" UNIQUE ("google_id");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table ai_interactions
-- ----------------------------
ALTER TABLE "public"."ai_interactions" ADD CONSTRAINT "ai_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table blogs
-- ----------------------------
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table certificates
-- ----------------------------
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table comments
-- ----------------------------
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table contacts
-- ----------------------------
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table contents
-- ----------------------------
ALTER TABLE "public"."contents" ADD CONSTRAINT "contents_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table conversations
-- ----------------------------
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "public"."messages" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table courses
-- ----------------------------
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table email_verifications
-- ----------------------------
ALTER TABLE "public"."email_verifications" ADD CONSTRAINT "email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table enrollments
-- ----------------------------
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table messages
-- ----------------------------
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table password_reset_tokens
-- ----------------------------
ALTER TABLE "public"."password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table personal_notes
-- ----------------------------
ALTER TABLE "public"."personal_notes" ADD CONSTRAINT "personal_notes_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."contents" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."personal_notes" ADD CONSTRAINT "personal_notes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."personal_notes" ADD CONSTRAINT "personal_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table progress
-- ----------------------------
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."contents" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "public"."progress" ADD CONSTRAINT "progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ratings
-- ----------------------------
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE;
