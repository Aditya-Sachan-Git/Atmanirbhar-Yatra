const mongoose = require('mongoose');
const config = require('config')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true, // email should be unique
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    match: /^[0-9]{10}$/, // basic validation for 10-digit phone numbers
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // restrict to known values
    required: false
  },
  country: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false, // not required for OAuth users
    minlength: 4
  },

  // Email verification fields
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },

  // Password reset fields
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },

  // OAuth fields
  oauthProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  oauthId: {
    type: String
  },

  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
