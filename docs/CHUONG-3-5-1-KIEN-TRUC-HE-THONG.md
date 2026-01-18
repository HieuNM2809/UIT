# 3.5.1. Kiến trúc hệ thống

Hệ thống StudyMate được tổ chức theo mô hình **MVC (Model-View-Controller)** - một mô hình kiến trúc phần mềm phổ biến giúp tách biệt logic nghiệp vụ, giao diện người dùng và quản lý dữ liệu, từ đó tăng tính bảo trì, khả năng mở rộng và khả năng tái sử dụng code.

## Cấu trúc các thành phần chính:

### **View (Giao diện người dùng)**
View chứa các file giao diện ứng dụng, được tổ chức trong thư mục `/views`:
- **`/views/pages`**: Chứa các template trang đầy đủ (EJS templates) như trang chủ, danh sách khóa học, trang học, dashboard, v.v.
- **`/views/partials`**: Chứa các component có thể tái sử dụng như header, footer, sidebar, form components
- **Template Engine**: Sử dụng EJS (Embedded JavaScript) để render HTML động với dữ liệu từ controller
- **Styling**: Sử dụng Tailwind CSS framework kết hợp với custom CSS trong `/public/css`
- **Client-side Scripts**: JavaScript thuần (Vanilla JS) trong `/public/js` để xử lý tương tác phía client

### **Controller (Điều khiển logic nghiệp vụ)**
Controller đóng vai trò nhận yêu cầu từ người dùng, xử lý logic nghiệp vụ và trả về kết quả, được tổ chức trong thư mục `/controllers`:
- **Xử lý Request/Response**: Nhận HTTP request từ routes, xử lý dữ liệu đầu vào, và trả về response (HTML hoặc JSON)
- **Logic nghiệp vụ**: Thực hiện các thao tác như xác thực, phân quyền, xử lý dữ liệu, tính toán
- **Tương tác với Model và Service**: Gọi các phương thức từ Models để truy vấn database, hoặc sử dụng Services cho các dịch vụ bên ngoài (AI, Email, File Storage)
- **Render View hoặc trả về JSON**: Render EJS templates với dữ liệu hoặc trả về JSON cho API endpoints
- **Xử lý lỗi**: Bắt và xử lý các lỗi, hiển thị thông báo lỗi thân thiện cho người dùng
- **Phân loại**: Các controller được tổ chức theo chức năng (authController, courseController, chatController) và theo vai trò (`/controllers/admin` cho các controller quản trị)

### **Model (Quản lý dữ liệu và logic nghiệp vụ)**
Model quản lý dữ liệu và logic nghiệp vụ liên quan đến dữ liệu, được tổ chức trong thư mục `/models`:
- **Định nghĩa cấu trúc dữ liệu**: Sử dụng Sequelize ORM để định nghĩa các model tương ứng với các bảng trong database PostgreSQL
- **Quan hệ giữa các bảng**: Định nghĩa các associations (hasMany, belongsTo, hasOne) giữa các model
- **Logic nghiệp vụ cấp model**: Chứa các phương thức business logic như `validatePassword()`, `incrementCourseCount()`, `calculateProgress()`
- **Truy vấn database**: Cung cấp các phương thức để thực hiện CRUD operations (Create, Read, Update, Delete) và các truy vấn phức tạp
- **Validation**: Định nghĩa các ràng buộc và validation rules cho dữ liệu
- **Hooks**: Sử dụng Sequelize hooks (beforeCreate, afterUpdate, etc.) để thực hiện các thao tác tự động

## Các thành phần hỗ trợ:

### **Routes (Định tuyến)**
Được tổ chức trong thư mục `/routes`:
- **Định nghĩa URL patterns**: Map các HTTP methods (GET, POST, PUT, DELETE) với các URL paths
- **Áp dụng Middleware**: Validation middleware (express-validator), authentication middleware, error handling middleware
- **Ủy quyền cho Controller**: Routes chỉ định nghĩa endpoints và delegate logic cho controllers (thin layer, không chứa business logic)

### **Middleware (Phần mềm trung gian)**
Được tổ chức trong thư mục `/middleware`:
- **Authentication**: Xác thực người dùng (JWT, Session, Passport.js)
- **Authorization**: Kiểm tra quyền truy cập (role-based access control)
- **Validation**: Validate dữ liệu đầu vào (express-validator)
- **Error Handling**: Xử lý lỗi tập trung
- **Logging**: Ghi log hoạt động và lỗi (Winston Logger → Elasticsearch/Kibana)

### **Services (Dịch vụ)**
Được tổ chức trong thư mục `/services`:
- **AI Service**: Tích hợp với OpenAI GPT và Google Gemini
- **Email Service**: Gửi email (xác thực, thông báo, reset password)
- **MinIO Service**: Quản lý file storage (upload, download, delete)
- **Payment Service**: Tích hợp thanh toán (VietQR)
- **Certificate Service**: Tạo chứng chỉ PDF khi hoàn thành khóa học

## Luồng xử lý yêu cầu:

1. **Client** gửi HTTP request đến một URL
2. **Route** nhận request, áp dụng middleware (validation, authentication), và gọi controller method tương ứng
3. **Controller** xử lý request:
   - Gọi **Model** để truy vấn/cập nhật database
   - Gọi **Service** cho các dịch vụ bên ngoài (nếu cần)
   - Xử lý logic nghiệp vụ
4. **Controller** trả về response:
   - Render **View** (EJS template) với dữ liệu → HTML response
   - Hoặc trả về JSON cho API endpoints
5. **Client** nhận và hiển thị kết quả

Kiến trúc MVC này giúp hệ thống có cấu trúc rõ ràng, dễ bảo trì, mở rộng và kiểm thử, đồng thời tách biệt các mối quan tâm (separation of concerns) một cách hiệu quả.

---

**🏛️ Trường Đại học Công nghệ Thông tin**  
**🌍 Đại học Quốc gia TP. Hồ Chí Minh**
