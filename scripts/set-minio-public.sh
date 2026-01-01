#!/bin/bash
# Script to set MinIO bucket to public access

BUCKET_NAME=${MINIO_BUCKET_NAME:-studymate}
MINIO_USER=${MINIO_ROOT_USER:-minioadmin}
MINIO_PASS=${MINIO_ROOT_PASSWORD:-minioadmin123}

echo "🔧 Setting MinIO bucket '$BUCKET_NAME' to public access..."

# Run mc command in Docker container
docker run --rm -it \
  --network studymate-network \
  minio/mc:latest \
  /bin/sh -c "
    echo '⏳ Connecting to MinIO...';
    mc config host add myminio http://minio:9000 $MINIO_USER $MINIO_PASS;
    echo '✅ Connected to MinIO';
    echo '📦 Ensuring bucket exists...';
    mc mb --ignore-existing myminio/$BUCKET_NAME;
    echo '🔓 Setting bucket to public (download)...';
    mc anonymous set download myminio/$BUCKET_NAME;
    echo '✅ Bucket $BUCKET_NAME is now public!';
    echo '';
    echo 'Test URL format: http://localhost:9000/$BUCKET_NAME/filename.png';
  "

echo ""
echo "✅ Done! Bucket '$BUCKET_NAME' is now set to public access."

