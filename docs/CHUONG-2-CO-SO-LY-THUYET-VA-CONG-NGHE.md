# Chương 2. CƠ SỞ LÍ THUYẾT VÀ CÔNG NGHỆ

## 2.1. Node.js

### 2.1.1. Giới thiệu về Node.js

Node.js là môi trường runtime mã nguồn mở được xây dựng trên JavaScript Engine V8 của Google Chrome, cho phép chạy JavaScript ở phía server. Node.js sử dụng mô hình event-driven, non-blocking I/O, giúp xử lý nhiều kết nối đồng thời một cách hiệu quả.

### 2.1.2. Mục đích sử dụng

Trong đồ án StudyMate, Node.js được sử dụng làm nền tảng runtime cho toàn bộ hệ thống backend, xây dựng RESTful API, xử lý real-time communication với Socket.IO, tích hợp các dịch vụ bên ngoài (OpenAI, Google Gemini, MinIO), và xử lý file upload, image processing.

### 2.1.3. Đặc điểm nổi bật

- **Non-blocking I/O**: Xử lý hàng nghìn kết nối đồng thời mà không bị chặn
- **NPM Ecosystem**: Hệ sinh thái thư viện phong phú với hàng triệu package
- **JavaScript Everywhere**: Sử dụng JavaScript cho cả frontend và backend
- **Event-driven Architecture**: Phù hợp cho ứng dụng real-time
- **Hiệu suất cao**: V8 engine được tối ưu hóa cho I/O-intensive applications

## 2.2. Express.js

### 2.2.1. Giới thiệu về Express.js

Express.js là framework web nhỏ gọn, linh hoạt cho Node.js, cung cấp các công cụ mạnh mẽ để xây dựng ứng dụng web và API. Express.js là framework phổ biến nhất trong hệ sinh thái Node.js với các tính năng routing, middleware, và template engines.

### 2.2.2. Mục đích sử dụng

Trong đồ án StudyMate, Express.js được sử dụng để định nghĩa routes và xử lý HTTP requests, tích hợp middleware (authentication, validation, logging), render EJS templates, phục vụ static files, và quản lý session với Redis.

### 2.2.3. Đặc điểm nổi bật

- **Minimal và Flexible**: Cung cấp tính năng tối thiểu nhưng mạnh mẽ, linh hoạt
- **Middleware Architecture**: Xử lý request qua nhiều lớp middleware
- **Routing System**: Hệ thống routing linh hoạt với parameters và query strings
- **High Performance**: Kiến trúc nhẹ, tối ưu cho Node.js
- **Rich Ecosystem**: Hệ sinh thái middleware phong phú

## 2.3. PostgreSQL

### 2.3.1. Giới thiệu về PostgreSQL

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mã nguồn mở, mạnh mẽ và tiên tiến. PostgreSQL hỗ trợ ACID compliance, transactions, foreign keys, và nhiều kiểu dữ liệu phong phú bao gồm JSON, JSONB, arrays.

### 2.3.2. Mục đích sử dụng

Trong đồ án StudyMate, PostgreSQL được sử dụng làm cơ sở dữ liệu chính để lưu trữ dữ liệu người dùng, khóa học, nội dung học tập, tiến độ học tập, tương tác giữa người dùng, và lịch sử tương tác AI.

### 2.3.3. Đặc điểm nổi bật

- **ACID Compliance**: Đảm bảo tính toàn vẹn dữ liệu
- **JSON Support**: Hỗ trợ JSON và JSONB cho dữ liệu linh hoạt
- **Foreign Keys và Constraints**: Ràng buộc toàn vẹn dữ liệu mạnh mẽ
- **Extensibility**: Cho phép mở rộng với extensions và stored procedures
- **High Performance**: Indexing, query optimization, parallel execution

## 2.4. Sequelize ORM

### 2.4.1. Giới thiệu về Sequelize

Sequelize là Object-Relational Mapping (ORM) mạnh mẽ cho Node.js, hỗ trợ PostgreSQL, MySQL, MariaDB, SQLite, và Microsoft SQL Server. Sequelize cung cấp cách tiếp cận hướng đối tượng để tương tác với database.

### 2.4.2. Mục đích sử dụng

Trong đồ án StudyMate, Sequelize được sử dụng để định nghĩa models (User, Course, Content, Enrollment, Progress), quản lý associations giữa các bảng, thực hiện database migrations, xây dựng queries an toàn, và quản lý transactions.

### 2.4.3. Đặc điểm nổi bật

- **Type Safety**: Type checking và validation tự động
- **Eager Loading**: Tải dữ liệu liên quan trong một query
- **Hooks và Lifecycle**: Thực thi logic tùy chỉnh tại các điểm trong lifecycle
- **Query Interface**: API linh hoạt cho queries phức tạp
- **Multi-database Support**: Hỗ trợ nhiều loại database

## 2.5. Redis

### 2.5.1. Giới thiệu về Redis

Redis (Remote Dictionary Server) là in-memory data structure store, được sử dụng như database, cache, và message broker. Redis lưu trữ dữ liệu trong memory, cho phép truy cập với tốc độ cực nhanh.

### 2.5.2. Mục đích sử dụng

Trong đồ án StudyMate, Redis được sử dụng làm session store cho Express.js, cache dữ liệu thường xuyên truy cập (gợi ý khóa học, thống kê), và lưu trữ thông tin rate limiting để ngăn chặn abuse.

### 2.5.3. Đặc điểm nổi bật

- **In-Memory Storage**: Truy cập dữ liệu với độ trễ cực thấp (microseconds)
- **Persistence Options**: Hỗ trợ RDB snapshots và AOF
- **Data Structures**: Hỗ trợ nhiều kiểu dữ liệu (strings, hashes, lists, sets)
- **Pub/Sub**: Hỗ trợ publish/subscribe pattern
- **Atomic Operations**: Đảm bảo tính nhất quán dữ liệu

## 2.6. EJS

### 2.6.1. Giới thiệu về EJS

EJS (Embedded JavaScript) là template engine đơn giản và mạnh mẽ cho Node.js, cho phép tạo HTML động bằng cách nhúng JavaScript code vào template. EJS cung cấp cú pháp quen thuộc cho những người đã quen với JavaScript.

### 2.6.2. Mục đích sử dụng

Trong đồ án StudyMate, EJS được sử dụng để render HTML từ server, tái sử dụng components với partials và layouts, hiển thị dữ liệu động từ database, và thực hiện conditional rendering.

### 2.6.3. Đặc điểm nổi bật

- **Simple Syntax**: Cú pháp đơn giản, dễ học
- **Fast Rendering**: Hiệu suất render cao
- **Flexible**: Cho phép nhúng JavaScript trực tiếp
- **No Learning Curve**: Cú pháp quen thuộc với JavaScript developers

## 2.7. Tailwind CSS

### 2.7.1. Giới thiệu về Tailwind CSS

Tailwind CSS là utility-first CSS framework, cung cấp các class CSS tiện ích để xây dựng giao diện người dùng nhanh chóng. Tailwind sử dụng approach utility-first, cho phép xây dựng giao diện mà không cần viết CSS tùy chỉnh.

### 2.7.2. Mục đích sử dụng

Trong đồ án StudyMate, Tailwind CSS được sử dụng để xây dựng giao diện nhanh chóng với utility classes, tạo responsive design với mobile-first approach, và đảm bảo tính nhất quán trong design system.

### 2.7.3. Đặc điểm nổi bật

- **Utility-First**: Xây dựng giao diện nhanh chóng với utility classes
- **Small Bundle Size**: PurgeCSS loại bỏ class không sử dụng
- **Responsive by Default**: Mobile-first approach
- **Highly Customizable**: Tùy chỉnh theme, colors, spacing qua config

## 2.8. Socket.IO

### 2.8.1. Giới thiệu về Socket.IO

Socket.IO là thư viện JavaScript cho real-time web applications, cho phép giao tiếp hai chiều giữa client và server. Socket.IO được xây dựng trên WebSocket protocol với các tính năng bổ sung như automatic reconnection và room support.

### 2.8.2. Mục đích sử dụng

Trong đồ án StudyMate, Socket.IO được sử dụng để xây dựng tính năng chat real-time giữa người dùng, gửi notifications real-time, theo dõi trạng thái online/offline, và cập nhật dữ liệu real-time.

### 2.8.3. Đặc điểm nổi bật

- **Bidirectional Communication**: Giao tiếp hai chiều giữa client và server
- **Automatic Reconnection**: Tự động reconnect khi mất kết nối
- **Room Support**: Tổ chức clients vào các nhóm
- **Fallback Options**: Tự động fallback nếu WebSocket không khả dụng
- **Event-based API**: API dễ sử dụng và linh hoạt

## 2.9. OpenAI GPT

### 2.9.1. Giới thiệu về OpenAI GPT

OpenAI GPT (Generative Pre-trained Transformer) là mô hình ngôn ngữ lớn sử dụng kiến trúc Transformer để hiểu và tạo ra văn bản giống con người. GPT-3.5 và GPT-4 có khả năng hiểu ngữ cảnh, trả lời câu hỏi, và thực hiện nhiều tác vụ ngôn ngữ phức tạp.

### 2.9.2. Mục đích sử dụng

Trong đồ án StudyMate, OpenAI GPT được sử dụng để xây dựng trợ lý học tập AI, trả lời câu hỏi và giải thích khái niệm, tạo nội dung học tập, và cung cấp hỗ trợ học tập thông minh dựa trên ngữ cảnh người dùng.

### 2.9.3. Đặc điểm nổi bật

- **Natural Language Understanding**: Hiểu ngôn ngữ tự nhiên tốt
- **Context Awareness**: Nhớ và sử dụng ngữ cảnh từ các tin nhắn trước
- **Multilingual Support**: Hỗ trợ nhiều ngôn ngữ, bao gồm tiếng Việt
- **Flexible API**: Nhiều tùy chọn để tùy chỉnh behavior

## 2.10. Google Gemini

### 2.10.1. Giới thiệu về Google Gemini

Google Gemini là mô hình AI đa phương thức (multimodal) của Google, có khả năng xử lý và hiểu nhiều loại dữ liệu đầu vào bao gồm văn bản, hình ảnh, video, và âm thanh. Gemini được thiết kế để cạnh tranh với GPT-4.

### 2.10.2. Mục đích sử dụng

Trong đồ án StudyMate, Google Gemini được sử dụng như fallback option khi OpenAI API không khả dụng, đảm bảo tính liên tục của dịch vụ AI, và cung cấp sự đa dạng trong phản hồi.

### 2.10.3. Đặc điểm nổi bật

- **Multimodal Capabilities**: Xử lý nhiều loại dữ liệu đầu vào
- **High Performance**: Thời gian phản hồi nhanh
- **Cost Effective**: Giá cả cạnh tranh
- **Easy Integration**: SDK dễ sử dụng cho Node.js

## 2.11. MinIO

### 2.11.1. Giới thiệu về MinIO

MinIO là object storage server tương thích với Amazon S3 API, được thiết kế để lưu trữ và quản lý dữ liệu không cấu trúc như hình ảnh, video, tài liệu. MinIO là mã nguồn mở, hiệu suất cao, và có thể chạy trên bất kỳ infrastructure nào.

### 2.11.2. Mục đích sử dụng

Trong đồ án StudyMate, MinIO được sử dụng để lưu trữ video bài giảng, tài liệu PDF, hình ảnh khóa học và avatar người dùng, file đính kèm trong tin nhắn và blog, với khả năng upload và download hiệu suất cao.

### 2.11.3. Đặc điểm nổi bật

- **S3 Compatible**: Tương thích 100% với Amazon S3 API
- **High Performance**: Xử lý hàng nghìn request đồng thời
- **Distributed Storage**: Hỗ trợ distributed mode cho cluster
- **Easy Deployment**: Deploy dễ dàng với Docker
- **Security**: Hỗ trợ encryption at rest và in transit

## 2.12. Winston

### 2.12.1. Giới thiệu về Winston

Winston là thư viện logging phổ biến cho Node.js, cung cấp các tính năng logging mạnh mẽ và linh hoạt. Winston hỗ trợ nhiều log levels, multiple transports (console, file, database, HTTP), và formatting tùy chỉnh.

### 2.12.2. Mục đích sử dụng

Trong đồ án StudyMate, Winston được sử dụng để ghi log tất cả hoạt động của ứng dụng (API requests, database queries, AI interactions, errors), với structured JSON format và multiple transports (console, file, Elasticsearch).

### 2.12.3. Đặc điểm nổi bật

- **Multiple Log Levels**: Filter và quản lý log dựa trên mức độ quan trọng
- **Flexible Transports**: Gửi log đến nhiều destinations
- **Formatting Options**: Tùy chỉnh format của log messages
- **High Performance**: Tối ưu hóa, không ảnh hưởng đến performance

## 2.13. Elasticsearch

### 2.13.1. Giới thiệu về Elasticsearch

Elasticsearch là search engine và analytics engine phân tán, được xây dựng trên Apache Lucene. Elasticsearch được thiết kế để lưu trữ, tìm kiếm, và phân tích dữ liệu lớn một cách nhanh chóng và real-time.

### 2.13.2. Mục đích sử dụng

Trong đồ án StudyMate, Elasticsearch được sử dụng như centralized log storage, lưu trữ tất cả logs từ ứng dụng để query và phân tích, tìm kiếm nguyên nhân lỗi, và monitor ứng dụng real-time.

### 2.13.3. Đặc điểm nổi bật

- **Full-text Search**: Tìm kiếm trong logs mạnh mẽ
- **Scalability**: Scale horizontally, xử lý lượng dữ liệu lớn
- **Real-time**: Real-time search và analytics
- **RESTful API**: Dễ dàng tích hợp với các ứng dụng khác

## 2.14. Kibana

### 2.14.1. Giới thiệu về Kibana

Kibana là công cụ visualization và exploration cho Elasticsearch, cho phép tạo dashboards, charts, và graphs từ dữ liệu trong Elasticsearch. Kibana thường được sử dụng cùng với Elasticsearch để tạo ra giải pháp logging và monitoring hoàn chỉnh.

### 2.14.2. Mục đích sử dụng

Trong đồ án StudyMate, Kibana được sử dụng để visualize logs từ Elasticsearch, tạo dashboards để monitor hệ thống, phân tích patterns trong logs, và troubleshoot các vấn đề.

### 2.14.3. Đặc điểm nổi bật

- **Data Visualization**: Tạo dashboards và charts từ dữ liệu
- **Real-time Updates**: Cập nhật dữ liệu real-time
- **User-friendly Interface**: Giao diện trực quan, dễ sử dụng
- **Powerful Querying**: Tìm kiếm và filter dữ liệu mạnh mẽ

## 2.15. Docker

### 2.15.1. Giới thiệu về Docker

Docker là platform để phát triển, vận chuyển, và chạy ứng dụng sử dụng containerization. Docker cho phép đóng gói ứng dụng và dependencies vào container, đảm bảo ứng dụng chạy nhất quán trên bất kỳ môi trường nào.

### 2.15.2. Mục đích sử dụng

Trong đồ án StudyMate, Docker được sử dụng để chạy PostgreSQL, Redis, Elasticsearch, MinIO, và các services khác trong containers, đảm bảo môi trường development nhất quán và dễ dàng setup với Docker Compose.

### 2.15.3. Đặc điểm nổi bật

- **Containerization**: Đóng gói ứng dụng và dependencies
- **Isolation**: Mỗi container chạy trong môi trường isolated
- **Resource Efficiency**: Sử dụng ít tài nguyên hơn virtual machines
- **Easy Deployment**: Deploy ứng dụng dễ dàng với Docker images

## 2.16. JWT

### 2.16.1. Giới thiệu về JWT

JWT (JSON Web Token) là tiêu chuẩn mở để truyền thông tin an toàn giữa các parties dưới dạng JSON object. JWT được sử dụng rộng rãi cho authentication và authorization trong web applications.

### 2.16.2. Mục đích sử dụng

Trong đồ án StudyMate, JWT được sử dụng cho stateless authentication, bảo vệ API endpoints, và token-based security cho RESTful API, không cần lưu trữ session trên server.

### 2.16.3. Đặc điểm nổi bật

- **Stateless**: Không cần lưu trữ session trên server
- **Self-contained**: Token chứa tất cả thông tin cần thiết
- **Secure**: Sử dụng signature để đảm bảo token không bị tampered
- **Cross-domain**: Có thể sử dụng cho cross-domain authentication

## 2.17. Passport.js

### 2.17.1. Giới thiệu về Passport.js

Passport.js là authentication middleware cho Node.js, cực kỳ linh hoạt và modular. Passport.js hỗ trợ hơn 500 authentication strategies, bao gồm username/password, OAuth, OpenID.

### 2.17.2. Mục đích sử dụng

Trong đồ án StudyMate, Passport.js được sử dụng với Local Strategy (username/password), JWT Strategy (token-based authentication), và Google OAuth Strategy (đăng nhập bằng Google), tích hợp như middleware trong Express.js.

### 2.17.3. Đặc điểm nổi bật

- **Modular Design**: Sử dụng chỉ những strategies cần thiết
- **Strategy Pattern**: Dễ dàng thêm hoặc thay đổi authentication methods
- **Flexible**: Không áp đặt assumptions về database hoặc user model
- **Wide Support**: Hỗ trợ hơn 500 authentication strategies

## 2.18. Prometheus

### 2.18.1. Giới thiệu về Prometheus

Prometheus là hệ thống monitoring và alerting mã nguồn mở, được thiết kế để thu thập và lưu trữ metrics theo time-series. Prometheus sử dụng pull model để thu thập metrics từ các targets và cung cấp query language mạnh mẽ (PromQL).

### 2.18.2. Mục đích sử dụng

Trong đồ án StudyMate, Prometheus được sử dụng để thu thập metrics về hiệu suất ứng dụng (response time, request rate, error rate), monitor health của các services (PostgreSQL, Redis, Elasticsearch, MinIO), và lưu trữ metrics trong 30 ngày để phân tích xu hướng. Prometheus được cấu hình với retention time 30 ngày và tích hợp với Grafana để visualize metrics.

### 2.18.3. Đặc điểm nổi bật

- **Time-series Database**: Lưu trữ metrics theo time-series
- **Pull Model**: Thu thập metrics bằng cách pull từ targets
- **PromQL**: Query language mạnh mẽ cho metrics
- **Service Discovery**: Tự động phát hiện targets
- **Alerting**: Hỗ trợ alerting rules

## 2.19. Grafana

### 2.19.1. Giới thiệu về Grafana

Grafana là platform mã nguồn mở để visualization và analytics, cho phép tạo dashboards, charts, và alerts từ nhiều nguồn dữ liệu khác nhau. Grafana thường được sử dụng cùng với Prometheus để visualize metrics.

### 2.19.2. Mục đích sử dụng

Trong đồ án StudyMate, Grafana được sử dụng để tạo dashboards visualize metrics từ Prometheus, monitor hiệu suất hệ thống real-time, và tạo alerts khi có vấn đề. Grafana được cấu hình với Prometheus làm data source chính, cho phép tạo các dashboard tùy chỉnh để theo dõi performance của ứng dụng, database, và các services.

### 2.19.3. Đặc điểm nổi bật

- **Rich Visualizations**: Nhiều loại charts và graphs
- **Multiple Data Sources**: Kết nối với nhiều nguồn dữ liệu
- **Real-time Dashboards**: Cập nhật dữ liệu real-time
- **Alerting**: Gửi alerts qua nhiều channels
- **User-friendly**: Giao diện trực quan, dễ sử dụng

## 2.20. SonarQube

### 2.20.1. Giới thiệu về SonarQube

SonarQube là platform mã nguồn mở để quản lý chất lượng code, tự động phát hiện bugs, vulnerabilities, và code smells trong codebase. SonarQube hỗ trợ nhiều ngôn ngữ lập trình và tích hợp với CI/CD pipelines.

### 2.20.2. Mục đích sử dụng

Trong đồ án StudyMate, SonarQube được sử dụng để phân tích code quality, phát hiện security vulnerabilities, kiểm tra code smells và technical debt, và đảm bảo code tuân thủ coding standards.

### 2.20.3. Đặc điểm nổi bật

- **Code Quality Analysis**: Phân tích chất lượng code tự động
- **Security Scanning**: Phát hiện security vulnerabilities
- **Multi-language Support**: Hỗ trợ nhiều ngôn ngữ lập trình
- **CI/CD Integration**: Tích hợp với CI/CD pipelines
- **Technical Debt Tracking**: Theo dõi technical debt

## 2.21. Apache Kafka

### 2.21.1. Giới thiệu về Apache Kafka

Apache Kafka là distributed streaming platform được thiết kế để xử lý streams dữ liệu real-time. Kafka hoạt động như một message broker, cho phép publish và subscribe streams of records, lưu trữ streams một cách fault-tolerant.

### 2.21.2. Mục đích sử dụng

Trong đồ án StudyMate, Kafka được sử dụng cho event streaming và message queuing, xử lý các events như user activities, course enrollments, progress updates, và notifications một cách asynchronous và scalable. Kafka được cấu hình với Zookeeper để quản lý cluster coordination, và tích hợp với Kafka UI để quản lý và monitor topics, consumers, và producers.

### 2.21.3. Đặc điểm nổi bật

- **High Throughput**: Xử lý hàng triệu messages mỗi giây
- **Fault Tolerance**: Replication và persistence đảm bảo không mất dữ liệu
- **Scalability**: Scale horizontally bằng cách thêm brokers
- **Real-time Processing**: Xử lý streams dữ liệu real-time
- **Durability**: Lưu trữ messages với retention policy

## 2.22. Zookeeper

### 2.22.1. Giới thiệu về Zookeeper

Apache Zookeeper là centralized service để duy trì configuration information, naming, và cung cấp distributed synchronization. Zookeeper được sử dụng như một dependency cho Kafka để quản lý cluster coordination và configuration.

### 2.22.2. Mục đích sử dụng

Trong đồ án StudyMate, Zookeeper được sử dụng như một dependency cho Kafka, quản lý cluster coordination, leader election, và configuration management cho Kafka brokers.

### 2.22.3. Đặc điểm nổi bật

- **Centralized Configuration**: Quản lý configuration tập trung
- **Distributed Coordination**: Điều phối các services trong cluster
- **High Availability**: Replication đảm bảo tính sẵn sàng cao
- **Consistent Ordering**: Đảm bảo thứ tự nhất quán của operations

## 2.23. HashiCorp Vault

### 2.23.1. Giới thiệu về HashiCorp Vault

HashiCorp Vault là tool để quản lý secrets và bảo vệ dữ liệu nhạy cảm như API keys, passwords, certificates. Vault cung cấp giao diện thống nhất để quản lý secrets với encryption, access control, và audit logging.

### 2.23.2. Mục đích sử dụng

Trong đồ án StudyMate, Vault được sử dụng để lưu trữ và quản lý secrets một cách an toàn như API keys (OpenAI, Gemini), database passwords, JWT secrets, và các thông tin nhạy cảm khác, với encryption và access control. Vault được cấu hình ở dev mode với root token để quản lý secrets tập trung, đảm bảo không lộ thông tin nhạy cảm trong code hoặc environment variables.

### 2.23.3. Đặc điểm nổi bật

- **Secret Management**: Quản lý secrets tập trung và an toàn
- **Encryption**: Encrypt secrets at rest và in transit
- **Access Control**: Fine-grained access control cho secrets
- **Audit Logging**: Ghi log tất cả truy cập secrets
- **Dynamic Secrets**: Tạo secrets động với TTL

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
