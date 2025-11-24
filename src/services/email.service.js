const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

class EmailService {
  // Existing methods...

  // Add edge cases:

  // 1. Encoding that looks like encryption
  encodeEmailContent(content) {
    return Buffer.from(content).toString('base64');
  }

  // 2. Hash for non-security purposes (caching)
  generateEmailCacheKey(email) {
    return crypto.createHash('md5')
      .update(email)
      .digest('hex');
  }

  // 3. Crypto wrapper
  getEmailEncryption() {
    return {
      encrypt: (data, key) => {
        const cipher = crypto.createCipheriv('aes-256-gcm', key, this.generateIV());
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
      }
    };
  }

  // 4. Mixed methods
  processEmailAttachment(attachment) {
    const hash = crypto.createHash('sha256');
    const encoded = Buffer.from(attachment).toString('base64');
    return {
      hash: hash.update(attachment).digest('hex'),
      content: encoded
    };
  }

  // 5. Deprecated but not vulnerable
  legacyEncryptEmail(email) {
    const cipher = crypto.createCipher('aes-256-cbc', config.email.secret);
    return cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
  }
}

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
