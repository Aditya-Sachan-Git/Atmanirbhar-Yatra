const express = require('express');
const router = express.Router();

// Destination page with scroll animations
router.get('/destination', (req, res) => {
    res.render('destination');
});

router.get('/destinations', (req, res) => {
    res.redirect('/destination');
});

module.exports = router;
