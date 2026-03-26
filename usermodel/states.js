const mongoose = require('mongoose')


const state = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Prevent duplicates
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    image: {
        type: String,
        required: false, // Optional but useful for UI
    },
    popularity: {
        type: String,
        enum: ["high", "medium", "low"], // More readable than numbers
        default: "medium"
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        required: false,
        description: "Useful for search/filtering (e.g., 'mountains', 'beaches')"
    },
    climate: {
        type: String,
        enum: ['hot', 'cold', 'moderate', 'varied'],
        default: 'moderate',
        description: "Overall climate info for better trip planning"
    },
    bestTimeToVisit: {
        type: String,
        required: false,
        description: "Helpful for travelers to plan trips"
    }
});
module.exports = mongoose.model("StateSchema",state);
