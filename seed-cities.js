const mongoose = require('mongoose');
const config = require('config');
const State = require('./usermodel/states');
const City = require('./usermodel/city');

async function seed() {
    await mongoose.connect(`${config.get("mongodb_uri")}/newdatabse`);
    console.log("✅ Database connected");

    // Find state IDs
    const tamilNadu = await State.findOne({ name: /tamil\s*nadu/i });
    const karnataka = await State.findOne({ name: /karnataka/i });

    if (!tamilNadu) {
        console.log("❌ Tamil Nadu state not found in DB. Available states:");
        const all = await State.find({}, 'name');
        all.forEach(s => console.log(`   - ${s.name} (${s._id})`));
        console.log("\nPlease add Tamil Nadu state first via /admin/states, or provide the correct state name.");
    }

    if (!karnataka) {
        console.log("❌ Karnataka state not found in DB. Available states:");
        const all = await State.find({}, 'name');
        all.forEach(s => console.log(`   - ${s.name} (${s._id})`));
        console.log("\nPlease add Karnataka state first via /admin/states, or provide the correct state name.");
    }

    if (!tamilNadu || !karnataka) {
        await mongoose.disconnect();
        return;
    }

    console.log(`Found Tamil Nadu: ${tamilNadu._id}`);
    console.log(`Found Karnataka: ${karnataka._id}`);

    const cities = [
        // ── CHENNAI ──
        {
            name: "Chennai",
            stateId: tamilNadu._id,
            description: "Chennai is the capital of Tamil Nadu, known for its coastal charm, rich cultural heritage, classical arts, and modern IT industry.",
            specialAttraction: "Marina Beach",
            specialTags: ["beaches", "culture", "heritage", "metro city"],
            bestTimeToVisit: "November to February",
            famousFor: ["Beaches", "South Indian Food", "Temples", "Carnatic Music"],
            climate: "tropical",
            languages: ["Tamil", "English"],
            cityCode: "CHN",
            coordinates: { latitude: 13.0827, longitude: 80.2707 },
            places: [
                {
                    name: "Marina Beach",
                    popularityTier: "most",
                    description: "One of the longest urban beaches in the world.",
                    entryFee: "Free",
                    timings: "Open all day",
                    bestTimeToVisit: "Early morning or evening",
                    tags: ["beach", "photography", "leisure"]
                },
                {
                    name: "Kapaleeshwarar Temple",
                    popularityTier: "most",
                    description: "Historic Dravidian-style temple dedicated to Lord Shiva.",
                    entryFee: "Free",
                    timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:30 PM",
                    bestTimeToVisit: "Morning hours",
                    tags: ["temple", "heritage", "spirituality"]
                },
                {
                    name: "Fort St. George",
                    popularityTier: "mid",
                    description: "British-era fort housing a museum and government offices.",
                    entryFee: "₹15",
                    timings: "9:00 AM - 5:00 PM",
                    bestTimeToVisit: "November-February",
                    tags: ["history", "museum", "architecture"]
                }
            ]
        },

        // ── MADURAI ──
        {
            name: "Madurai",
            stateId: tamilNadu._id,
            description: "Madurai is one of India's oldest cities, famous for its temples, Tamil culture, and vibrant street life.",
            specialAttraction: "Meenakshi Amman Temple",
            specialTags: ["temple city", "heritage", "culture"],
            bestTimeToVisit: "October to March",
            famousFor: ["Temples", "Jigarthanda drink", "Tamil heritage"],
            climate: "tropical",
            languages: ["Tamil", "English"],
            cityCode: "MDU",
            coordinates: { latitude: 9.9252, longitude: 78.1198 },
            places: [
                {
                    name: "Meenakshi Amman Temple",
                    popularityTier: "most",
                    description: "Iconic temple complex known for towering colorful gopurams.",
                    entryFee: "Free",
                    timings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
                    bestTimeToVisit: "Early morning",
                    tags: ["temple", "architecture", "heritage"]
                },
                {
                    name: "Thirumalai Nayakkar Mahal",
                    popularityTier: "mid",
                    description: "17th-century palace showcasing Indo-Saracenic architecture.",
                    entryFee: "₹50",
                    timings: "9:00 AM - 5:00 PM",
                    bestTimeToVisit: "Evening light show time",
                    tags: ["palace", "history", "photography"]
                },
                {
                    name: "Gandhi Memorial Museum",
                    popularityTier: "least",
                    description: "Museum dedicated to Mahatma Gandhi's life and legacy.",
                    entryFee: "Free",
                    timings: "10:00 AM - 5:00 PM",
                    bestTimeToVisit: "Winter months",
                    tags: ["museum", "history", "education"]
                }
            ]
        },

        // ── BENGALURU ──
        {
            name: "Bengaluru",
            stateId: karnataka._id,
            description: "Bengaluru, India's tech hub, blends modern urban lifestyle with gardens, pleasant weather, and historic landmarks.",
            specialAttraction: "Lalbagh Botanical Garden",
            specialTags: ["IT hub", "gardens", "nightlife"],
            bestTimeToVisit: "October to February",
            famousFor: ["IT Industry", "Gardens", "Craft Beer", "Startups"],
            climate: "tropical",
            languages: ["Kannada", "English", "Hindi", "Tamil"],
            cityCode: "BLR",
            coordinates: { latitude: 12.9716, longitude: 77.5946 },
            places: [
                {
                    name: "Lalbagh Botanical Garden",
                    popularityTier: "most",
                    description: "Famous botanical garden with rare plants and glasshouse.",
                    entryFee: "₹30",
                    timings: "6:00 AM - 7:00 PM",
                    bestTimeToVisit: "Morning",
                    tags: ["garden", "nature", "photography"]
                },
                {
                    name: "Bangalore Palace",
                    popularityTier: "mid",
                    description: "Tudor-style palace inspired by Windsor Castle.",
                    entryFee: "₹230 approx",
                    timings: "10:00 AM - 5:30 PM",
                    bestTimeToVisit: "Winter months",
                    tags: ["palace", "history", "architecture"]
                },
                {
                    name: "Cubbon Park",
                    popularityTier: "mid",
                    description: "Large green park in the city center.",
                    entryFee: "Free",
                    timings: "6:00 AM - 6:00 PM",
                    bestTimeToVisit: "Morning or evening",
                    tags: ["park", "leisure", "nature"]
                }
            ]
        },

        // ── MYSURU ──
        {
            name: "Mysuru",
            stateId: karnataka._id,
            description: "Mysuru is known for royal heritage, grand palaces, silk sarees, and vibrant Dasara celebrations.",
            specialAttraction: "Mysore Palace",
            specialTags: ["heritage", "palace city", "culture"],
            bestTimeToVisit: "October to March",
            famousFor: ["Mysore Palace", "Sandalwood", "Silk Sarees", "Dasara Festival"],
            climate: "tropical",
            languages: ["Kannada", "English", "Tamil"],
            cityCode: "MYS",
            coordinates: { latitude: 12.2958, longitude: 76.6394 },
            places: [
                {
                    name: "Mysore Palace",
                    popularityTier: "most",
                    description: "Magnificent royal palace illuminated on weekends.",
                    entryFee: "₹100 approx",
                    timings: "10:00 AM - 5:30 PM",
                    bestTimeToVisit: "Evening illumination time",
                    tags: ["palace", "heritage", "photography"]
                },
                {
                    name: "Chamundi Hills",
                    popularityTier: "most",
                    description: "Hilltop temple with panoramic city views.",
                    entryFee: "Free",
                    timings: "7:30 AM - 2:00 PM, 3:30 PM - 6:00 PM",
                    bestTimeToVisit: "Early morning",
                    tags: ["temple", "viewpoint", "nature"]
                },
                {
                    name: "Brindavan Gardens",
                    popularityTier: "mid",
                    description: "Terraced gardens famous for musical fountain show.",
                    entryFee: "₹50",
                    timings: "6:00 AM - 8:00 PM",
                    bestTimeToVisit: "Evening fountain show",
                    tags: ["garden", "photography", "leisure"]
                }
            ]
        }
    ];

    let added = 0;
    for (const cityData of cities) {
        // Check if city already exists
        const existing = await City.findOne({ name: cityData.name, stateId: cityData.stateId });
        if (existing) {
            console.log(`⚠️  ${cityData.name} already exists, skipping.`);
            continue;
        }
        const city = new City(cityData);
        await city.save();
        console.log(`✅ Added ${cityData.name} with ${cityData.places.length} places`);
        added++;
    }

    console.log(`\n🎉 Done! ${added} cities added.`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error("❌ Error:", err);
    mongoose.disconnect();
});
