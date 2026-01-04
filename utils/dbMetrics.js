/**
 * Database Metrics Helper
 * Wraps Sequelize operations to automatically record metrics
 */
const { metrics } = require('../middleware/metrics');

/**
 * Wrap a database query with metrics tracking
 * @param {Function} queryFn - The database query function
 * @param {string} operation - Operation type (select, insert, update, delete)
 * @param {string} model - Model name
 * @returns {Promise} - The query result
 */
async function trackQuery(queryFn, operation, model) {
  const startTime = Date.now();
  try {
    const result = await queryFn();
    const duration = (Date.now() - startTime) / 1000;
    metrics.recordDbQuery(operation, model, duration, 'success');
    return result;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    metrics.recordDbQuery(operation, model, duration, 'error');
    throw error;
  }
}

/**
 * Wrap Sequelize findAll
 */
function trackFindAll(model, options = {}) {
  return trackQuery(
    () => model.findAll(options),
    'select',
    model.name
  );
}

/**
 * Wrap Sequelize findOne
 */
function trackFindOne(model, options = {}) {
  return trackQuery(
    () => model.findOne(options),
    'select',
    model.name
  );
}

/**
 * Wrap Sequelize findByPk
 */
function trackFindByPk(model, pk, options = {}) {
  return trackQuery(
    () => model.findByPk(pk, options),
    'select',
    model.name
  );
}

/**
 * Wrap Sequelize create
 */
function trackCreate(model, values, options = {}) {
  return trackQuery(
    () => model.create(values, options),
    'insert',
    model.name
  );
}

/**
 * Wrap Sequelize update
 */
function trackUpdate(model, values, options = {}) {
  return trackQuery(
    () => model.update(values, options),
    'update',
    model.name
  );
}

/**
 * Wrap Sequelize destroy
 */
function trackDestroy(model, options = {}) {
  return trackQuery(
    () => model.destroy(options),
    'delete',
    model.name
  );
}

/**
 * Wrap Sequelize count
 */
function trackCount(model, options = {}) {
  return trackQuery(
    () => model.count(options),
    'select',
    model.name
  );
}

module.exports = {
  trackQuery,
  trackFindAll,
  trackFindOne,
  trackFindByPk,
  trackCreate,
  trackUpdate,
  trackDestroy,
  trackCount
};

