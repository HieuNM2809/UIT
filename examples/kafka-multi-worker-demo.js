/**
 * Demo tự động: Producer + Nhiều Workers
 * 
 * Chạy: node examples/kafka-multi-worker-demo.js [num-workers]
 * 
 * Script này sẽ:
 * 1. Tạo N workers (mặc định 3)
 * 2. Gửi messages vào topic
 * 3. Các workers sẽ tự động phân phối và xử lý messages
 * 4. Hiển thị thống kê
 */

const { Kafka, Partitioners } = require('kafkajs');
const { spawn } = require('child_process');

const numWorkers = parseInt(process.argv[2]) || 3;
const topic = 'worker-tasks';
const totalMessages = 15;

const kafka = new Kafka({
  clientId: 'studymate-demo',
  brokers: ['localhost:9092']
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner
});

async function runDemo() {
  try {
    console.log('🚀 Bắt đầu demo Multi-Worker\n');
    console.log(`📊 Cấu hình:`);
    console.log(`   - Số workers: ${numWorkers}`);
    console.log(`   - Số messages: ${totalMessages}`);
    console.log(`   - Topic: ${topic}\n`);

    // Khởi động workers
    console.log('👷 Đang khởi động workers...\n');
    const workers = [];
    for (let i = 1; i <= numWorkers; i++) {
      const worker = spawn('node', ['examples/kafka-multi-worker.js', `worker-${i}`], {
        stdio: 'inherit',
        shell: true
      });
      workers.push(worker);
      await new Promise(resolve => setTimeout(resolve, 500)); // Đợi worker khởi động
    }

    console.log(`✅ Đã khởi động ${numWorkers} workers\n`);

    // Đợi workers sẵn sàng
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Kết nối producer
    await producer.connect();
    console.log('✅ Producer đã kết nối\n');

    // Gửi messages
    console.log(`📤 Đang gửi ${totalMessages} messages...\n`);
    const messages = [];
    for (let i = 1; i <= totalMessages; i++) {
      messages.push({
        key: `task-${i}`,
        value: JSON.stringify({
          taskId: i,
          taskType: ['email', 'notification', 'report', 'backup'][i % 4],
          message: `Task số ${i}`,
          priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
          timestamp: new Date().toISOString(),
          estimatedDuration: Math.floor(Math.random() * 3000) + 500
        })
      });
    }

    await producer.send({ topic, messages });
    console.log(`✅ Đã gửi ${totalMessages} messages\n`);

    console.log('⏳ Đang chờ workers xử lý...');
    console.log('Nhấn Ctrl+C để dừng tất cả workers\n');

    // Đợi workers xử lý
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 giây

    // Cleanup
    console.log('\n🛑 Đang dừng workers...');
    workers.forEach(worker => worker.kill());
    await producer.disconnect();
    console.log('✅ Demo hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

// Xử lý Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Đang dừng demo...');
  process.exit(0);
});

if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };

