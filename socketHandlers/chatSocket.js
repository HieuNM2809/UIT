const { Conversation, Message, User } = require('../models');
const { Op } = require('sequelize');
const { getClient } = require('../config/redis');
const { applicationLogger } = require('../config/logger');
const elasticsearchService = require('../services/elasticsearchService');

// Redis key prefix for active users
const ACTIVE_USERS_PREFIX = 'chat:active_users:';
const USER_SOCKET_PREFIX = 'chat:user_socket:';
const SOCKET_USER_PREFIX = 'chat:socket_user:';

// Helper functions for Redis operations
const activeUsersRedis = {  
  /**
   * Add user to conversation in Redis
   */
  async addUser(conversationId, userId, socketId) {
    try {
      const client = getClient();
      if (!client) {
        applicationLogger.warn('Redis not available, using in-memory fallback', {
          type: 'redis',
          operation: 'addUser',
          conversationId,
          userId
        });
        return false;
      }
      
      const key = `${ACTIVE_USERS_PREFIX}${conversationId}`;
      const userSocketKey = `${USER_SOCKET_PREFIX}${userId}:${conversationId}`;
      const socketUserKey = `${SOCKET_USER_PREFIX}${socketId}`;
      
      // Add userId to conversation set (using Redis SET)
      await client.sAdd(key, userId);
      // Set TTL for conversation (24 hours)
      await client.expire(key, 166400);
      
      // Store mapping: userId+conversationId -> socketId
      await client.setEx(userSocketKey, 166400, socketId);
      
      // Store mapping: socketId -> userId+conversationId
      await client.setEx(socketUserKey, 166400, `${userId}:${conversationId}`);
      
      return true;
    } catch (error) {
      applicationLogger.error('Redis addUser error', error, {
        type: 'redis',
        operation: 'addUser',
        conversationId,
        userId,
        socketId
      });
      return false;
    }
  },
  
  /**
   * Remove user from conversation in Redis
   */
  async removeUser(conversationId, userId, socketId) {
    try {
      const client = getClient();
      if (!client) return false;
      
      const key = `${ACTIVE_USERS_PREFIX}${conversationId}`;
      const userSocketKey = `${USER_SOCKET_PREFIX}${userId}:${conversationId}`;
      const socketUserKey = `${SOCKET_USER_PREFIX}${socketId}`;
      
      // Remove userId from conversation set
      await client.sRem(key, userId);
      
      // Remove mappings
      await client.del(userSocketKey);
      await client.del(socketUserKey);
      
      // If set is empty, delete it
      const count = await client.sCard(key);
      if (count === 0) {
        await client.del(key);
      }
      
      return true;
    } catch (error) {
      applicationLogger.error('Redis removeUser error', error, {
        type: 'redis',
        operation: 'removeUser',
        conversationId,
        userId,
        socketId
      });
      return false;
    }
  },
  
  /**
   * Get active users for a conversation
   */
  async getActiveUsers(conversationId) {
    try {
      const client = getClient();
      if (!client) return [];
      
      const key = `${ACTIVE_USERS_PREFIX}${conversationId}`;
      const userIds = await client.sMembers(key);
      return userIds.map(id => id.toString());
    } catch (error) {
      applicationLogger.error('Redis getActiveUsers error', error, {
        type: 'redis',
        operation: 'getActiveUsers',
        conversationId
      });
      return [];
    }
  },
  
  /**
   * Get all conversations for a socket
   */
  async getSocketConversations(socketId) {
    try {
      const client = getClient();
      if (!client) return [];
      
      const socketUserKey = `${SOCKET_USER_PREFIX}${socketId}`;
      const mapping = await client.get(socketUserKey);
      
      if (!mapping) return [];
      
      const [userId, conversationId] = mapping.split(':');
      return [{ userId, conversationId }];
    } catch (error) {
      applicationLogger.error('Redis getSocketConversations error', error, {
        type: 'redis',
        operation: 'getSocketConversations',
        socketId
      });
      return [];
    }
  },
  
  /**
   * Cleanup all data for a socket
   */
  async cleanupSocket(socketId) {
    try {
      const client = getClient();
      if (!client) return;
      
      // Get all conversations for this socket
      const conversations = await this.getSocketConversations(socketId);
      
      for (const { userId, conversationId } of conversations) {
        await this.removeUser(conversationId, userId, socketId);
      }
    } catch (error) {
      applicationLogger.error('Redis cleanupSocket error', error, {
        type: 'redis',
        operation: 'cleanupSocket',
        socketId
      });
    }
  }
};

/**
 * Socket.IO handler for chat functionality
 */
module.exports = (io) => {
  // Note: Session middleware is already applied in app.js
  // This middleware just extracts user info from session
  io.use(async (socket, next) => {
    try {
      // Get session from request (set by express-session middleware in app.js)
      const session = socket.request.session;
      
      // Check if user is authenticated via session
      if (session && session.user && session.user.id) {
        socket.userId = session.user.id;
        socket.user = session.user;
        return next();
      }
      
      // If no session, reject connection
      try {
        await elasticsearchService.logActivity({
          user_id: null,
          action: 'socket_authentication_failed',
          route_name: 'chat',
          route_path: '/chat',
          route_base: '/chat',
          resource_type: 'socket',
          resource_id: socket.id,
          ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
          user_agent: socket.request.headers?.['user-agent'] || null,
          session_id: socket.request.sessionID || null,
          execution_time_ms: null,
          details: {
            method: 'SOCKET',
            socket_id: socket.id,
            has_session: !!socket.request.session,
            has_user: !!(socket.request.session?.user),
            status_code: 401
          }
        });
      } catch (logError) {
        applicationLogger.error('Failed to log authentication failure', logError);
      }
      return next(new Error('Authentication failed'));
    } catch (error) {
      applicationLogger.error('Socket.IO auth error', error, {
        type: 'socket',
        operation: 'authentication',
        socketId: socket.id
      });
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Record socket connection metrics
    const { metrics } = require('../middleware/metrics');
    const updateConnectionCount = () => {
      const connectionCount = io.sockets.sockets.size;
      metrics.setSocketConnections(connectionCount);
    };
    updateConnectionCount();

    // Log activity to Elasticsearch activities index
    try {
      elasticsearchService.logActivity({
        user_id: socket.userId,
        action: 'socket_connection',
        route_name: 'chat',
        route_path: '/chat',
        route_base: '/chat',
        resource_type: 'socket',
        resource_id: socket.id,
        ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
        user_agent: socket.request.headers?.['user-agent'] || null,
        session_id: socket.request.sessionID || null,
        execution_time_ms: null,
        details: {
          method: 'SOCKET',
          socket_id: socket.id,
          user_email: socket.user?.email || null,
          status_code: 200
        }
      }).catch(error => {
        applicationLogger.error('Failed to log connection activity to Elasticsearch', error, {
          type: 'elasticsearch',
          operation: 'logActivity',
          userId: socket.userId
        });
      });
    } catch (error) {
      applicationLogger.error('Error logging connection activity', error, {
        type: 'elasticsearch',
        operation: 'logActivity',
        userId: socket.userId
      });
    }

    // Join user's personal room (for notifications)
    socket.join(`user:${socket.userId}`);

    /**
     * Join a conversation room
     */
    socket.on('join_conversation', async (conversationId) => {
      try {
        // Verify user has access to this conversation
        const conversation = await Conversation.findOne({
          where: {
            id: conversationId,
            [Op.or]: [
              { user1_id: socket.userId },
              { user2_id: socket.userId }
            ],
            is_active: true
          }
        });

        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found or access denied' });
          return;
        }

        // Join the conversation room
        socket.join(`conversation:${conversationId}`);
        
        // Track active user in conversation (Redis)
        await activeUsersRedis.addUser(conversationId, socket.userId, socket.id);

        // Notify others in the conversation that user joined
        socket.to(`conversation:${conversationId}`).emit('user_joined', {
          userId: socket.userId,
          conversationId: conversationId
        });

        // Log activity to Elasticsearch activities index
        try {
          await elasticsearchService.logActivity({
            user_id: socket.userId,
            action: 'join_conversation',
            route_name: 'chat',
            route_path: `/chat/${conversationId}`,
            route_base: '/chat',
            resource_type: 'conversation',
            resource_id: conversationId,
            ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
            user_agent: socket.request.headers?.['user-agent'] || null,
            session_id: socket.request.sessionID || null,
            execution_time_ms: null,
            details: {
              method: 'SOCKET',
              conversation_id: conversationId,
              socket_id: socket.id,
              status_code: 200
            }
          });
        } catch (error) {
          applicationLogger.error('Failed to log join conversation activity to Elasticsearch', error, {
            type: 'elasticsearch',
            operation: 'logActivity',
            userId: socket.userId,
            conversationId: conversationId
          });
        }
      } catch (error) {
        applicationLogger.error('Error joining conversation', error, {
          type: 'socket',
          operation: 'join_conversation',
          userId: socket.userId,
          conversationId: conversationId,
          socketId: socket.id
        });
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    /**
     * Leave a conversation room
     */
    socket.on('leave_conversation', async (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      
      // Remove user from active users (Redis)
      await activeUsersRedis.removeUser(conversationId, socket.userId, socket.id);

      socket.to(`conversation:${conversationId}`).emit('user_left', {
        userId: socket.userId,
        conversationId: conversationId
      });

      // Log activity to Elasticsearch activities index
      try {
        await elasticsearchService.logActivity({
          user_id: socket.userId,
          action: 'leave_conversation',
          route_name: 'chat',
          route_path: `/chat/${conversationId}`,
          route_base: '/chat',
          resource_type: 'conversation',
          resource_id: conversationId,
          ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
          user_agent: socket.request.headers?.['user-agent'] || null,
          session_id: socket.request.sessionID || null,
          execution_time_ms: null,
          details: {
            method: 'SOCKET',
            conversation_id: conversationId,
            socket_id: socket.id,
            status_code: 200
          }
        });
      } catch (error) {
        applicationLogger.error('Failed to log leave conversation activity to Elasticsearch', error, {
          type: 'elasticsearch',
          operation: 'logActivity',
          userId: socket.userId,
          conversationId: conversationId
        });
      }
    });

    /**
     * Send a message
     */
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content } = data;

        if (!conversationId || !content || content.trim().length === 0) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Verify user has access to this conversation
        const conversation = await Conversation.findOne({
          where: {
            id: conversationId,
            [Op.or]: [
              { user1_id: socket.userId },
              { user2_id: socket.userId }
            ],
            is_active: true
          },
          include: [
            {
              model: User,
              as: 'user1',
              attributes: ['id', 'first_name', 'last_name', 'avatar']
            },
            {
              model: User,
              as: 'user2',
              attributes: ['id', 'first_name', 'last_name', 'avatar']
            }
          ]
        });

        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found or access denied' });
          return;
        }

        // Determine the other user
        const otherUserId = conversation.user1_id === socket.userId 
          ? conversation.user2_id 
          : conversation.user1_id;

        // Create message
        const message = await Message.create({
          conversation_id: conversationId,
          sender_id: socket.userId,
          content: content.trim(),
          is_read: false
        });

        // Load sender info
        const sender = await User.findByPk(socket.userId, {
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        });

        // Update conversation
        await conversation.update({
          last_message_at: new Date(),
          last_message_id: message.id,
          user1_unread_count: conversation.user1_id === socket.userId 
            ? conversation.user1_unread_count 
            : conversation.user1_unread_count + 1,
          user2_unread_count: conversation.user2_id === socket.userId 
            ? conversation.user2_unread_count 
            : conversation.user2_unread_count + 1
        });

        // Format message for client
        const messageData = {
          id: message.id,
          conversation_id: conversationId,
          sender_id: socket.userId,
          content: message.content,
          created_at: message.created_at,
          createdAt: message.created_at,
          sender: {
            id: sender.id,
            first_name: sender.first_name,
            last_name: sender.last_name,
            avatar: sender.avatar
          }
        };

        // Record socket message metrics
        metrics.recordSocketMessage('send_message', 'success');
        updateConnectionCount(); // Update connection count after message

        // Emit to all users in the conversation room
        io.to(`conversation:${conversationId}`).emit('new_message', messageData);

        // Also emit to user's personal room for notifications
        io.to(`user:${otherUserId}`).emit('conversation_updated', {
          conversationId: conversationId,
          lastMessage: messageData,
          unreadCount: conversation.user1_id === otherUserId 
            ? conversation.user1_unread_count 
            : conversation.user2_unread_count
        });

        try {
          await elasticsearchService.logActivity({
            user_id: socket.userId,
            action: 'send_message',
            route_name: 'chat',
            route_path: `/chat/${conversationId}`,
            route_base: '/chat',
            resource_type: 'message',
            resource_id: message.id,
            ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
            user_agent: socket.request.headers?.['user-agent'] || null,
            session_id: socket.request.sessionID || null,
            execution_time_ms: null,
            details: {
              method: 'SOCKET',
              conversation_id: conversationId,
              message_id: message.id,
              content_length: content.trim().length,
              sender_id: socket.userId,
              receiver_id: otherUserId,
              socket_id: socket.id,
              status_code: 200
            }
          });
        } catch (error) {
          applicationLogger.error('Failed to log message activity to Elasticsearch', error, {
            type: 'elasticsearch',
            operation: 'logActivity',
            userId: socket.userId,
            messageId: message.id
          });
        }
      } catch (error) {
        applicationLogger.error('Error sending message', error, {
          type: 'socket',
          operation: 'send_message',
          userId: socket.userId,
          conversationId: conversationId,
          socketId: socket.id
        });
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Mark messages as read
     */
    socket.on('mark_read', async (conversationId) => {
      try {
        // Verify user has access
        const conversation = await Conversation.findOne({
          where: {
            id: conversationId,
            [Op.or]: [
              { user1_id: socket.userId },
              { user2_id: socket.userId }
            ],
            is_active: true
          }
        });

        if (!conversation) {
          return;
        }

        // Mark all unread messages as read
        await Message.update(
          { is_read: true },
          {
            where: {
              conversation_id: conversationId,
              sender_id: { [Op.ne]: socket.userId },
              is_read: false
            }
          }
        );

        // Reset unread count
        if (conversation.user1_id === socket.userId) {
          await conversation.update({ user1_unread_count: 0 });
        } else {
          await conversation.update({ user2_unread_count: 0 });
        }

        // Notify other user
        const otherUserId = conversation.user1_id === socket.userId 
          ? conversation.user2_id 
          : conversation.user1_id;
        
        io.to(`user:${otherUserId}`).emit('messages_read', {
          conversationId: conversationId,
          readBy: socket.userId
        });

        // Log activity to Elasticsearch activities index
        try {
          await elasticsearchService.logActivity({
            user_id: socket.userId,
            action: 'mark_read',
            route_name: 'chat',
            route_path: `/chat/${conversationId}`,
            route_base: '/chat',
            resource_type: 'conversation',
            resource_id: conversationId,
            ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
            user_agent: socket.request.headers?.['user-agent'] || null,
            session_id: socket.request.sessionID || null,
            execution_time_ms: null,
            details: {
              method: 'SOCKET',
              conversation_id: conversationId,
              socket_id: socket.id,
              read_by: socket.userId,
              status_code: 200
            }
          });
        } catch (error) {
          applicationLogger.error('Failed to log mark read activity to Elasticsearch', error, {
            type: 'elasticsearch',
            operation: 'logActivity',
            userId: socket.userId,
            conversationId: conversationId
          });
        }
      } catch (error) {
        applicationLogger.error('Error marking messages as read', error, {
          type: 'socket',
          operation: 'mark_read',
          userId: socket.userId,
          conversationId: conversationId,
          socketId: socket.id
        });
      }
    });

    /**
     * Typing indicator
     */
    socket.on('typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId: conversationId,
        isTyping: true
      });
    });

    socket.on('stop_typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId: conversationId,
        isTyping: false
      });
    });

    /**
     * Handle disconnect
     */
    socket.on('disconnect', async () => {
      // Update connection count on disconnect
      updateConnectionCount();
      
      // Remove user from all active conversations (Redis)
      const conversations = await activeUsersRedis.getSocketConversations(socket.id);
      
      // Log activity to Elasticsearch activities index
      try {
        await elasticsearchService.logActivity({
          user_id: socket.userId,
          action: 'socket_disconnect',
          route_name: 'chat',
          route_path: '/chat',
          route_base: '/chat',
          resource_type: 'socket',
          resource_id: socket.id,
          ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
          user_agent: socket.request.headers?.['user-agent'] || null,
          session_id: socket.request.sessionID || null,
          execution_time_ms: null,
          details: {
            method: 'SOCKET',
            socket_id: socket.id,
            conversations_count: conversations.length,
            status_code: 200
          }
        });
      } catch (error) {
        applicationLogger.error('Failed to log disconnect activity to Elasticsearch', error, {
          type: 'elasticsearch',
          operation: 'logActivity',
          userId: socket.userId
        });
      }
      
      for (const { userId, conversationId } of conversations) {
        await activeUsersRedis.removeUser(conversationId, userId, socket.id);
        
        // Notify others in the conversation
        socket.to(`conversation:${conversationId}`).emit('user_left', {
          userId: userId,
          conversationId: conversationId
        });
        
        // Log cleanup activity
        try {
          await elasticsearchService.logActivity({
            user_id: userId,
            action: 'disconnect_cleanup',
            route_name: 'chat',
            route_path: `/chat/${conversationId}`,
            route_base: '/chat',
            resource_type: 'conversation',
            resource_id: conversationId,
            ip_address: socket.request.connection?.remoteAddress || socket.request.headers?.['x-forwarded-for']?.split(',')[0] || null,
            user_agent: socket.request.headers?.['user-agent'] || null,
            session_id: socket.request.sessionID || null,
            execution_time_ms: null,
            details: {
              method: 'SOCKET',
              socket_id: socket.id,
              conversation_id: conversationId,
              status_code: 200
            }
          });
        } catch (logError) {
          // Silent fail for cleanup logs
        }
      }
    });
  });
};

