const crypto = require('crypto');

/**
 * Generate a random token for email verification or password reset
 * @returns {string} - 32-byte hex token
 */
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate token expiry time (24 hours from now)
 * @returns {Date}
 */
function generateTokenExpiry() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
}

module.exports = {
    generateToken,
    generateTokenExpiry
};
