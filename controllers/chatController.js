const { Conversation, Message, User, Course, Enrollment } = require('../models');
const { Op } = require('sequelize');
const geminiService = require('../services/geminiService');
const { applicationLogger } = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

// Gemini AI User ID - Special UUID for Gemini AI
const GEMINI_AI_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Get or create Gemini AI conversation for user
 */
async function getOrCreateGeminiConversation(userId) {
  // Find existing Gemini conversation
  let conversation = await Conversation.findOne({
    where: {
      [Op.or]: [
        { user1_id: userId, user2_id: GEMINI_AI_USER_ID },
        { user1_id: GEMINI_AI_USER_ID, user2_id: userId }
      ],
      is_active: true
    },
    include: [
      {
        model: User,
        as: 'user1',
        attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
      },
      {
        model: User,
        as: 'user2',
        attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
      },
      {
        model: Message,
        as: 'lastMessage',
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      }
    ]
  });

  if (!conversation) {
    // Create Gemini AI user if not exists
    let geminiUser = await User.findByPk(GEMINI_AI_USER_ID);
    if (!geminiUser) {
      geminiUser = await User.create({
        id: GEMINI_AI_USER_ID,
        email: 'ai@studymate.uit.edu.vn',
        first_name: 'StudyMate',
        last_name: 'AI',
        role: 'system_admin',
        is_active: true,
        email_verified: true
      });
    }

    // Create new conversation with Gemini
    conversation = await Conversation.create({
      user1_id: userId,
      user2_id: GEMINI_AI_USER_ID
    });

    // Create welcome message from Gemini
    const welcomeMessage = await Message.create({
      conversation_id: conversation.id,
      sender_id: GEMINI_AI_USER_ID,
      content: '👋 Xin chào! Tôi là StudyMate AI, trợ lý học tập thông minh của bạn. Tôi có thể giúp bạn:\n\n✅ Giải đáp thắc mắc về khóa học\n✅ Đề xuất lộ trình học tập\n✅ Hỗ trợ làm bài tập và code\n✅ Giải thích khái niệm phức tạp\n✅ Phân tích tiến độ học tập\n\nHãy đặt câu hỏi để bắt đầu!',
      message_type: 'text',
      is_read: false
    });

    conversation.last_message_id = welcomeMessage.id;
    conversation.last_message_at = new Date();
    await conversation.save();

    // Reload with associations
    await conversation.reload({
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: Message,
          as: 'lastMessage',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ]
    });
  }

  return conversation;
}

/**
 * Get all conversations for current user
 */
exports.index = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get or create Gemini conversation
    const geminiConversation = await getOrCreateGeminiConversation(userId);

    // Get all other conversations where user is participant (exclude Gemini)
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ],
        is_active: true,
        [Op.and]: [
          { user1_id: { [Op.ne]: GEMINI_AI_USER_ID } },
          { user2_id: { [Op.ne]: GEMINI_AI_USER_ID } }
        ]
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: Message,
          as: 'lastMessage',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ],
      order: [['last_message_at', 'DESC']]
    });

    // Format Gemini conversation
    const geminiOtherUser = geminiConversation.user1_id === userId ? geminiConversation.user2 : geminiConversation.user1;
    const geminiUnreadCount = geminiConversation.user1_id === userId ? geminiConversation.user1_unread_count : geminiConversation.user2_unread_count;
    
    const formattedGeminiConversation = {
      id: geminiConversation.id,
      otherUser: {
        id: geminiOtherUser.id,
        name: `${geminiOtherUser.first_name} ${geminiOtherUser.last_name}`,
        avatar: geminiOtherUser.avatar || null,
        email: geminiOtherUser.email,
        isAI: true // Flag to identify AI conversation
      },
      lastMessage: geminiConversation.lastMessage ? {
        content: geminiConversation.lastMessage.content,
        sender: geminiConversation.lastMessage.sender ? `${geminiConversation.lastMessage.sender.first_name} ${geminiConversation.lastMessage.sender.last_name}` : 'AI',
        createdAt: geminiConversation.lastMessage.created_at
      } : null,
      lastMessageAt: geminiConversation.last_message_at,
      unreadCount: geminiUnreadCount || 0,
      isGemini: true // Flag to identify Gemini conversation
    };

    // Format other conversations with other user info
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1_id === userId ? conv.user2 : conv.user1;
      const unreadCount = conv.user1_id === userId ? conv.user1_unread_count : conv.user2_unread_count;

      return {
        id: conv.id,
        otherUser: {
          id: otherUser.id,
          name: `${otherUser.first_name} ${otherUser.last_name}`,
          avatar: otherUser.avatar,
          email: otherUser.email,
          isAI: false
        },
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          sender: conv.lastMessage.sender ? `${conv.lastMessage.sender.first_name} ${conv.lastMessage.sender.last_name}` : 'System',
          createdAt: conv.lastMessage.created_at
        } : null,
        lastMessageAt: conv.last_message_at,
        unreadCount: unreadCount || 0,
        isGemini: false
      };
    });

    // Combine: Gemini first, then others
    const allConversations = [formattedGeminiConversation, ...formattedConversations];

    // Check if request wants JSON (for widget)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          conversations: allConversations
        }
      });
    }

    res.locals.currentPath = '/chat';
    res.render('pages/chat/index', {
      title: 'Tin nhắn',
      pageHeader: 'Tin nhắn',
      conversations: allConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).render('error', {
      title: 'Lỗi hệ thống',
      error: {
        status: 500,
        message: 'Đã xảy ra lỗi khi tải danh sách cuộc trò chuyện'
      }
    });
  }
};

/**
 * Chat with AI - Dedicated route
 */
exports.chatAI = async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    
    // Get or create Gemini conversation
    const conversation = await getOrCreateGeminiConversation(currentUserId);
    
    // Get messages
    const messages = await Message.findAll({
      where: {
        conversation_id: conversation.id,
        deleted_at: null
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ],
      order: [['created_at', 'ASC']],
      limit: 100
    });

    // Mark messages as read
    await Message.update(
      { is_read: true, read_at: new Date() },
      {
        where: {
          conversation_id: conversation.id,
          sender_id: { [Op.ne]: currentUserId },
          is_read: false
        }
      }
    );

    // Reset unread count
    if (conversation.user1_id === currentUserId) {
      conversation.user1_unread_count = 0;
    } else {
      conversation.user2_unread_count = 0;
    }
    await conversation.save();

    const geminiUser = conversation.user1_id === currentUserId ? conversation.user2 : conversation.user1;

    res.locals.currentPath = '/chat-ai';
    res.render('pages/chat/ai', {
      title: 'Chat với StudyMate AI',
      pageHeader: 'Chat với StudyMate AI',
      conversation,
      otherUser: {
        ...geminiUser.toJSON(),
        isAI: true
      },
      messages,
      currentUserId,
      user: req.session.user
    });
  } catch (error) {
    applicationLogger.error('Chat AI error', error, {
      type: 'controller',
      operation: 'chatAI',
      userId: req.session.user?.id,
      path: req.path
    });
    req.flash('error', 'Đã xảy ra lỗi khi tải cuộc trò chuyện với AI');
    res.redirect('/chat');
  }
};

/**
 * Get or create conversation with another user
 */
exports.getConversation = async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    let otherUserId = req.params.userId;

    // Redirect AI requests to dedicated route
    if (otherUserId === 'ai' || otherUserId === GEMINI_AI_USER_ID) {
      return res.redirect('/chat-ai');
    }


    if (currentUserId === otherUserId) {
      req.flash('error', 'Bạn không thể chat với chính mình');
      return res.redirect('/chat');
    }

    // Check if other user exists
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id', 'first_name', 'last_name', 'avatar', 'email', 'role']
    });

    if (!otherUser) {
      req.flash('error', 'Người dùng không tồn tại');
      return res.redirect('/chat');
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1_id: currentUserId, user2_id: otherUserId },
          { user1_id: otherUserId, user2_id: currentUserId }
        ]
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
        }
      ]
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        user1_id: currentUserId,
        user2_id: otherUserId
      });

      // Reload with associations
      await conversation.reload({
        include: [
          {
            model: User,
            as: 'user1',
            attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
          },
          {
            model: User,
            as: 'user2',
            attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
          }
        ]
      });
    }

    // Get messages
    const messages = await Message.findAll({
      where: {
        conversation_id: conversation.id,
        deleted_at: null
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ],
      order: [['created_at', 'ASC']],
      limit: 100
    });

    // Mark messages as read
    await Message.update(
      { is_read: true, read_at: new Date() },
      {
        where: {
          conversation_id: conversation.id,
          sender_id: { [Op.ne]: currentUserId },
          is_read: false
        }
      }
    );

    // Reset unread count
    if (conversation.user1_id === currentUserId) {
      conversation.user1_unread_count = 0;
    } else {
      conversation.user2_unread_count = 0;
    }
    await conversation.save();

    const otherUserInfo = conversation.user1_id === currentUserId ? conversation.user2 : conversation.user1;

    // Check if request wants JSON (for widget)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          conversation: {
            id: conversation.id,
            user1_id: conversation.user1_id,
            user2_id: conversation.user2_id,
            user1: conversation.user1,
            user2: conversation.user2
          },
          otherUser: otherUserInfo,
          currentUserId,
          messages: messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            sender: msg.sender,
            created_at: msg.created_at,
            is_read: msg.is_read
          }))
        }
      });
    }

    res.locals.currentPath = `/chat/${otherUserId}`;
    res.render('pages/chat/conversation', {
      title: `Chat với ${otherUserInfo.first_name} ${otherUserInfo.last_name}`,
      pageHeader: 'Cuộc trò chuyện',
      conversation,
      otherUser: otherUserInfo,
      messages,
      currentUserId
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    req.flash('error', 'Đã xảy ra lỗi khi tải cuộc trò chuyện');
    res.redirect('/chat');
  }
};

/**
 * Send a message
 */
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.conversationId;
    const senderId = req.session.user.id;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Cuộc trò chuyện không tồn tại'
      });
    }

    if (conversation.user1_id !== senderId && conversation.user2_id !== senderId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này'
      });
    }

    // Check if this is a Gemini conversation
    const isGeminiConversation = conversation.user1_id === GEMINI_AI_USER_ID || conversation.user2_id === GEMINI_AI_USER_ID;

    // Create user message
    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      message_type: 'text'
    });

    // Update conversation
    conversation.last_message_id = message.id;
    conversation.last_message_at = new Date();

    // If Gemini conversation, generate AI response
    if (isGeminiConversation && process.env.GEMINI_API_KEY) {
      try {
        // Get conversation history (last 10 messages for context)
        const recentMessages = await Message.findAll({
          where: { conversation_id: conversationId },
          order: [['created_at', 'DESC']],
          limit: 10,
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'first_name', 'last_name']
          }]
        });

        // Build conversation history for Gemini
        const history = recentMessages.reverse().map(msg => ({
          role: msg.sender_id === senderId ? 'user' : 'model',
          content: msg.content
        }));

        // Call Gemini API with fallback
        const geminiResult = await geminiService.callGeminiWithFallback(
          content.trim(),
          history
        );

        // Create AI response message
        const aiMessage = await Message.create({
          conversation_id: conversationId,
          sender_id: GEMINI_AI_USER_ID,
          content: geminiResult.response,
          message_type: 'text',
          is_read: false
        });

        // Update conversation with AI message
        conversation.last_message_id = aiMessage.id;
        conversation.last_message_at = new Date();
        conversation.user1_unread_count = 0; // User has read (they sent the message)
        conversation.user2_unread_count = 1; // AI message is unread for user

        await conversation.save();

        // Load AI message with sender info
        await aiMessage.reload({
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'first_name', 'last_name', 'avatar']
          }]
        });

        applicationLogger.info('Gemini response generated in chat', {
          type: 'chat',
          operation: 'gemini_response',
          conversationId,
          model: geminiResult.model,
          responseLength: geminiResult.response.length
        });

        // Return both user message and AI response
        await message.reload({
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'first_name', 'last_name', 'avatar']
          }]
        });

        return res.json({
          success: true,
          message: 'Gửi tin nhắn thành công',
          data: {
            message: {
              id: message.id,
              content: message.content,
              sender_id: message.sender_id,
              sender: {
                id: message.sender.id,
                first_name: message.sender.first_name,
                last_name: message.sender.last_name,
                avatar: message.sender.avatar
              },
              created_at: message.created_at,
              createdAt: message.created_at,
              is_read: message.is_read
            },
            aiResponse: {
              id: aiMessage.id,
              content: aiMessage.content,
              sender_id: aiMessage.sender_id,
              sender: {
                id: aiMessage.sender.id,
                first_name: aiMessage.sender.first_name,
                last_name: aiMessage.sender.last_name,
                avatar: aiMessage.sender.avatar
              },
              created_at: aiMessage.created_at,
              createdAt: aiMessage.created_at,
              is_read: aiMessage.is_read
            },
            model: geminiResult.model
          }
        });
      } catch (error) {
        applicationLogger.error('Failed to generate Gemini response', error, {
          type: 'chat',
          operation: 'gemini_response_failed',
          conversationId
        });

        // Continue with normal flow even if Gemini fails
        // User message is already saved
      }
    }

    // Normal conversation flow (not Gemini)
    // Increment unread count for the other user
    if (conversation.user1_id === senderId) {
      conversation.user2_unread_count = (conversation.user2_unread_count || 0) + 1;
    } else {
      conversation.user1_unread_count = (conversation.user1_unread_count || 0) + 1;
    }

    await conversation.save();

    // Load message with sender info
    await message.reload({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Gửi tin nhắn thành công',
      data: {
        message: {
          id: message.id,
          content: message.content,
          sender_id: message.sender_id,
          sender: {
            id: message.sender.id,
            first_name: message.sender.first_name,
            last_name: message.sender.last_name,
            avatar: message.sender.avatar
          },
          created_at: message.created_at,
          createdAt: message.created_at, // Also include camelCase for JavaScript
          is_read: message.is_read
        }
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi gửi tin nhắn'
    });
  }
};

/**
 * Get messages for a conversation (API)
 */
exports.getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.session.user.id;
    const { before } = req.query; // For pagination

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Cuộc trò chuyện không tồn tại'
      });
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem cuộc trò chuyện này'
      });
    }

    // Build query
    const whereClause = {
      conversation_id: conversationId,
      deleted_at: null
    };

    if (before) {
      whereClause.created_at = { [Op.lt]: new Date(before) };
    }

    // Get messages
    const messages = await Message.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    // Mark as read
    await Message.update(
      { is_read: true, read_at: new Date() },
      {
        where: {
          conversation_id: conversationId,
          sender_id: { [Op.ne]: userId },
          is_read: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse().map(msg => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          sender: {
            id: msg.sender.id,
            first_name: msg.sender.first_name,
            last_name: msg.sender.last_name,
            avatar: msg.sender.avatar
          },
          created_at: msg.created_at,
          createdAt: msg.created_at, // Also include camelCase for JavaScript
          is_read: msg.is_read
        }))
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tải tin nhắn'
    });
  }
};

/**
 * Search users for chat
 */
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.session.user.id;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          users: []
        }
      });
    }

    const searchTerm = q.trim();

    // Search users by name, email, or student_id
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId }, // Exclude current user
        is_active: true, // Only active users
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${searchTerm}%` } },
          { last_name: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
          { student_id: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'first_name', 'last_name', 'email', 'avatar', 'student_id', 'role'],
      limit: 10,
      order: [['first_name', 'ASC'], ['last_name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          avatar: user.avatar,
          student_id: user.student_id,
          role: user.role
        }))
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tìm kiếm người dùng'
    });
  }
};

