/**
 * Ví dụ Multi-Worker - Nhiều workers cùng xử lý messages từ một topic
 * 
 * Chạy: node examples/kafka-multi-worker.js [worker-id]
 * 
 * Ví dụ:
 *   Terminal 1: node examples/kafka-multi-worker.js worker-1
 *   Terminal 2: node examples/kafka-multi-worker.js worker-2
 *   Terminal 3: node examples/kafka-multi-worker.js worker-3
 * 
 * Tất cả workers sẽ cùng subscribe vào một consumer group,
 * Kafka sẽ tự động phân phối messages cho các workers (load balancing)
 */

const { Kafka } = require('kafkajs');

// Lấy worker ID từ command line argument hoặc dùng default
const workerId = process.argv[2] || `worker-${process.pid}`;
const topic = 'worker-tasks';
const consumerGroupId = 'task-workers-group'; // Tất cả workers dùng cùng group ID

const kafka = new Kafka({
  clientId: `studymate-worker-${workerId}`,
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const consumer = kafka.consumer({
  groupId: consumerGroupId, // Cùng group ID = load balancing
  allowAutoTopicCreation: true
});

let processedCount = 0;
let startTime = Date.now();

async function startWorker() {
  try {
    await consumer.connect();
    console.log(`✅ Worker "${workerId}" đã kết nối với Kafka`);
    console.log(`📋 Consumer Group: ${consumerGroupId}`);
    console.log(`📥 Topic: ${topic}\n`);

    // Subscribe vào topic
    await consumer.subscribe({
      topic: topic,
      fromBeginning: false // Chỉ xử lý messages mới
    });

    console.log(`🔄 Worker "${workerId}" đang chờ tasks...`);
    console.log('Nhấn Ctrl+C để dừng worker\n');

    // Xử lý messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const task = JSON.parse(message.value.toString());
          
          console.log(`\n[${workerId}] 📨 Nhận task:`);
          console.log(`  Task ID: ${task.taskId}`);
          console.log(`  Type: ${task.taskType}`);
          console.log(`  Priority: ${task.priority}`);
          console.log(`  Partition: ${partition}, Offset: ${message.offset}`);

          // Xử lý task (simulate work)
          await processTask(workerId, task);

          processedCount++;
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`  ✅ [${workerId}] Đã xử lý ${processedCount} tasks (${elapsed}s)`);

        } catch (error) {
          console.error(`❌ [${workerId}] Lỗi khi xử lý message:`, error);
          // Không throw để tiếp tục xử lý messages khác
        }
      }
    });

  } catch (error) {
    console.error(`❌ [${workerId}] Lỗi:`, error);
    process.exit(1);
  }
}

// Hàm xử lý task (simulate công việc)
async function processTask(workerId, task) {
  const startTime = Date.now();
  
  // Simulate processing time dựa trên task type
  let processingTime = task.estimatedDuration || 1000;
  
  // High priority tasks xử lý nhanh hơn
  if (task.priority === 'high') {
    processingTime = processingTime * 0.5;
  } else if (task.priority === 'low') {
    processingTime = processingTime * 1.5;
  }

  // Simulate work
  await new Promise(resolve => setTimeout(resolve, processingTime));

  const duration = Date.now() - startTime;
  console.log(`  ⏱️  [${workerId}] Xử lý task ${task.taskId} mất ${duration}ms`);

  // Simulate các loại xử lý khác nhau
  switch (task.taskType) {
    case 'email':
      console.log(`  📧 [${workerId}] Đã gửi email cho task ${task.taskId}`);
      break;
    case 'notification':
      console.log(`  🔔 [${workerId}] Đã gửi notification cho task ${task.taskId}`);
      break;
    case 'report':
      console.log(`  📊 [${workerId}] Đã tạo report cho task ${task.taskId}`);
      break;
    case 'backup':
      console.log(`  💾 [${workerId}] Đã backup cho task ${task.taskId}`);
      break;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log(`\n\n🛑 [${workerId}] Đang ngắt kết nối...`);
  console.log(`📊 [${workerId}] Tổng số tasks đã xử lý: ${processedCount}`);
  try {
    await consumer.disconnect();
    console.log(`✅ [${workerId}] Đã ngắt kết nối`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ [${workerId}] Lỗi khi ngắt kết nối:`, error);
    process.exit(1);
  }
});

// Chạy worker
if (require.main === module) {
  startWorker().catch((error) => {
    console.error(`❌ [${workerId}] Lỗi:`, error);
    process.exit(1);
  });
}

module.exports = { startWorker };

