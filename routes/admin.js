const express = require('express')
const states = require('../usermodel/states')
const slugify = require('slugify');
const City = require('../usermodel/city')
const router = express.Router();

// Main admin page - shows both states and cities tabs
router.get('/admin/states', async (req, res) => {
  const state1 = await states.find();
  res.render('admin', { message: null, state1 });
})

router.post('/admin/states', async (req, res) => {
  try {
    const { name, slug, image, popularity, description, climate, bestTimeToVisit, recommendedDuration, addedBy, tags, isPublished } = req.body;

    if (name && slug && popularity) {
      const slug1 = slugify(slug, { lower: true });
      const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];

      const state = await states.create({
        name,
        slug: slug1,
        image,
        popularity,
        description,
        climate,
        bestTimeToVisit,
        recommendedDuration,
        addedBy,
        tags: tagsArray,
        isPublished: isPublished === 'true'
      });

      const state1 = await states.find();
      res.render('admin', { message: "✅ State added successfully!", state1 });
    } else {
      const state1 = await states.find();
      res.render('admin', { message: "❌ Please fill all required fields", state1 });
    }
  } catch (err) {
    console.error(err);
    const state1 = await states.find();
    res.render('admin', { message: "❌ Error adding state", state1 });
  }
})

router.get('/admin/city', async (req, res) => {
  const state1 = await states.find();
  res.render('admin', { message: null, state1 });
})

router.post('/admin/city', async (req, res) => {
  try {
    const {
      name, stateId, cityCode, description, bestTimeToVisit,
      famousFor, climate, languages, placesJson
    } = req.body;

    const city = new City({
      name,
      stateId,
      cityCode,
      description,
      bestTimeToVisit,
      famousFor: famousFor ? famousFor.split(',').map(f => f.trim()) : [],
      climate,
      languages: languages ? languages.split(',').map(l => l.trim()) : [],
      places: placesJson ? JSON.parse(placesJson) : []
    });

    await city.save();
    const state1 = await states.find();
    res.render('admin', { message: "✅ City added successfully!", state1 });
  } catch (err) {
    console.error(err);
    const state1 = await states.find();
    res.render('admin', { message: "❌ Error adding city: " + err.message, state1 });
  }
});

module.exports = router;