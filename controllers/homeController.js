const { Course, Blog, Category, User, Enrollment } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { cacheUtils } = require('../config/redis');
const { applicationLogger } = require('../config/logger');

/**
 * Homepage with dynamic data
 * Cached with Redis for 1 minute (60 seconds)
 */
exports.index = async (req, res) => {
  const cacheKey = 'homepage:data';
  const cacheTTL = 60; // 1 minute

  try {
    // Try to get data from cache first
    const cachedData = await cacheUtils.get(cacheKey);
    
    if (cachedData) {
      applicationLogger.debug('Homepage data served from cache', {
        type: 'cache',
        operation: 'get',
        key: cacheKey
      });

      res.locals.currentPath = '/';
      return res.render('pages/home', {
        title: 'Trang chủ - StudyMate AI',
        fullWidth: true,
        ...cachedData
      });
    }

    // Cache miss - fetch from database
    applicationLogger.debug('Homepage cache miss, fetching from database', {
      type: 'cache',
      operation: 'miss',
      key: cacheKey
    });

    // Get statistics
    const [
      totalCourses,
      totalUsers,
      totalEnrollments,
      totalBlogs
    ] = await Promise.all([
      Course.count({ where: { status: 'published' } }),
      User.count({ where: { is_active: true } }),
      Enrollment.count(),
      Blog.count({ where: { status: 'published' } })
    ]);

    // Get featured courses (top enrolled)
    const featuredCourses = await Course.findAll({
      where: {
        status: 'published'
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
        status: 'published'
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
            status: 'published'
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
            status: 'published'
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

    // Prepare data for cache (convert Sequelize instances to plain objects)
    const cacheData = {
      stats: {
        totalCourses,
        totalUsers,
        totalEnrollments,
        totalBlogs
      },
      featuredCourses: featuredCourses.map(course => course.toJSON()),
      latestCourses: latestCourses.map(course => course.toJSON()),
      latestBlogs: latestBlogs.map(blog => blog.toJSON()),
      popularCategories: sortedCategories
    };

    // Store in cache
    await cacheUtils.set(cacheKey, cacheData, cacheTTL);

    applicationLogger.debug('Homepage data cached successfully', {
      type: 'cache',
      operation: 'set',
      key: cacheKey,
      ttl: cacheTTL
    });

    res.locals.currentPath = '/';
    res.render('pages/home', {
      title: 'Trang chủ - StudyMate AI',
      fullWidth: true,
      stats: cacheData.stats,
      featuredCourses,
      latestCourses,
      latestBlogs,
      popularCategories: sortedCategories
    });
  } catch (error) {
    applicationLogger.error('Homepage error', error, {
      type: 'controller',
      operation: 'index',
      path: req.path
    });
    
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

