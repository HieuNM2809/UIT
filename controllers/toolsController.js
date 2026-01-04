const { applicationLogger } = require('../config/logger');

/**
 * Tools Index Page - List all available tools
 * GET /tools
 */
exports.index = (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost';
  const port = process.env.PORT || 3000;
  
  const tools = [
    {
      name: 'MinIO',
      description: 'Object Storage - Quản lý và lưu trữ files, images',
      icon: '📦',
      color: 'blue',
      url: 'http://localhost:9001',
      status: 'running',
      category: 'Storage',
      credentials: {
        username: process.env.MINIO_ROOT_USER || 'minioadmin',
        password: process.env.MINIO_ROOT_PASSWORD || 'minioadmin123'
      },
      endpoints: {
        api: 'http://localhost:9000',
        console: 'http://localhost:9001'
      },
      features: [
        'Object Storage',
        'File Management',
        'Image Storage',
        'Public/Private Buckets'
      ]
    },
    {
      name: 'Kibana',
      description: 'Log Visualization - Xem và phân tích logs từ Elasticsearch',
      icon: '📊',
      color: 'yellow',
      url: 'http://localhost:5601',
      status: 'running',
      category: 'Logging',
      credentials: null,
      endpoints: {
        ui: 'http://localhost:5601'
      },
      features: [
        'Log Visualization',
        'Search & Filter',
        'Dashboards',
        'Real-time Monitoring'
      ],
      queryExamples: [
        'type: "test"',
        'type: "socket" AND operation: "connection"',
        'level: "error" AND userId: "user-123"'
      ]
    },
    {
      name: 'Elasticsearch',
      description: 'Search Engine - Lưu trữ và tìm kiếm logs',
      icon: '🔍',
      color: 'green',
      url: 'http://localhost:9200',
      status: 'running',
      category: 'Logging',
      credentials: null,
      endpoints: {
        api: 'http://localhost:9200',
        cluster: 'http://localhost:9200/_cluster/health'
      },
      features: [
        'Full-text Search',
        'Log Storage',
        'Real-time Indexing',
        'RESTful API'
      ],
      queryExamples: [
        'GET /studymate-logs/_search?q=type:test',
        'GET /studymate-logs/_search?q=level:error',
        'GET /_cat/indices?v'
      ]
    },
    {
      name: 'Prometheus',
      description: 'Metrics Collection - Thu thập và lưu trữ metrics',
      icon: '📈',
      color: 'orange',
      url: 'http://localhost:9090',
      status: 'running',
      category: 'Monitoring',
      credentials: null,
      endpoints: {
        ui: 'http://localhost:9090',
        api: 'http://localhost:9090/api/v1',
        targets: 'http://localhost:9090/targets',
        metrics: 'http://localhost:3000/metrics'
      },
      features: [
        'Metrics Collection',
        'Time Series Database',
        'Query Language (PromQL)',
        'Alerting'
      ],
      queryExamples: [
        'rate(studymate_http_requests_total[5m])',
        'histogram_quantile(0.95, rate(studymate_http_request_duration_seconds_bucket[5m]))',
        'studymate_active_users'
      ]
    },
    {
      name: 'Grafana',
      description: 'Metrics Visualization - Visualize metrics từ Prometheus',
      icon: '📉',
      color: 'purple',
      url: 'http://localhost:3001',
      status: 'running',
      category: 'Monitoring',
      credentials: {
        username: process.env.GRAFANA_ADMIN_USER || 'admin',
        password: process.env.GRAFANA_ADMIN_PASSWORD || 'admin123'
      },
      endpoints: {
        ui: 'http://localhost:3001',
        api: 'http://localhost:3001/api'
      },
      features: [
        'Dashboard Visualization',
        'Real-time Metrics',
        'Custom Dashboards',
        'Alerting'
      ],
      dashboards: [
        'StudyMate - Overview Dashboard'
      ]
    },
    {
      name: 'SonarQube',
      description: 'Code Quality & Security Analysis - Phân tích chất lượng code và bảo mật',
      icon: '🔍',
      color: 'blue',
      url: 'http://localhost:9002',
      status: 'running',
      category: 'Code Quality',
      credentials: {
        username: 'admin',
        password: 'admin'
      },
      endpoints: {
        ui: 'http://localhost:9002',
        api: 'http://localhost:9002/api'
      },
      features: [
        'Code Quality Analysis',
        'Security Vulnerability Detection',
        'Code Smells Detection',
        'Code Coverage',
        'Technical Debt Tracking',
        'Quality Gates'
      ],
      documentation: {
        readme: '/sonarqube/README.md',
        config: '/sonarqube/sonar-project.properties.example'
      },
      commands: [
        {
          label: 'Command Line',
          description: 'Chạy từ terminal',
          command: 'cd sonarqube\nrun-analysis.bat'
        }
      ]
    }
  ];

  // Check tool status (optional - can be enhanced with actual health checks)
  const toolsWithStatus = tools.map(tool => {
    return {
      ...tool,
      // Status can be enhanced with actual health check API calls
      status: tool.status || 'unknown'
    };
  });

  applicationLogger.info('Tools page accessed', {
    type: 'tools',
    operation: 'view_tools',
    userId: req.user?.id || req.session?.user?.id || 'anonymous'
  });

  res.render('pages/tools/index', {
    title: 'Tools & Services',
    pageHeader: 'Tools & Services',
    tools: toolsWithStatus,
    baseUrl: baseUrl,
    port: port
  });
};

