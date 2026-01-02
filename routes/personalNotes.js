const express = require('express');
const { requireLogin } = require('../middleware/auth');
const personalNoteController = require('../controllers/personalNoteController');

const router = express.Router();

// All routes require login
router.use(requireLogin);

/**
 * @desc    Get all pinned notes page (must be before /:noteId route)
 * @route   GET /personal-notes/pinned
 * @access  Private
 */
router.get('/pinned', personalNoteController.getPinnedNotes);

/**
 * @desc    Get or create personal note for a content
 * @route   GET /api/personal-notes/content/:contentId
 * @access  Private
 */
router.get('/content/:contentId', personalNoteController.getOrCreate);

/**
 * @desc    Get all notes for a course
 * @route   GET /api/personal-notes/course/:courseId
 * @access  Private
 */
router.get('/course/:courseId', personalNoteController.getByCourse);

/**
 * @desc    Update personal note
 * @route   PUT /api/personal-notes/:noteId
 * @access  Private
 */
router.put('/:noteId', personalNoteController.update);

/**
 * @desc    Delete personal note
 * @route   DELETE /api/personal-notes/:noteId
 * @access  Private
 */
router.delete('/:noteId', personalNoteController.delete);

module.exports = router;

