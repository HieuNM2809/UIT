const express = require('express');
const { handleValidationErrors } = require('../middleware/validationHandler');
const { requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/admin/adminController');
const adminCourseController = require('../controllers/admin/adminCourseController');
const adminUserController = require('../controllers/admin/adminUserController');
const adminCategoryController = require('../controllers/admin/adminCategoryController');
const adminContactController = require('../controllers/admin/adminContactController');
const {
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation,
  courseStatusValidation,
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  categoryStatusValidation,
  deleteCategoryValidation,
  userIdValidation,
  userStatusValidation,
  userRoleValidation,
  deleteUserValidation,
  contactIdValidation,
  contactStatusValidation,
  contactPriorityValidation,
  courseListValidation,
  userListValidation,
  categoryListValidation,
  contactListValidation
} = require('../validators/adminValidator');

const router = express.Router();

// Set admin layout for all admin routes
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

// All routes require admin access
router.use(requireAdmin);

/**
 * @desc    Admin Dashboard
 * @route   GET /admin
 * @access  Private (Admin only)
 */
router.get('/', adminController.getDashboard);

/**
 * @desc    Statistics Dashboard
 * @route   GET /admin/statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', adminController.getStatistics);

// ==================== COURSES ROUTES ====================

/**
 * @desc    List all courses (Admin)
 * @route   GET /admin/courses
 * @access  Private (Admin only)
 */
router.get('/courses',
  courseListValidation,
  handleValidationErrors,
  adminCourseController.index
);

/**
 * @desc    Export courses to Excel
 * @route   GET /admin/courses/export
 * @access  Private (Admin only)
 */
router.get('/courses/export', adminCourseController.export);

/**
 * @desc    Show create course form
 * @route   GET /admin/courses/create
 * @access  Private (Admin only)
 */
router.get('/courses/create', adminCourseController.showCreateForm);

/**
 * @desc    Create new course
 * @route   POST /admin/courses/create
 * @access  Private (Admin only)
 */
router.post('/courses/create',
  createCourseValidation,
  handleValidationErrors,
  adminCourseController.create
);

/**
 * @desc    Show edit course form
 * @route   GET /admin/courses/:id/edit
 * @access  Private (Admin only)
 */
router.get('/courses/:id/edit',
  courseIdValidation,
  handleValidationErrors,
  adminCourseController.showEditForm
);

/**
 * @desc    Update course
 * @route   POST /admin/courses/:id/edit
 * @access  Private (Admin only)
 */
router.post('/courses/:id/edit',
  courseIdValidation,
  updateCourseValidation,
  handleValidationErrors,
  adminCourseController.update
);

/**
 * @desc    Show course details (Admin)
 * @route   GET /admin/courses/:id
 * @access  Private (Admin only)
 */
router.get('/courses/:id',
  courseIdValidation,
  handleValidationErrors,
  adminCourseController.show
);

/**
 * @desc    Update course status
 * @route   POST /admin/courses/:id/status
 * @access  Private (Admin only)
 */
router.post('/courses/:id/status',
  courseIdValidation,
  courseStatusValidation,
  handleValidationErrors,
  adminCourseController.updateStatus
);

/**
 * @desc    Delete course
 * @route   POST /admin/courses/:id/delete
 * @access  Private (Admin only)
 */
router.post('/courses/:id/delete',
  courseIdValidation,
  handleValidationErrors,
  adminCourseController.delete
);

// ==================== USERS ROUTES ====================

/**
 * @desc    List all users (Admin)
 * @route   GET /admin/users
 * @access  Private (Admin only)
 */
router.get('/users',
  userListValidation,
  handleValidationErrors,
  adminUserController.index
);

/**
 * @desc    Export users to Excel
 * @route   GET /admin/users/export
 * @access  Private (Admin only)
 */
router.get('/users/export', adminUserController.export);

/**
 * @desc    Show user details (Admin)
 * @route   GET /admin/users/:id
 * @access  Private (Admin only)
 */
router.get('/users/:id',
  userIdValidation,
  handleValidationErrors,
  adminUserController.show
);

/**
 * @desc    Update user status
 * @route   POST /admin/users/:id/status
 * @access  Private (Admin only)
 */
router.post('/users/:id/status',
  userIdValidation,
  userStatusValidation,
  handleValidationErrors,
  adminUserController.updateStatus
);

/**
 * @desc    Update user role
 * @route   POST /admin/users/:id/role
 * @access  Private (Admin only)
 */
router.post('/users/:id/role',
  userIdValidation,
  userRoleValidation,
  handleValidationErrors,
  adminUserController.updateRole
);

/**
 * @desc    Delete user (soft delete - deactivate)
 * @route   POST /admin/users/:id/delete
 * @access  Private (Admin only)
 */
router.post('/users/:id/delete',
  userIdValidation,
  deleteUserValidation,
  handleValidationErrors,
  adminUserController.delete
);

// ==================== CATEGORIES ROUTES ====================

/**
 * @desc    List all categories (Admin)
 * @route   GET /admin/categories
 * @access  Private (Admin only)
 */
router.get('/categories',
  categoryListValidation,
  handleValidationErrors,
  adminCategoryController.index
);

/**
 * @desc    Show create category form
 * @route   GET /admin/categories/create
 * @access  Private (Admin only)
 */
router.get('/categories/create', adminCategoryController.showCreateForm);

/**
 * @desc    Create new category
 * @route   POST /admin/categories/create
 * @access  Private (Admin only)
 */
router.post('/categories/create',
  createCategoryValidation,
  handleValidationErrors,
  adminCategoryController.create
);

/**
 * @desc    Show edit category form
 * @route   GET /admin/categories/:id/edit
 * @access  Private (Admin only)
 */
router.get('/categories/:id/edit',
  categoryIdValidation,
  handleValidationErrors,
  adminCategoryController.showEditForm
);

/**
 * @desc    Update category
 * @route   POST /admin/categories/:id/edit
 * @access  Private (Admin only)
 */
router.post('/categories/:id/edit',
  categoryIdValidation,
  updateCategoryValidation,
  handleValidationErrors,
  adminCategoryController.update
);

/**
 * @desc    Show category details (Admin)
 * @route   GET /admin/categories/:id
 * @access  Private (Admin only)
 */
router.get('/categories/:id',
  categoryIdValidation,
  handleValidationErrors,
  adminCategoryController.show
);

/**
 * @desc    Update category status
 * @route   POST /admin/categories/:id/status
 * @access  Private (Admin only)
 */
router.post('/categories/:id/status',
  categoryIdValidation,
  categoryStatusValidation,
  handleValidationErrors,
  adminCategoryController.updateStatus
);

/**
 * @desc    Delete category
 * @route   POST /admin/categories/:id/delete
 * @access  Private (Admin only)
 */
router.post('/categories/:id/delete',
  categoryIdValidation,
  deleteCategoryValidation,
  handleValidationErrors,
  adminCategoryController.delete
);

// ==================== CONTACTS ROUTES ====================

/**
 * @desc    List all contacts (Admin)
 * @route   GET /admin/contacts
 * @access  Private (Admin only)
 */
router.get('/contacts',
  contactListValidation,
  handleValidationErrors,
  adminContactController.index
);

/**
 * @desc    Show contact details (Admin)
 * @route   GET /admin/contacts/:id
 * @access  Private (Admin only)
 */
router.get('/contacts/:id',
  contactIdValidation,
  handleValidationErrors,
  adminContactController.show
);

/**
 * @desc    Update contact status
 * @route   POST /admin/contacts/:id/status
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/status',
  contactIdValidation,
  contactStatusValidation,
  handleValidationErrors,
  adminContactController.updateStatus
);

/**
 * @desc    Update contact priority
 * @route   POST /admin/contacts/:id/priority
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/priority',
  contactIdValidation,
  contactPriorityValidation,
  handleValidationErrors,
  adminContactController.updatePriority
);

/**
 * @desc    Update admin notes
 * @route   POST /admin/contacts/:id/notes
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/notes',
  contactIdValidation,
  handleValidationErrors,
  adminContactController.updateNotes
);

/**
 * @desc    Delete contact
 * @route   POST /admin/contacts/:id/delete
 * @access  Private (Admin only)
 */
router.post('/contacts/:id/delete',
  contactIdValidation,
  handleValidationErrors,
  adminContactController.delete
);

module.exports = router;
