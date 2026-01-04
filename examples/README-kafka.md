# Ví dụ Kafka Producer và Consumer

Các ví dụ này minh họa cách sử dụng Kafka để gửi và nhận messages trong Node.js.

## Yêu cầu

1. **Kafka đang chạy** (qua Docker Compose):
   ```bash
   docker-compose up -d zookeeper kafka
   ```

2. **Đã cài đặt kafkajs**:
   ```bash
   npm install kafkajs
   ```

## Các ví dụ

### 1. Producer Example (`kafka-producer-example.js`)

Gửi messages vào Kafka topic.

```bash
node examples/kafka-producer-example.js
```

**Chức năng:**
- Kết nối với Kafka broker
- Gửi message đơn lẻ
- Gửi batch messages
- Hiển thị partition và offset

### 2. Consumer Example (`kafka-consumer-example.js`)

Nhận và xử lý messages từ Kafka topic.

```bash
node examples/kafka-consumer-example.js
```

**Chức năng:**
- Subscribe vào topic
- Xử lý messages real-time
- Hiển thị thông tin message (topic, partition, offset, key, value)
- Chạy liên tục (nhấn Ctrl+C để dừng)

### 3. Complete Example (`kafka-complete-example.js`)

Producer và Consumer chạy cùng lúc.

```bash
node examples/kafka-complete-example.js
```

**Chức năng:**
- Gửi messages
- Đồng thời nhận và xử lý messages
- Tự động dừng sau khi xử lý xong

## Cách sử dụng

### Bước 1: Khởi động Kafka

```bash
# Khởi động Zookeeper và Kafka
docker-compose up -d zookeeper kafka

# Kiểm tra Kafka đã sẵn sàng
docker-compose ps
```

### Bước 2: Chạy Producer (Terminal 1)

```bash
node examples/kafka-producer-example.js
```

Output:
```
✅ Producer đã kết nối với Kafka
📤 Message đã được gửi thành công!
Topic: test-topic
Partition: 0
Offset: 0
```

### Bước 3: Chạy Consumer (Terminal 2)

```bash
node examples/kafka-consumer-example.js
```

Output:
```
✅ Consumer đã kết nối với Kafka
📥 Đang lắng nghe messages từ topic: test-topic
📨 Nhận được message:
  Topic: test-topic
  Partition: 0
  Offset: 0
  Value: { id: 1, message: 'Xin chào từ Kafka Producer!' }
```

## Cấu trúc Message

```javascript
{
  key: 'message-1',        // Optional: dùng để partition
  value: JSON.stringify({  // Nội dung message (phải là string)
    id: 1,
    message: 'Hello',
    timestamp: '2026-01-04T...',
    data: { ... }
  })
}
```

## Kafka Topics

- **test-topic**: Topic mặc định cho các ví dụ
- **example-topic**: Topic cho complete example

Topics sẽ được tự động tạo nếu chưa tồn tại (`allowAutoTopicCreation: true`).

## Consumer Groups

- **test-consumer-group**: Consumer group cho consumer example
- **complete-example-group**: Consumer group cho complete example

**Lưu ý:** Messages chỉ được xử lý một lần bởi mỗi consumer group.

## Xem Messages trong Kafka UI

Truy cập: http://localhost:8080

- Xem topics
- Xem messages
- Xem consumer groups
- Monitor Kafka cluster

## Troubleshooting

### Lỗi: "Connection refused"
- Kiểm tra Kafka đã chạy: `docker-compose ps`
- Kiểm tra port 9092: `netstat -an | findstr 9092`

### Lỗi: "Topic not found"
- Topics sẽ tự động tạo nếu `allowAutoTopicCreation: true`
- Hoặc tạo topic thủ công qua Kafka UI

### Consumer không nhận messages
- Kiểm tra `fromBeginning: false` (chỉ đọc messages mới)
- Đổi `fromBeginning: true` để đọc từ đầu
- Kiểm tra consumer group ID (mỗi group chỉ đọc một lần)

## Best Practices

1. **Error Handling**: Luôn wrap trong try-catch
2. **Graceful Shutdown**: Xử lý SIGINT để disconnect đúng cách
3. **Message Format**: Sử dụng JSON cho value
4. **Consumer Groups**: Mỗi service nên có group ID riêng
5. **Partitioning**: Sử dụng key để phân phối messages đều

## 4. Multi-Worker Example

### Producer (`kafka-multi-worker-producer.js`)

Gửi nhiều messages để các workers xử lý.

```bash
node examples/kafka-multi-worker-producer.js
```

### Workers (`kafka-multi-worker.js`)

Chạy nhiều workers cùng lúc để xử lý messages (load balancing).

**Terminal 1:**
```bash
node examples/kafka-multi-worker.js worker-1
```

**Terminal 2:**
```bash
node examples/kafka-multi-worker.js worker-2
```

**Terminal 3:**
```bash
node examples/kafka-multi-worker.js worker-3
```

**Kết quả:**
- Kafka tự động phân phối messages cho các workers
- Mỗi worker chỉ xử lý một phần messages
- Tăng throughput và khả năng scale

### Demo tự động (`kafka-multi-worker-demo.js`)

Chạy producer + nhiều workers tự động.

```bash
node examples/kafka-multi-worker-demo.js 3
```

## Load Balancing với Consumer Groups

### Cách hoạt động:

1. **Cùng Consumer Group**: Tất cả workers dùng cùng `groupId`
2. **Tự động phân phối**: Kafka phân phối messages đều cho các workers
3. **Mỗi message chỉ xử lý 1 lần**: Mỗi message chỉ được một worker xử lý
4. **Scale out**: Thêm workers = tăng throughput

### Ví dụ:

```
Topic: worker-tasks (3 partitions)
Messages: 15

Worker 1 (group: task-workers-group) → Xử lý ~5 messages
Worker 2 (group: task-workers-group) → Xử lý ~5 messages  
Worker 3 (group: task-workers-group) → Xử lý ~5 messages
```

### Lưu ý:

- **Số workers ≤ Số partitions**: Nếu có 3 partitions, chỉ nên có tối đa 3 workers để tận dụng tối đa
- **Mỗi partition = 1 worker**: Một partition chỉ được assign cho 1 worker trong cùng group
- **Rebalancing**: Khi thêm/bớt workers, Kafka sẽ rebalance partitions

## Ứng dụng thực tế

Các ví dụ này có thể được áp dụng cho:
- Email campaigns (như đã implement)
- Notification system
- Event logging
- Task queue
- Real-time data processing
- Background job processing
- Distributed computing

