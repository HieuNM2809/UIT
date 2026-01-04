/**
 * Ví dụ giải thích cách Kafka phân chia messages vào partitions
 * 
 * Kafka phân chia messages dựa trên:
 * 1. Message KEY (nếu có) - Quan trọng nhất
 * 2. Partitioner strategy (default, legacy, custom)
 * 3. Số lượng partitions của topic
 * 
 * Chạy: node examples/kafka-partitioning-explained.js
 */

const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'studymate-partitioning-demo',
  brokers: ['localhost:9092']
});

// Tạo 2 producers với partitioner khác nhau để so sánh
const producerDefault = kafka.producer({
  allowAutoTopicCreation: true,
  // Default partitioner (mới trong KafkaJS v2.0.0)
  // Sử dụng murmur2 hash của key
});

const producerLegacy = kafka.producer({
  allowAutoTopicCreation: true,
  // Legacy partitioner (cũ)
  // Sử dụng hash code của key (Java String.hashCode())
  createPartitioner: Partitioners.LegacyPartitioner
});

const topic = 'partitioning-demo';

async function demonstratePartitioning() {
  try {
    await producerDefault.connect();
    await producerLegacy.connect();
    console.log('✅ Đã kết nối với Kafka\n');

    console.log('='.repeat(60));
    console.log('📚 GIẢI THÍCH CÁCH KAFKA PHÂN CHIA MESSAGES');
    console.log('='.repeat(60));
    console.log('\n');

    // ============================================================
    // 1. PHÂN CHIA DỰA TRÊN KEY
    // ============================================================
    console.log('1️⃣  PHÂN CHIA DỰA TRÊN KEY (Quan trọng nhất)\n');
    console.log('   📌 Quy tắc: Cùng KEY → Cùng PARTITION');
    console.log('   📌 Mục đích: Đảm bảo thứ tự xử lý cho cùng một key\n');

    const messagesWithKeys = [
      { key: 'user-1', value: 'Message 1 cho user-1' },
      { key: 'user-2', value: 'Message 1 cho user-2' },
      { key: 'user-1', value: 'Message 2 cho user-1' }, // Cùng key với message đầu
      { key: 'user-3', value: 'Message 1 cho user-3' },
      { key: 'user-1', value: 'Message 3 cho user-1' }, // Cùng key với message đầu
      { key: 'user-2', value: 'Message 2 cho user-2' }, // Cùng key với message thứ 2
    ];

    console.log('   Gửi messages với keys:');
    messagesWithKeys.forEach((msg, idx) => {
      console.log(`   ${idx + 1}. Key: "${msg.key}" → Value: "${msg.value}"`);
    });

    const resultWithKeys = await producerDefault.send({
      topic: topic,
      messages: messagesWithKeys.map(msg => ({
        key: msg.key,
        value: JSON.stringify(msg)
      }))
    });

    console.log('\n   📊 Kết quả phân chia:');
    const partitionMap = {};
    resultWithKeys.forEach(batch => {
      batch.forEach((msg, idx) => {
        const originalMsg = messagesWithKeys[msg.partition === undefined ? idx : 
          resultWithKeys.findIndex(b => b.includes(msg))];
        const key = originalMsg.key;
        const partition = msg.partition;
        
        if (!partitionMap[key]) {
          partitionMap[key] = [];
        }
        partitionMap[key].push(partition);
      });
    });

    Object.keys(partitionMap).forEach(key => {
      const partitions = partitionMap[key];
      const uniquePartitions = [...new Set(partitions)];
      console.log(`   Key "${key}": Partition ${uniquePartitions.join(', ')}`);
      if (uniquePartitions.length === 1) {
        console.log(`      ✅ Tất cả messages với key này đều vào partition ${uniquePartitions[0]}`);
      }
    });

    console.log('\n   💡 Lợi ích:');
    console.log('      - Messages cùng key luôn vào cùng partition');
    console.log('      - Đảm bảo thứ tự xử lý (ordering)');
    console.log('      - Hữu ích cho: user events, session data, etc.\n');

    // ============================================================
    // 2. PHÂN CHIA KHI KHÔNG CÓ KEY (Round-robin)
    // ============================================================
    console.log('2️⃣  PHÂN CHIA KHI KHÔNG CÓ KEY (Round-robin)\n');
    console.log('   📌 Quy tắc: Phân phối đều theo round-robin');
    console.log('   📌 Mỗi message sẽ đi vào partition tiếp theo\n');

    const messagesWithoutKeys = [
      { value: 'Message 1 (no key)' },
      { value: 'Message 2 (no key)' },
      { value: 'Message 3 (no key)' },
      { value: 'Message 4 (no key)' },
      { value: 'Message 5 (no key)' },
    ];

    console.log('   Gửi messages KHÔNG có key:');
    messagesWithoutKeys.forEach((msg, idx) => {
      console.log(`   ${idx + 1}. "${msg.value}"`);
    });

    const resultWithoutKeys = await producerDefault.send({
      topic: topic,
      messages: messagesWithoutKeys.map(msg => ({
        value: JSON.stringify(msg)
      }))
    });

    console.log('\n   📊 Kết quả phân chia:');
    resultWithoutKeys.forEach(batch => {
      batch.forEach((msg, idx) => {
        const originalMsg = messagesWithoutKeys[idx];
        console.log(`   "${originalMsg.value}": Partition ${msg.partition}`);
      });
    });

    console.log('\n   💡 Lưu ý:');
    console.log('      - Phân phối đều nhưng không đảm bảo thứ tự');
    console.log('      - Phù hợp khi không cần ordering\n');

    // ============================================================
    // 3. SO SÁNH DEFAULT vs LEGACY PARTITIONER
    // ============================================================
    console.log('3️⃣  SO SÁNH DEFAULT vs LEGACY PARTITIONER\n');
    console.log('   📌 Default Partitioner: Murmur2 hash (mới)');
    console.log('   📌 Legacy Partitioner: Java String.hashCode() (cũ)\n');

    const testKeys = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];

    console.log('   Test với các keys:');
    testKeys.forEach(key => console.log(`   - ${key}`));

    // Gửi với default partitioner
    const resultDefault = await producerDefault.send({
      topic: `${topic}-default`,
      messages: testKeys.map(key => ({
        key: key,
        value: JSON.stringify({ key, partitioner: 'default' })
      }))
    });

    // Gửi với legacy partitioner
    const resultLegacy = await producerLegacy.send({
      topic: `${topic}-legacy`,
      messages: testKeys.map(key => ({
        key: key,
        value: JSON.stringify({ key, partitioner: 'legacy' })
      }))
    });

    console.log('\n   📊 Kết quả:');
    console.log('   Default Partitioner:');
    resultDefault.forEach(batch => {
      batch.forEach((msg, idx) => {
        console.log(`      Key "${testKeys[idx]}": Partition ${msg.partition}`);
      });
    });

    console.log('   Legacy Partitioner:');
    resultLegacy.forEach(batch => {
      batch.forEach((msg, idx) => {
        console.log(`      Key "${testKeys[idx]}": Partition ${msg.partition}`);
      });
    });

    console.log('\n   💡 Khác biệt:');
    console.log('      - Cùng key có thể vào partition khác nhau');
    console.log('      - Legacy: Tương thích với Kafka Java client');
    console.log('      - Default: Hiệu suất tốt hơn, phân phối đều hơn\n');

    // ============================================================
    // 4. CUSTOM PARTITIONER (Ví dụ)
    // ============================================================
    console.log('4️⃣  CUSTOM PARTITIONER (Ví dụ)\n');
    console.log('   📌 Có thể tạo partitioner tùy chỉnh\n');

    // Ví dụ: Partition dựa trên prefix của key
    const customPartitioner = ({ topic, partitionMetadata, message }) => {
      const key = message.key?.toString() || '';
      
      // Ví dụ: Partition dựa trên prefix
      if (key.startsWith('user-')) {
        return 0; // Tất cả user-* vào partition 0
      } else if (key.startsWith('admin-')) {
        return 1; // Tất cả admin-* vào partition 1
      } else {
        // Round-robin cho các key khác
        return parseInt(key.slice(-1)) % partitionMetadata.length;
      }
    };

    console.log('   Ví dụ custom partitioner:');
    console.log('   - Key bắt đầu với "user-": Partition 0');
    console.log('   - Key bắt đầu với "admin-": Partition 1');
    console.log('   - Key khác: Round-robin\n');

    // ============================================================
    // TÓM TẮT
    // ============================================================
    console.log('='.repeat(60));
    console.log('📝 TÓM TẮT');
    console.log('='.repeat(60));
    console.log('\n');
    console.log('Kafka phân chia messages dựa trên:\n');
    console.log('1. 🔑 MESSAGE KEY (Quan trọng nhất)');
    console.log('   - Cùng key → Cùng partition');
    console.log('   - Đảm bảo ordering cho cùng key');
    console.log('   - Hash function quyết định partition\n');
    
    console.log('2. 📊 PARTITIONER STRATEGY');
    console.log('   - Default: Murmur2 hash (mới)');
    console.log('   - Legacy: Java String.hashCode() (cũ)');
    console.log('   - Custom: Tự định nghĩa logic\n');
    
    console.log('3. 🔢 SỐ LƯỢNG PARTITIONS');
    console.log('   - Partition = hash(key) % numPartitions');
    console.log('   - Nhiều partitions = phân phối đều hơn\n');
    
    console.log('4. ⚠️  KHÔNG CÓ KEY');
    console.log('   - Round-robin distribution');
    console.log('   - Không đảm bảo ordering\n');

    await producerDefault.disconnect();
    await producerLegacy.disconnect();
    console.log('\n✅ Hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  demonstratePartitioning()
    .then(() => {
      console.log('\n✨ Demo hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { demonstratePartitioning };

