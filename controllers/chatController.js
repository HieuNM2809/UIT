const { Conversation, Message, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all conversations for current user
 */
exports.index = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get all conversations where user is participant
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
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
      ],
      order: [['last_message_at', 'DESC']]
    });

    // Format conversations with other user info
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1_id === userId ? conv.user2 : conv.user1;
      const unreadCount = conv.user1_id === userId ? conv.user1_unread_count : conv.user2_unread_count;

      return {
        id: conv.id,
        otherUser: {
          id: otherUser.id,
          name: `${otherUser.first_name} ${otherUser.last_name}`,
          avatar: otherUser.avatar,
          email: otherUser.email
        },
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          sender: conv.lastMessage.sender ? `${conv.lastMessage.sender.first_name} ${conv.lastMessage.sender.last_name}` : 'System',
          createdAt: conv.lastMessage.created_at
        } : null,
        lastMessageAt: conv.last_message_at,
        unreadCount: unreadCount || 0
      };
    });

    // Check if request wants JSON (for widget)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        data: {
          conversations: formattedConversations
        }
      });
    }

    res.locals.currentPath = '/chat';
    res.render('pages/chat/index', {
      title: 'Tin nhắn',
      pageHeader: 'Tin nhắn',
      conversations: formattedConversations
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
 * Get or create conversation with another user
 */
exports.getConversation = async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const otherUserId = req.params.userId;

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

    // Create message
    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      message_type: 'text'
    });

    // Update conversation
    conversation.last_message_id = message.id;
    conversation.last_message_at = new Date();

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

