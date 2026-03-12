const nodemailer = require('nodemailer');
const config = require('config');
const ejs = require('ejs');
const path = require('path');

// Create reusable transporter
let transporter = null;

function getTransporter() {
    if (!transporter) {
        const smtpConfig = config.has('smtp') ? config.get('smtp') : null;

        if (smtpConfig) {
            transporter = nodemailer.createTransport(smtpConfig);
        } else {
            // Fallback to console logging for development
            console.warn('⚠️  SMTP not configured. Emails will be logged to console.');
            transporter = nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true
            });
        }
    }
    return transporter;
}

/**
 * Send verification email to user
 * @param {Object} user - User object with email and name
 * @param {string} verificationUrl - Full URL for verification
 */
async function sendVerificationEmail(user, verificationUrl) {
    try {
        const mailOptions = {
            from: config.has('email.from') ? config.get('email.from') : 'noreply@localdost.com',
            to: user.email,
            subject: 'Verify Your Email - Atmanirbhar Yatra',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #60a5fa, #34d399); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #60a5fa, #34d399); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Local Dost</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${user.name}! 👋</h2>
              <p>Thank you for joining Local Dost - your trusted travel companion.</p>
              <p>Please verify your email address to start exploring amazing destinations and connecting with travelers.</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                Or copy and paste this link in your browser:<br>
                <a href="${verificationUrl}">${verificationUrl}</a>
              </p>
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                ⏰ This link will expire in 24 hours.
              </p>
            </div>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const transport = getTransporter();
        const info = await transport.sendMail(mailOptions);

        // If using streamTransport (dev mode), log the email
        if (info.message) {
            console.log('📧 VERIFICATION EMAIL (Development Mode)');
            console.log('To:', user.email);
            console.log('Subject:', mailOptions.subject);
            console.log('Verification URL:', verificationUrl);
            console.log('---');
        } else {
            console.log('✅ Verification email sent to:', user.email);
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        throw error;
    }
}

/**
 * Send password reset email to user
 * @param {Object} user - User object with email and name
 * @param {string} resetUrl - Full URL for password reset
 */
async function sendPasswordResetEmail(user, resetUrl) {
    try {
        const mailOptions = {
            from: config.has('email.from') ? config.get('email.from') : 'noreply@localdost.com',
            to: user.email,
            subject: 'Reset Your Password - Local Dost',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #60a5fa, #34d399); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #60a5fa, #34d399); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Local Dost</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request 🔐</h2>
              <p>Hi ${user.name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                Or copy and paste this link in your browser:<br>
                <a href="${resetUrl}">${resetUrl}</a>
              </p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 24 hours for your security.
              </div>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const transport = getTransporter();
        const info = await transport.sendMail(mailOptions);

        // If using streamTransport (dev mode), log the email
        if (info.message) {
            console.log('📧 PASSWORD RESET EMAIL (Development Mode)');
            console.log('To:', user.email);
            console.log('Reset URL:', resetUrl);
            console.log('---');
        } else {
            console.log('✅ Password reset email sent to:', user.email);
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error;
    }
}

/**
 * Send welcome email after verification
 * @param {Object} user - User object with email and name
 */
async function sendWelcomeEmail(user) {
    try {
        const mailOptions = {
            from: config.has('email.from') ? config.get('email.from') : 'noreply@localdost.com',
            to: user.email,
            subject: 'Welcome to Local Dost! 🎉',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #60a5fa, #34d399); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Welcome to Local Dost!</h1>
            </div>
            <div class="content">
              <h2>Your account is ready! 🎉</h2>
              <p>Hi ${user.name},</p>
              <p>Your email has been verified successfully. You're all set to start your travel journey with Local Dost!</p>
              <p>Here's what you can do:</p>
              <ul>
                <li>🗺️ Discover amazing destinations</li>
                <li>👥 Connect with local travelers</li>
                <li>📸 Share your travel experiences</li>
                <li>❤️ Create unforgettable memories</li>
              </ul>
              <p>Start exploring now and make the most of your adventures!</p>
            </div>
            <div class="footer">
              <p>Happy travels! 🌟</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const transport = getTransporter();
        await transport.sendMail(mailOptions);
        console.log('✅ Welcome email sent to:', user.email);

        return true;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Don't throw - welcome email is not critical
        return false;
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail
};
