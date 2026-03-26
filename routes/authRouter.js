const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

// Google OAuth routes
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login?error=oauth_failed',
        session: true
    }),
    async (req, res) => {
        // Successful authentication
        const state = require('../usermodel/states');
        const states = await state.find();
        res.render('states', { states });
    }
);

// Facebook OAuth routes (placeholder for future implementation)
router.get('/auth/facebook', (req, res) => {
    res.redirect('/login?error=facebook_not_configured');
});

router.get('/auth/facebook/callback', (req, res) => {
    res.redirect('/login?error=facebook_not_configured');
});

module.exports = router;
