const mongoose = require('mongoose');

// Place subdocument schema
const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  popularityTier: {
    type: String,
    enum: ['most', 'mid', 'least'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  journalSlug: {
    type: String,
    trim: true
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  tnr:{
    type:Number,
    default:0
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  entryFee: {
    type: String,
    trim: true
  },
  timings: {
    type: String,
    trim: true
  },
  bestTimeToVisit: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    caption: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate journalSlug before save
PlaceSchema.pre('save', function (next) {
  if (!this.journalSlug && this.name) {
    this.journalSlug = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  next();
});

// City Schema
const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  specialAttraction: {
    type: String,
    trim: true
  },
  specialTags: [{
    type: String,
    trim: true
  }],
  places: [PlaceSchema],
  cityCode: {
    type: String,
    trim: true,
    uppercase: true,
    index: true
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  bestTimeToVisit: {
    type: String,
    trim: true
  },
  famousFor: [{
    type: String,
    trim: true
  }],
  nearbyAirports: [{
    name: String,
    distance: String,
    code: String
  }],
  nearbyRailwayStations: [{
    name: String,
    distance: String
  }],
  climate: {
    type: String,
    enum: ['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid', 'humid', 'dry'],
  },
  languages: [{
    type: String,
    trim: true
  }],
  currency: {
    type: String,
    default: 'INR'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('City', CitySchema);
