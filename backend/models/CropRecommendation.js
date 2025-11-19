const mongoose = require('mongoose');

const cropRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter'],
    required: true,
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky'],
    required: true,
  },
  temperature: Number,
  rainfall: Number,
  humidity: Number,
  recommendedCrops: [{
    name: String,
    suitability: String, // high, medium, low
    yieldPotential: String,
    waterRequirement: String,
    harvestTime: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);
