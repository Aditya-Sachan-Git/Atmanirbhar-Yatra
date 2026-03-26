const express = require("express");
const axios = require("axios");
const router = express.Router();

const ORS_API_KEY = "5b3ce3597851110001cf624849699edd1128433a830851eb7120eeba"; // Replace with your real key

async function getCoordinates(place) {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(place)}&size=1`;
    const response = await axios.get(url);
    const coords = response.data.features[0].geometry.coordinates;
    return {
        name: place,
        lon: coords[0],
        lat: coords[1]
    };
}

async function getRouteFromCoordinates(coords) {
    const coordinates = coords.map(p => [p.lon, p.lat]);
    const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        { coordinates },
        {
            headers: {
                "Authorization": ORS_API_KEY,
                "Content-Type": "application/json"
            }
        }
    );
    return res.data;
}

// Main GET route that passes places
/*
router.post('/city',async (req,res)=>{
    const places = [].concat(req.body.selectedPlaces || []);
    console.log(places);
    try {
        const coords = [];

        for (const place of places) {
            const coord = await getCoordinates(place);
            coords.push(coord);
        }

        const route = await getRouteFromCoordinates(coords);

        res.render("maps", {
            coords: JSON.stringify(coords),
            route: JSON.stringify(route)
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Failed to load route.");
    }
    
})
    */
router.post('/city',(req,res)=>{
    const places = [].concat(req.body.selectedPlaces || []);
    res.render("userinter",{selectedPlaces:places})
})
module.exports = router;
