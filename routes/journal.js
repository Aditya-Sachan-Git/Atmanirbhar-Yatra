const express = require('express')
const City = require('../usermodel/city')
const router = express.Router();
router.get('/journal/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the city where the place with the given slug exists
    const city = await City.findOne({ 'places.name': slug }, { 'places.$': 1 });

    if (!city || !city.places || city.places.length === 0) {
      return res.status(404).send('Place not found');
    }

    // Send only the matched place
    const place = city.places[0];
    res.render("journal",{place}) // or res.render('placeDetails', { place });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;