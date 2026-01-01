const { Course, Blog, Category, User, Enrollment } = require('../models');
const { Op, Sequelize } = require('sequelize');

/**
 * Homepage with dynamic data
 */
exports.index = async (req, res) => {
  try {
    // Get statistics
    const [
      totalCourses,
      totalUsers,
      totalEnrollments,
      totalBlogs
    ] = await Promise.all([
      Course.count({ where: { status: 'published', is_public: true } }),
      User.count({ where: { is_active: true, email_verified: true } }),
      Enrollment.count(),
      Blog.count({ where: { status: 'published' } })
    ]);

    // Get featured courses (top enrolled)
    const featuredCourses = await Course.findAll({
      where: {
        status: 'published',
        is_public: true
      },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'icon']
        }
      ],
      order: [['enrolled_count', 'DESC']],
      limit: 6
    });

    // Get latest courses
    const latestCourses = await Course.findAll({
      where: {
        status: 'published',
        is_public: true
      },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'icon']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 6
    });

    // Get latest blogs
    const latestBlogs = await Blog.findAll({
      where: {
        status: 'published'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 3
    });

    // Get popular categories with course count
    const allCategories = await Category.findAll({
      include: [
        {
          model: Course,
          as: 'courses',
          where: {
            status: 'published',
            is_public: true
          },
          attributes: [],
          required: false
        }
      ]
    });

    // Calculate course count for each category
    const popularCategories = await Promise.all(
      allCategories.map(async (category) => {
        const courseCount = await Course.count({
          where: {
            category_id: category.id,
            status: 'published',
            is_public: true
          }
        });
        return {
          ...category.toJSON(),
          course_count: courseCount
        };
      })
    );

    // Sort by course count and limit to 6
    const sortedCategories = popularCategories
      .filter(cat => cat.course_count > 0)
      .sort((a, b) => b.course_count - a.course_count)
      .slice(0, 6);

    res.locals.currentPath = '/';
    res.render('pages/home', {
      title: 'Trang chủ - StudyMate AI',
      fullWidth: true,
      stats: {
        totalCourses,
        totalUsers,
        totalEnrollments,
        totalBlogs
      },
      featuredCourses,
      latestCourses,
      latestBlogs,
      popularCategories: sortedCategories
    });
  } catch (error) {
    console.error('Homepage error:', error);
    // Fallback to basic render if database query fails
    res.locals.currentPath = '/';
    res.render('pages/home', {
      title: 'Trang chủ',
      fullWidth: true,
      stats: {
        totalCourses: 0,
        totalUsers: 0,
        totalEnrollments: 0,
        totalBlogs: 0
      },
      featuredCourses: [],
      latestCourses: [],
      latestBlogs: [],
      popularCategories: []
    });
  }
};

