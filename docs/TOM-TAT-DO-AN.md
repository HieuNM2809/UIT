# 📝 Tóm Tắt Đồ Án - StudyMate

**Đồ án tốt nghiệp**  
**Trường:** Đại học Công nghệ Thông tin - ĐHQG-HCM  
**Năm học:** 2026-2025  
**Giáo viên hướng dẫn:** ThS. Phạm Thế Sơn

**Nhóm phát triển:**
- Nguyễn Minh Hiếu - MSSV: 24410158
- Lê Anh Kiệt - MSSV: 24410183

---

## 1.1. Lý do chọn đề tài

Ở thời điểm hiện tại, trong bối cảnh công nghệ thông tin phát triển mạnh mẽ và quá trình chuyển đổi số diễn ra trên nhiều ngành nghề khác nhau, ngành giáo dục cũng đang dần phát triển về chuyển đổi số như chúng ta thấy ở một số ứng dụng phổ biến như: Duolingo, Khan Academy, Focus Keeper. Tuy nhiên, các nền tảng ứng dụng hiện tại vẫn còn hạn chế về việc cá nhân hóa nội dung học tập, theo dõi quá trình người học và hỗ trợ người dùng một cách thông minh.

Xuất phát từ nhu cầu đó, với mong muốn phát triển ứng dụng giúp người dùng học tập thông minh cũng như kết hợp nền tảng AI để hỗ trợ và cá nhân hóa trải nghiệm học tập của người dùng, đồ án **StudyMate** được xây dựng. Hệ thống được lấy cảm hứng từ Duolingo với các nguyên tắc gamification, theo dõi tiến độ và trải nghiệm học tập được cá nhân hóa.

## 1.2. Mục tiêu nghiên cứu

Mục tiêu của đề tài "Ứng dụng học tập thông minh sử dụng công nghệ AI để hỗ trợ và cá nhân hóa trải nghiệm học tập" là xây dựng một ứng dụng học tập thông minh với các mục tiêu cụ thể sau:

- **Xây dựng hệ thống quản lý khóa học và nội dung học tập toàn diện**: Phát triển hệ thống cho phép tạo, quản lý và tổ chức khóa học với đa dạng loại nội dung (video, tài liệu, bài tập, quiz). Hệ thống hỗ trợ phân loại theo danh mục, cấp độ và quản lý đa vai trò (sinh viên, giảng viên, quản trị viên).

- **Phát triển hệ thống theo dõi tiến độ học tập chi tiết và thông minh**: Xây dựng hệ thống theo dõi tiến độ học tập theo thời gian thực, lưu trữ vị trí học tập (video position, page number), thống kê thời gian học, số lần thử và điểm số. Hệ thống tự động cập nhật tiến độ khóa học dựa trên việc hoàn thành nội dung.

- **Tích hợp AI Chatbot thông minh để hỗ trợ học tập**: Phát triển trợ lý học tập AI sử dụng OpenAI GPT và Google Gemini với cơ chế fallback tự động. AI chatbot có khả năng hiểu ngữ cảnh người dùng (khóa học hiện tại, tiến độ, lịch sử học tập) để đưa ra hỗ trợ phù hợp.

- **Xây dựng hệ thống gợi ý và lộ trình học tập cá nhân hóa bằng AI**: Phát triển hệ thống phân tích sở thích, năng lực và lịch sử học tập của người dùng để đưa ra gợi ý khóa học phù hợp. Hệ thống có khả năng tạo lộ trình học tập tùy chỉnh dựa trên phong cách học, thời gian học và mục tiêu của từng người học.

- **Phát triển các tính năng tương tác và cộng đồng**: Xây dựng hệ thống chat real-time giữa người dùng, diễn đàn thảo luận, hệ thống bình luận và quản lý blog để tạo môi trường học tập tương tác và cộng đồng.

- **Góp phần vào quá trình chuyển đổi số trong ngành giáo dục**: Phát triển một nền tảng học tập hiện đại, ứng dụng công nghệ tiên tiến (AI, real-time communication, cloud storage) để góp phần thúc đẩy quá trình chuyển đổi số trong giáo dục.

## 1.3. Phạm vi nghiên cứu

Phạm vi nghiên cứu của đề tài tập trung vào việc phân tích và xây dựng một ứng dụng học tập trên nền tảng web, hướng đến đối tượng người học là sinh viên. Đề tài giới hạn trong việc phát triển các chức năng cốt lõi sau:

### Quản lý khóa học và nội dung học tập
- **Quản lý khóa học**: Hệ thống cho phép tạo, chỉnh sửa, xóa và quản lý khóa học với các thông tin như tiêu đề, mô tả, cấp độ, giá, danh mục, giảng viên. Hỗ trợ tìm kiếm, lọc và phân trang khóa học.
- **Quản lý nội dung**: Quản lý đa dạng loại nội dung học tập bao gồm video, tài liệu PDF, bài tập, quiz với các thông tin metadata, thứ tự hiển thị và trạng thái xuất bản.
- **Quản lý danh mục và thẻ**: Hệ thống phân loại khóa học theo danh mục và thẻ để dễ dàng tìm kiếm và lọc.

### Hệ thống đăng ký và theo dõi tiến độ học tập
- **Đăng ký khóa học**: Người dùng có thể đăng ký khóa học, hệ thống quản lý trạng thái đăng ký (pending, active, completed, dropped).
- **Theo dõi tiến độ chi tiết**: Hệ thống theo dõi tiến độ học tập ở cấp độ nội dung với các thông tin: trạng thái (not_started, in_progress, completed, paused, skipped), phần trăm hoàn thành, thời gian học, vị trí cuối cùng (cho video), số lần thử, điểm số.
- **Thống kê và báo cáo**: Dashboard cung cấp thống kê tổng quan về số khóa học đã đăng ký, đang học, đã hoàn thành, thời gian học tập tổng cộng và tiến độ trung bình.

### Hệ thống AI thông minh
- **AI Chatbot**: Trợ lý học tập AI tích hợp OpenAI GPT và Google Gemini, có khả năng hiểu ngữ cảnh người dùng và đưa ra hỗ trợ phù hợp. Hệ thống lưu trữ lịch sử tương tác AI để cải thiện trải nghiệm.
- **Hệ thống gợi ý khóa học**: Phân tích lịch sử học tập, sở thích và năng lực của người dùng để đưa ra gợi ý khóa học phù hợp với thuật toán scoring dựa trên rating, popularity, level và price.
- **Tạo lộ trình học tập tùy chỉnh**: Sử dụng AI để tạo lộ trình học tập chi tiết dựa trên phong cách học (videos, exercises, reading), thời gian học tốt nhất, mức độ kỹ năng và chủ đề quan tâm.

### Quản lý người dùng và xác thực
- **Hệ thống xác thực**: Hỗ trợ đăng ký, đăng nhập với JWT authentication, OAuth (Google), xác thực email và reset mật khẩu.
- **Quản lý đa vai trò**: Hỗ trợ ba vai trò chính (student, instructor, admin) với các quyền hạn và chức năng phù hợp. Hệ thống quản lý profile, avatar và thông tin cá nhân.

### Tính năng tương tác và cộng đồng
- **Chat real-time**: Hệ thống chat trực tuyến giữa người dùng sử dụng Socket.IO, hỗ trợ tìm kiếm người dùng và quản lý cuộc trò chuyện.
- **Diễn đàn và bình luận**: Hệ thống blog, bình luận và thảo luận để tạo môi trường học tập tương tác.
- **Ghi chú cá nhân**: Người dùng có thể tạo và quản lý ghi chú cá nhân cho từng khóa học hoặc nội dung.

### Quản lý file và lưu trữ
- **Hệ thống quản lý file**: Tích hợp MinIO cho lưu trữ file, hỗ trợ upload, download và quản lý file đa phương tiện.
- **Chứng chỉ**: Hệ thống tự động tạo và cấp chứng chỉ khi người dùng hoàn thành khóa học.

### Giám sát và logging
- **Hệ thống logging**: Sử dụng Winston Logger kết hợp với Elasticsearch/Kibana để ghi log và giám sát hệ thống, hỗ trợ truy vết lỗi và phân tích hiệu suất.

## 1.4. Phương pháp nghiên cứu đề tài

### Kiến trúc và mô hình phát triển

Đề tài sử dụng mô hình **MVC (Model-View-Controller)** trong phát triển ứng dụng web để tách biệt logic nghiệp vụ, giao diện người dùng và quản lý dữ liệu. Cấu trúc dự án được tổ chức rõ ràng với:
- **Routes**: Định nghĩa các endpoint và áp dụng validation middleware (express-validator)
- **Controllers**: Xử lý logic nghiệp vụ, gọi models/services và render views hoặc trả về JSON
- **Models**: Định nghĩa cấu trúc dữ liệu và quan hệ giữa các bảng, sử dụng Sequelize ORM
- **Services**: Xử lý các dịch vụ bên ngoài như AI, email, file storage

### Công nghệ Backend

- **Node.js + Express.js**: Nền tảng phát triển backend với Express.js framework, hỗ trợ middleware cho authentication, validation, error handling, rate limiting
- **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ chính, lưu trữ toàn bộ dữ liệu của hệ thống với các ràng buộc toàn vẹn dữ liệu (foreign keys, constraints)
- **Sequelize ORM**: Object-Relational Mapping để tương tác với database, hỗ trợ migrations, associations và transactions
- **Redis**: Sử dụng cho caching dữ liệu thường xuyên truy cập (gợi ý khóa học, thống kê) và quản lý session để cải thiện hiệu suất
- **JWT + Passport.js**: Hệ thống xác thực sử dụng JSON Web Token và Passport.js với các strategies: Local, JWT, Google OAuth

### Công nghệ Frontend

- **EJS Template Engine**: Template engine phía server để render HTML động, hỗ trợ partials và layouts
- **Tailwind CSS**: Framework CSS utility-first để xây dựng giao diện responsive, tối ưu cho mọi thiết bị
- **Vanilla JavaScript (ES6+)**: Sử dụng JavaScript thuần với các tính năng hiện đại như async/await, fetch API, modules
- **Socket.IO Client**: Thư viện client để kết nối với WebSocket server cho tính năng chat real-time

### Công nghệ AI và Dịch vụ bên ngoài

- **OpenAI GPT-3.5/4**: Tích hợp OpenAI API cho AI chatbot và các tính năng AI khác, sử dụng custom prompt engineering để tối ưu hóa phản hồi
- **Google Gemini**: Tích hợp Google Generative AI như một dịch vụ fallback khi OpenAI không khả dụng, đảm bảo tính liên tục của dịch vụ
- **AI Service Layer**: Xây dựng lớp dịch vụ AI với khả năng tự động chuyển đổi giữa các provider, caching responses và quản lý context người dùng

### Công nghệ Lưu trữ và File

- **MinIO**: Object storage service cho việc lưu trữ file đa phương tiện (video, tài liệu, hình ảnh), hỗ trợ upload, download và quản lý bucket
- **Multer**: Middleware xử lý multipart/form-data cho việc upload file
- **Sharp**: Thư viện xử lý hình ảnh để resize, optimize và convert format

### Công nghệ Real-time và Communication

- **Socket.IO**: Framework WebSocket cho tính năng chat real-time giữa người dùng, hỗ trợ rooms, namespaces và event-based communication
- **Express Session**: Quản lý session với Redis store để đảm bảo tính nhất quán trong môi trường distributed

### Công nghệ Logging và Giám sát

- **Winston Logger**: Thư viện logging mạnh mẽ với nhiều transports (console, file, Elasticsearch)
- **Elasticsearch + Kibana**: Tích hợp Elasticsearch để lưu trữ logs và Kibana để visualize và phân tích logs, hỗ trợ truy vết lỗi và monitoring hiệu suất
- **Prometheus + Grafana**: Hệ thống metrics và monitoring (được đề xuất trong kiến trúc)

### DevOps và Infrastructure

- **Docker & Docker Compose**: Containerization cho database (PostgreSQL, Redis) và các services, đảm bảo môi trường phát triển nhất quán
- **PM2**: Process manager cho Node.js trong production, hỗ trợ cluster mode, auto-restart và monitoring

### Phương pháp khảo sát và đánh giá

Đề tài đã tiến hành khảo sát người dùng về các vấn đề liên quan đến việc học tập trực tuyến, lộ trình học và theo dõi tiến độ. Các vấn đề thường gặp được xác định bao gồm:
- Người dùng khó kiểm tra và đánh giá quá trình học tập của mình một cách chi tiết
- Thiếu công cụ hỗ trợ tìm kiếm lộ trình học phù hợp với năng lực và sở thích
- Thiếu sự cá nhân hóa trong trải nghiệm học tập, nội dung không thích ứng với từng người học
- Khó khăn trong việc nhận được hỗ trợ tức thời khi gặp vấn đề trong quá trình học

Những phát hiện này đã được sử dụng để thiết kế và phát triển các tính năng của hệ thống, đảm bảo sản phẩm đáp ứng đúng nhu cầu thực tế của người dùng.

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
