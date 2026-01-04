/**
 * Ví dụ hoàn chỉnh: Producer và Consumer chạy cùng lúc
 * 
 * Chạy: node examples/kafka-complete-example.js
 * 
 * Script này sẽ:
 * 1. Gửi một số messages vào Kafka
 * 2. Đọc và xử lý các messages đó
 */

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'studymate-complete-example',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer({ 
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner // Sử dụng partitioner cũ để tránh warning
});
const consumer = kafka.consumer({ 
  groupId: 'complete-example-group',
  allowAutoTopicCreation: true 
});

const topic = 'example-topic';
let messageCount = 0;
const totalMessages = 5;

async function runExample() {
  try {
    // Kết nối producer và consumer
    await producer.connect();
    await consumer.connect();
    console.log('✅ Đã kết nối với Kafka\n');

    // Subscribe consumer
    await consumer.subscribe({ topic, fromBeginning: false });

    // Bắt đầu consume messages
    const consumePromise = consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        messageCount++;
        console.log(`📥 [${messageCount}/${totalMessages}] Nhận: ${data.message}`);
        
        if (messageCount >= totalMessages) {
          console.log('\n✅ Đã nhận đủ messages!');
          await shutdown();
        }
      }
    });

    // Đợi một chút để consumer sẵn sàng
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Gửi messages
    console.log('📤 Đang gửi messages...\n');
    const messages = [];
    for (let i = 1; i <= totalMessages; i++) {
      messages.push({
        key: `key-${i}`,
        value: JSON.stringify({
          id: i,
          message: `Message số ${i}`,
          timestamp: new Date().toISOString()
        })
      });
    }

    await producer.send({ topic, messages });
    console.log(`✅ Đã gửi ${totalMessages} messages\n`);

    // Đợi consumer xử lý
    await consumePromise;

  } catch (error) {
    console.error('❌ Lỗi:', error);
    await shutdown();
  }
}

async function shutdown() {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log('✅ Đã ngắt kết nối');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi shutdown:', error);
    process.exit(1);
  }
}

// Xử lý Ctrl+C
process.on('SIGINT', shutdown);

if (require.main === module) {
  runExample();
}

module.exports = { runExample };

