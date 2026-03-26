// Load environment variables


// Required libraries
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config')
// OpenRouteService API key from .env file
const API_KEY = config.get("open_route_api");


// Function to geocode place names into coordinates
const geocodePlaces = async (places) => {
  const geocodeUrl = `https://api.openrouteservice.org/geocode/search`;

  const geocodePromises = places.map(place =>
    axios.get(geocodeUrl, {
      params: {
        api_key: API_KEY,
        text: place,
      }
    })
    .then(response => {
      const result = response.data.features[0].geometry.coordinates;
      return { name: place, coordinates: result };
    })
    .catch(error => {
      console.error(`Error geocoding ${place}:`, error);
      return null;
    })
  );

  const results = await Promise.all(geocodePromises);

  return results.filter(result => result !== null);
};

// Function to get optimized route from OpenRouteService
const getOptimizedRoute = async (coordinates) => {
  const routeUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

  const requestBody = {
    coordinates: coordinates,
        // This will optimize the route
    format: 'geojson'
  };

  try {
    // Request the route optimization
    const response = await axios.post(routeUrl, requestBody, {
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // Extract the optimized route coordinates
    const geojson = response.data;
    const optimizedRoute = geojson.features[0].geometry.coordinates;

    return optimizedRoute;

  } catch (error) {
    console.error('Error fetching route:', error);
    throw new Error('Error fetching route from OpenRouteService');
  }
};

// Define GET route for optimized route
router.post('/api/route', async (req, res) => {
    // console.log(req.body.selectedPlaces);
    // const places=req.body.selectedPlaces
    const places = [].concat(req.body.selectedPlaces || []);
    
//   const places = req.query.selectedPlaces ? req.query.selectedPlaces.split(',') : [];
    
  if (places.length < 2) {
    return res.status(400).json({ error: 'Please provide at least two places to generate a route.' });
  }

  try {
    // Step 1: Geocode the place names
    const coordinates = await geocodePlaces(places);
    

    if (coordinates.length < 2) {
      return res.status(400).json({ error: 'Failed to geocode some of the provided places.' });
    }
    
     
    // Step 2: Get the optimized route from OpenRouteService
    // const optimizedRoute = await getOptimizedRoute(coordinates);
    console.log(coordinates);
    res.render("travelsumm",{places:coordinates});

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching the route.' });
  }
});

// Start the Express server
module.exports = router;
