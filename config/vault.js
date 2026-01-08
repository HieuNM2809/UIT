const vaultService = require('../services/vaultService');
const { applicationLogger } = require('./logger');

/**
 * Vault Configuration Module
 * 
 * Module này load secrets từ Vault trước khi load .env
 * Nếu Vault không available hoặc disabled, sẽ fallback về .env
 */
async function loadVaultSecrets() {
  try {
    await vaultService.initialize();
    return true;
  } catch (error) {
    applicationLogger.error('Failed to load Vault secrets', error, {
      type: 'vault',
      operation: 'loadVaultSecrets'
    });
    return false;
  }
}

module.exports = {
  loadVaultSecrets,
  vaultService
};

