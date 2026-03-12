/**
 * Middleware to check if user's email is verified
 * Redirects to verification required page if not verified
 */
function checkEmailVerified(req, res, next) {
    // Check if user is logged in
    if (!req.user) {
        return res.redirect('/login');
    }

    // Check if email is verified
    if (!req.user.emailVerified) {
        return res.render('verify-required', { email: req.user.email });
    }

    next();
}

module.exports = checkEmailVerified;
