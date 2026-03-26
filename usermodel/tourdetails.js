const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  startPoint: {
    type: String,
    required: true
  },
  endPoint: {
    type: String,
    required: true
  },
  pointsToBeCovered: {
    type: [String],
    default: []
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  guideBooked: {
    type: Boolean,
    default: false
  },
  tripTitle: {
    type: String,
    required: true
  },
  VechicleNums: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  costEstimate: {
    type: Number,
    default: 0
  },
  
  isCompleted: {
    type: Boolean,
    default: false
  }
});
module.exports = mongoose.model("Trip",TripSchema);
