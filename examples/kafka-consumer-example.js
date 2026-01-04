/**
 * Ví dụ Kafka Consumer - Nhận và xử lý messages từ Kafka topic
 * 
 * Chạy: node examples/kafka-consumer-example.js
 * 
 * Consumer sẽ chạy liên tục và xử lý messages mới
 * Nhấn Ctrl+C để dừng
 */

const { Kafka } = require('kafkajs');

// Cấu hình Kafka
const kafka = new Kafka({
  clientId: 'studymate-consumer-example',
  brokers: ['localhost:9092'], // Kafka broker từ docker-compose
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

// Tạo consumer
const consumer = kafka.consumer({
  groupId: 'test-consumer-group', // Consumer group ID
  allowAutoTopicCreation: true
});

async function consumeMessages() {
  try {
    // Kết nối consumer
    await consumer.connect();
    console.log('✅ Consumer đã kết nối với Kafka');

    // Subscribe vào topic
    const topic = 'test-topic';
    await consumer.subscribe({
      topic: topic,
      fromBeginning: false // true = đọc từ đầu, false = chỉ đọc messages mới
    });

    console.log(`📥 Đang lắng nghe messages từ topic: ${topic}`);
    console.log('Nhấn Ctrl+C để dừng...\n');

    // Xử lý messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Parse message value
          const messageValue = JSON.parse(message.value.toString());
          
          console.log('📨 Nhận được message:');
          console.log('  Topic:', topic);
          console.log('  Partition:', partition);
          console.log('  Offset:', message.offset);
          console.log('  Key:', message.key?.toString() || 'null');
          console.log('  Value:', messageValue);
          console.log('  Timestamp:', new Date(parseInt(message.timestamp)).toLocaleString('vi-VN'));
          console.log('---\n');

          // Xử lý message ở đây
          await processMessage(messageValue);

        } catch (error) {
          console.error('❌ Lỗi khi xử lý message:', error);
          // Không throw error để tiếp tục xử lý messages khác
        }
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi consume messages:', error);
    process.exit(1);
  }
}

// Hàm xử lý message
async function processMessage(messageData) {
  // Ví dụ: xử lý message
  console.log(`🔄 Đang xử lý message ID: ${messageData.id}`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log(`✅ Đã xử lý xong message ID: ${messageData.id}\n`);
}

// Xử lý graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Đang ngắt kết nối consumer...');
  try {
    await consumer.disconnect();
    console.log('✅ Consumer đã ngắt kết nối');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi ngắt kết nối:', error);
    process.exit(1);
  }
});

// Chạy consumer
if (require.main === module) {
  consumeMessages().catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  });
}

module.exports = { consumeMessages };

