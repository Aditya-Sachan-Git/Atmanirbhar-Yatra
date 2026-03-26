const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const user = require('../usermodel/userdetails')
const router = express.Router();
const cookieParser = require('cookie-parser')
router.use(cookieParser());
const state = require('../usermodel/states')
const config = require('config')
const private_key = config.get("private_key");
const { generateToken, generateTokenExpiry } = require('../utils/tokenGenerator');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService');
const { loginLimiter, signupLimiter, passwordResetLimiter } = require('../mw/rateLimiter');

// Home route
router.get('/', (req, res) => {
    res.render("index");
})

// Login page
router.get('/login', (req, res) => {
    res.render("login", {
        error: req.query.error,
        success: req.query.success
    })
})

// Signup route with email verification
router.post('/signup', signupLimiter, async (req, res) => {
    try {
        const { name, gender, email, phone, country, password, confirmPassword } = req.body;

        // Validate password match
        if (password !== confirmPassword) {
            return res.redirect('/login?error=passwords_dont_match');
        }

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.redirect('/login?error=email_already_exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = generateToken();
        const verificationTokenExpires = generateTokenExpiry();

        // Create user
        const newUser = await user.create({
            name,
            gender,
            email,
            phone,
            country,
            password: hash,
            emailVerified: false,
            verificationToken,
            verificationTokenExpires,
            oauthProvider: 'local'
        });

        // Send verification email
        const appUrl = config.has('app.url') ? config.get('app.url') : 'http://localhost:3000';
        const verificationUrl = `${appUrl}/verify-email/${verificationToken}`;

        await sendVerificationEmail(newUser, verificationUrl);

        // Redirect to verify email page
        res.render('verify-email', { email: newUser.email });

    } catch (err) {
        console.error('Signup error:', err);
        res.redirect('/login?error=signup_failed');
    }
})

// Login route
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body; // Fixed: was 'pass', now 'password'

        const user1 = await user.findOne({ email });

        if (!user1) {
            return res.redirect('/login?error=invalid_credentials');
        }

        // Check if user uses OAuth
        if (user1.oauthProvider !== 'local') {
            return res.redirect('/login?error=use_' + user1.oauthProvider);
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user1.password);

        if (!isMatch) {
            return res.redirect('/login?error=invalid_credentials');
        }

        // Check if email is verified
        if (!user1.emailVerified) {
            return res.render('verify-required', {
                email: user1.email,
                message: 'Please verify your email before logging in.'
            });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, private_key);
        res.cookie("token", token);

        // Get states and redirect
        const states = await state.find();
        return res.render("states", { states });

    } catch (err) {
        console.error('Login error:', err);
        return res.redirect('/login?error=login_failed');
    }
})

// Email verification route
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user1 = await user.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user1) {
            return res.render('verify-result', {
                success: false,
                message: 'Verification link is invalid or has expired.'
            });
        }

        // Mark email as verified
        user1.emailVerified = true;
        user1.verificationToken = undefined;
        user1.verificationTokenExpires = undefined;
        await user1.save();

        // Send welcome email
        await sendWelcomeEmail(user1);

        res.render('verify-result', {
            success: true,
            message: 'Email verified successfully! You can now log in.'
        });

    } catch (err) {
        console.error('Verification error:', err);
        res.render('verify-result', {
            success: false,
            message: 'An error occurred during verification.'
        });
    }
})

// Resend verification email
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user1 = await user.findOne({ email });

        if (!user1) {
            return res.redirect('/login?error=user_not_found');
        }

        if (user1.emailVerified) {
            return res.redirect('/login?success=already_verified');
        }

        // Generate new token
        const verificationToken = generateToken();
        const verificationTokenExpires = generateTokenExpiry();

        user1.verificationToken = verificationToken;
        user1.verificationTokenExpires = verificationTokenExpires;
        await user1.save();

        // Send email
        const appUrl = config.has('app.url') ? config.get('app.url') : 'http://localhost:3000';
        const verificationUrl = `${appUrl}/verify-email/${verificationToken}`;
        await sendVerificationEmail(user1, verificationUrl);

        res.render('verify-email', { email: user1.email });

    } catch (err) {
        console.error('Resend verification error:', err);
        res.redirect('/login?error=resend_failed');
    }
})

// Forgot password page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', {
        error: req.query.error,
        success: req.query.success
    });
})

// Forgot password - send reset email
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        const user1 = await user.findOne({ email });

        if (!user1) {
            // Don't reveal if user exists
            return res.render('forgot-password', {
                success: 'If an account exists with this email, you will receive a password reset link.'
            });
        }

        // Check if OAuth user
        if (user1.oauthProvider !== 'local') {
            return res.redirect('/forgot-password?error=oauth_user');
        }

        // Generate reset token
        const resetToken = generateToken();
        const resetExpires = generateTokenExpiry();

        user1.resetPasswordToken = resetToken;
        user1.resetPasswordExpires = resetExpires;
        await user1.save();

        // Send reset email
        const appUrl = config.has('app.url') ? config.get('app.url') : 'http://localhost:3000';
        const resetUrl = `${appUrl}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(user1, resetUrl);

        res.render('forgot-password', {
            success: 'Password reset link has been sent to your email.'
        });

    } catch (err) {
        console.error('Forgot password error:', err);
        res.redirect('/forgot-password?error=reset_failed');
    }
})

// Reset password page
router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user1 = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user1) {
            return res.render('reset-result', {
                success: false,
                message: 'Password reset link is invalid or has expired.'
            });
        }

        res.render('reset-password', { token });

    } catch (err) {
        console.error('Reset password page error:', err);
        res.render('reset-result', {
            success: false,
            message: 'An error occurred.'
        });
    }
})

// Reset password - update password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('reset-password', {
                token,
                error: 'Passwords do not match.'
            });
        }

        const user1 = await user.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user1) {
            return res.render('reset-result', {
                success: false,
                message: 'Password reset link is invalid or has expired.'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user1.password = hash;
        user1.resetPasswordToken = undefined;
        user1.resetPasswordExpires = undefined;
        await user1.save();

        res.render('reset-result', {
            success: true,
            message: 'Password has been reset successfully! You can now log in.'
        });

    } catch (err) {
        console.error('Reset password error:', err);
        res.render('reset-result', {
            success: false,
            message: 'An error occurred while resetting your password.'
        });
    }
})

// Logout route
router.get('/logout', (req, res) => {
    res.cookie("token", "")
    res.redirect('/login');
})

module.exports = router;