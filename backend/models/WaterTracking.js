const mongoose = require('mongoose');

const waterTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recommendationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CropRecommendation',
    required: false,
  },
  cropName: {
    type: String,
    required: true,
  },
  season: String,
  soilType: String,
  waterApplied: {
    type: Boolean,
    default: false,
  },
  waterAppliedDate: Date,
  waterQuantity: Number, // in mm or liters per sqm
  weatherConditions: {
    rainfall: Number,
    temperature: Number,
    humidity: Number,
    lastUpdated: Date,
  },
  waterRequirementStatus: {
    type: String,
    enum: ['adequate', 'insufficient', 'excess', 'not-needed'],
    default: 'not-needed',
  },
  recommendation: String, // Water advice
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WaterTracking', waterTrackingSchema);
