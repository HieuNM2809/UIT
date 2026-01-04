/**
 * Ví dụ Kafka Producer - Gửi message vào Kafka topic
 * 
 * Chạy: node examples/kafka-producer-example.js
 */

const { Kafka, Partitioners } = require('kafkajs');

// Cấu hình Kafka
const kafka = new Kafka({
  clientId: 'studymate-producer-example',
  brokers: ['localhost:9092'], // Kafka broker từ docker-compose
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

// Tạo producer
const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner // Sử dụng partitioner cũ để tránh warning
});

async function sendMessage() {
  try {
    // Kết nối producer
    await producer.connect();
    console.log('✅ Producer đã kết nối với Kafka');

    // Gửi message vào topic
    const topic = 'test-topic';
    const message = {
      key: 'message-1', // Optional: key để partition
      value: JSON.stringify({
        id: 1,
        message: 'Xin chào từ Kafka Producer!',
        timestamp: new Date().toISOString(),
        data: {
          user: 'admin',
          action: 'test'
        }
      })
    };

    const result = await producer.send({
      topic: topic,
      messages: [message]
    });

    console.log('📤 Message đã được gửi thành công!');
    console.log('Topic:', topic);
    console.log('Partition:', result[0].partition);
    console.log('Offset:', result[0].offset || 'N/A');
    console.log('Message:', JSON.parse(message.value));

    // Gửi nhiều messages cùng lúc
    const messages = [
      {
        key: 'message-2',
        value: JSON.stringify({
          id: 2,
          message: 'Message thứ hai',
          timestamp: new Date().toISOString()
        })
      },
      {
        key: 'message-3',
        value: JSON.stringify({
          id: 3,
          message: 'Message thứ ba',
          timestamp: new Date().toISOString()
        })
      }
    ];

    const batchResult = await producer.send({
      topic: topic,
      messages: messages
    });

    console.log('\n📤 Đã gửi batch messages:', batchResult.length);
    batchResult.forEach((result, index) => {
      console.log(`  Message ${index + 1}: Partition ${result.partition}, Offset ${result.offset || 'N/A'}`);
    });

    // Ngắt kết nối
    await producer.disconnect();
    console.log('\n✅ Producer đã ngắt kết nối');

  } catch (error) {
    console.error('❌ Lỗi khi gửi message:', error);
    process.exit(1);
  }
}

// Chạy ví dụ
if (require.main === module) {
  sendMessage()
    .then(() => {
      console.log('\n✨ Hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { sendMessage };

