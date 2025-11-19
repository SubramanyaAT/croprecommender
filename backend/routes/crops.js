const express = require('express');
const CropRecommendation = require('../models/CropRecommendation');
const { protect } = require('../middleware/auth');
const { getRecommendations } = require('../utils/cropData');

const router = express.Router();

// Get crop recommendations
router.post('/recommend', protect, async (req, res) => {
  try {
    const { season, soilType, temperature, rainfall, humidity } = req.body;

    if (!season || !soilType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide season and soil type',
      });
    }

    // Get recommended crops from database
    const recommendedCrops = getRecommendations(season, soilType);

    if (recommendedCrops.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recommendations found for the given parameters',
      });
    }

    // Create recommendation record
    const recommendation = new CropRecommendation({
      userId: req.user.id,
      season,
      soilType,
      temperature: temperature || null,
      rainfall: rainfall || null,
      humidity: humidity || null,
      recommendedCrops,
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: {
        season,
        soilType,
        weather: {
          temperature: temperature || 'Not provided',
          rainfall: rainfall || 'Not provided',
          humidity: humidity || 'Not provided',
        },
        recommendedCrops,
        timestamp: recommendation.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's recommendation history
router.get('/history', protect, async (req, res) => {
  try {
    const recommendations = await CropRecommendation.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recommendation by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const recommendation = await CropRecommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found',
      });
    }

    if (recommendation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this recommendation',
      });
    }

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get available seasons and soil types
router.get('/info/options', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      seasons: ['spring', 'summer', 'monsoon', 'autumn', 'winter'],
      soilTypes: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky'],
    },
  });
});

module.exports = router;
