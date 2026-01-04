/**
 * Ví dụ đơn giản: Kafka phân chia messages như thế nào
 * 
 * Chạy: node examples/kafka-partitioning-simple.js
 */

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'partitioning-simple',
  brokers: ['localhost:9092']
});

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  createPartitioner: Partitioners.LegacyPartitioner
});

async function simpleDemo() {
  try {
    await producer.connect();
    console.log('✅ Đã kết nối với Kafka\n');

    const topic = 'simple-partitioning';

    // ============================================
    // VÍ DỤ 1: Cùng KEY → Cùng PARTITION
    // ============================================
    console.log('📌 VÍ DỤ 1: Cùng KEY → Cùng PARTITION\n');

    const messages1 = [
      { key: 'user-123', value: 'Email 1 cho user-123' },
      { key: 'user-456', value: 'Email 1 cho user-456' },
      { key: 'user-123', value: 'Email 2 cho user-123' }, // Cùng key với message đầu
      { key: 'user-123', value: 'Email 3 cho user-123' }, // Cùng key với message đầu
      { key: 'user-456', value: 'Email 2 cho user-456' }, // Cùng key với message thứ 2
    ];

    console.log('Gửi messages:');
    messages1.forEach((msg, i) => {
      console.log(`  ${i + 1}. Key: "${msg.key}" → "${msg.value}"`);
    });

    const result1 = await producer.send({
      topic,
      messages: messages1.map(m => ({ key: m.key, value: JSON.stringify(m) }))
    });

    console.log('\nKết quả phân chia:');
    const keyPartitionMap = {};
    result1.forEach(batch => {
      batch.forEach((msg, idx) => {
        const key = messages1[idx].key;
        const partition = msg.partition;
        if (!keyPartitionMap[key]) {
          keyPartitionMap[key] = [];
        }
        keyPartitionMap[key].push(partition);
      });
    });

    Object.keys(keyPartitionMap).forEach(key => {
      const partitions = [...new Set(keyPartitionMap[key])];
      console.log(`  Key "${key}": Partition ${partitions.join(', ')}`);
      if (partitions.length === 1) {
        console.log(`    ✅ Tất cả messages với key này đều vào partition ${partitions[0]}`);
      }
    });

    // ============================================
    // VÍ DỤ 2: Không có KEY → Round-robin
    // ============================================
    console.log('\n\n📌 VÍ DỤ 2: Không có KEY → Round-robin\n');

    const messages2 = [
      { value: 'Message 1 (no key)' },
      { value: 'Message 2 (no key)' },
      { value: 'Message 3 (no key)' },
      { value: 'Message 4 (no key)' },
      { value: 'Message 5 (no key)' },
    ];

    console.log('Gửi messages KHÔNG có key:');
    messages2.forEach((msg, i) => {
      console.log(`  ${i + 1}. "${msg.value}"`);
    });

    const result2 = await producer.send({
      topic: `${topic}-no-key`,
      messages: messages2.map(m => ({ value: JSON.stringify(m) }))
    });

    console.log('\nKết quả phân chia (round-robin):');
    result2.forEach(batch => {
      batch.forEach((msg, idx) => {
        console.log(`  "${messages2[idx].value}": Partition ${msg.partition}`);
      });
    });

    // ============================================
    // VÍ DỤ 3: Hash function
    // ============================================
    console.log('\n\n📌 VÍ DỤ 3: Hash function quyết định partition\n');

    console.log('Công thức: partition = hash(key) % numPartitions\n');

    const testKeys = ['key-1', 'key-2', 'key-3', 'key-4', 'key-5', 'key-6', 'key-7', 'key-8'];

    console.log('Test với các keys khác nhau:');
    testKeys.forEach(key => console.log(`  - ${key}`));

    const result3 = await producer.send({
      topic: `${topic}-hash`,
      messages: testKeys.map(key => ({
        key: key,
        value: JSON.stringify({ key, note: 'Hash function quyết định partition' })
      }))
    });

    console.log('\nKết quả (hash distribution):');
    result3.forEach(batch => {
      batch.forEach((msg, idx) => {
        console.log(`  Key "${testKeys[idx]}": Partition ${msg.partition}`);
      });
    });

    // ============================================
    // TÓM TẮT
    // ============================================
    console.log('\n\n' + '='.repeat(60));
    console.log('📝 TÓM TẮT: Kafka phân chia messages dựa trên');
    console.log('='.repeat(60));
    console.log('\n1. 🔑 MESSAGE KEY (Quan trọng nhất)');
    console.log('   → Cùng key = Cùng partition');
    console.log('   → Đảm bảo thứ tự xử lý (ordering)');
    console.log('\n2. 📊 HASH FUNCTION');
    console.log('   → partition = hash(key) % numPartitions');
    console.log('   → Phân phối đều các keys khác nhau');
    console.log('\n3. ⚠️  KHÔNG CÓ KEY');
    console.log('   → Round-robin distribution');
    console.log('   → Không đảm bảo ordering');
    console.log('\n4. 💡 BEST PRACTICE');
    console.log('   → Luôn dùng key khi cần ordering');
    console.log('   → Key nên là: user-id, session-id, order-id, etc.');
    console.log('   → Tránh null key nếu cần đảm bảo thứ tự\n');

    await producer.disconnect();
    console.log('✅ Hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  simpleDemo()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { simpleDemo };

