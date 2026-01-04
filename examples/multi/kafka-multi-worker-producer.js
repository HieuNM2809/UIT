/**
 * Ví dụ Producer - Gửi nhiều messages cho nhiều workers xử lý
 * 
 * Chạy: node examples/kafka-multi-worker-producer.js
 * 
 * Producer này sẽ gửi nhiều messages vào topic để các workers xử lý
 */

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'studymate-multi-worker-producer',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner
});

const topic = 'worker-tasks';
const totalMessages = 20; // Số lượng messages để gửi

async function sendMessages() {
  try {
    await producer.connect();
    console.log('✅ Producer đã kết nối với Kafka\n');

    console.log(`📤 Đang gửi ${totalMessages} messages vào topic "${topic}"...\n`);

    const messages = [];
    for (let i = 1; i <= totalMessages; i++) {
      messages.push({
        key: `task-${i}`, // Key để phân phối đều vào các partitions
        value: JSON.stringify({
          taskId: i,
          taskType: ['email', 'notification', 'report', 'backup'][i % 4],
          message: `Task số ${i} cần xử lý`,
          priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
          timestamp: new Date().toISOString(),
          estimatedDuration: Math.floor(Math.random() * 5000) + 1000 // 1-6 giây
        })
      });
    }

    // Gửi tất cả messages
    const result = await producer.send({
      topic: topic,
      messages: messages
    });

    console.log(`✅ Đã gửi ${result.length} batch(es) messages thành công!`);
    
    // Hiển thị thống kê
    const partitionStats = {};
    result.forEach(batch => {
      batch.forEach(msg => {
        const partition = msg.partition;
        partitionStats[partition] = (partitionStats[partition] || 0) + 1;
      });
    });

    console.log('\n📊 Phân phối messages theo partition:');
    Object.keys(partitionStats).sort().forEach(partition => {
      console.log(`  Partition ${partition}: ${partitionStats[partition]} messages`);
    });

    await producer.disconnect();
    console.log('\n✅ Producer đã ngắt kết nối');
    console.log('\n💡 Bây giờ bạn có thể chạy nhiều workers để xử lý các messages này!');
    console.log('   Chạy: node examples/kafka-multi-worker.js (trong nhiều terminals)');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  sendMessages()
    .then(() => {
      console.log('\n✨ Hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { sendMessages };

