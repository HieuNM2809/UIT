const express = require('express');
const { requireLogin } = require('../middleware/auth');
const { handleValidationErrorsAPI } = require('../middleware/validationHandler');
const chatController = require('../controllers/chatController');
const {
  sendMessageValidation,
  userIdValidation,
  conversationIdValidation
} = require('../validators/chatValidator');

const router = express.Router();

// All chat routes require login
router.use(requireLogin);

/**
 * @desc    Get all conversations for current user
 * @route   GET /chat
 * @access  Private
 */
router.get('/', chatController.index);

/**
 * @desc    Get messages for a conversation (API) - Must be before /:userId route
 * @route   GET /chat/:conversationId/messages
 * @access  Private
 */
router.get('/:conversationId/messages',
  conversationIdValidation,
  handleValidationErrorsAPI,
  chatController.getMessages
);

/**
 * @desc    Send a message
 * @route   POST /chat/:conversationId/message
 * @access  Private
 */
router.post('/:conversationId/message',
  conversationIdValidation,
  sendMessageValidation,
  handleValidationErrorsAPI,
  chatController.sendMessage
);

/**
 * @desc    Get or create conversation with another user
 * @route   GET /chat/:userId
 * @access  Private
 */
router.get('/:userId', userIdValidation, handleValidationErrorsAPI, chatController.getConversation);

module.exports = router;

