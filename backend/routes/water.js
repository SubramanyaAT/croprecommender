const express = require('express');
const WaterTracking = require('../models/WaterTracking');
const CropRecommendation = require('../models/CropRecommendation');
const { protect } = require('../middleware/auth');
const { getWeatherByCity, getWeatherByCoordinates, analyzeWaterRequirement } = require('../utils/weatherService');

const router = express.Router();

// Get real-time weather and water status
router.post('/water-status', protect, async (req, res) => {
  try {
    const { city, latitude, longitude, recommendationId } = req.body;

    if (!city && (!latitude || !longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either city name or coordinates (latitude, longitude)',
      });
    }

    // Fetch weather data
    let weatherData;
    if (city) {
      weatherData = await getWeatherByCity(city);
    } else {
      weatherData = await getWeatherByCoordinates(latitude, longitude);
    }

    if (!weatherData.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch weather data',
        error: weatherData.error,
      });
    }

    // Get recommendation if provided
    let cropWaterNeeds = 'Medium';
    let soilType = 'loamy';
    let cropName = 'Unknown';

    if (recommendationId) {
      const recommendation = await CropRecommendation.findById(recommendationId);
      if (recommendation && recommendation.userId.toString() === req.user.id) {
        cropName = recommendation.recommendedCrops[0]?.name || 'Crop';
        cropWaterNeeds = recommendation.recommendedCrops[0]?.waterRequirement || 'Medium';
        soilType = recommendation.soilType;
      }
    }

    // Analyze water requirement
    const waterAnalysis = analyzeWaterRequirement(weatherData, cropWaterNeeds, soilType);

    // Create or update water tracking record
    const waterTracking = new WaterTracking({
      userId: req.user.id,
      recommendationId: recommendationId || undefined,
      cropName,
      soilType,
      weatherConditions: {
        rainfall: weatherData.rainfall,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        lastUpdated: new Date(),
      },
      waterRequirementStatus: waterAnalysis.status,
      recommendation: waterAnalysis.recommendation,
    });

    await waterTracking.save();

    res.status(200).json({
      success: true,
      message: 'Water status analyzed successfully',
      data: {
        location: {
          city: weatherData.city || city || 'Custom Location',
          country: weatherData.country || '',
          coordinates: {
            latitude: latitude || weatherData.latitude,
            longitude: longitude || weatherData.longitude,
          },
        },
        weather: {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          rainfall: weatherData.rainfall,
          cloudCover: weatherData.cloudCover,
          timestamp: weatherData.timestamp,
        },
        cropInfo: {
          name: cropName,
          waterRequirement: cropWaterNeeds,
          soilType,
        },
        waterAnalysis: {
          status: waterAnalysis.status,
          recommendation: waterAnalysis.recommendation,
          details: {
            waterDeficit: waterAnalysis.waterDeficit,
            availableWater: waterAnalysis.availableWater,
            evapotranspiration: waterAnalysis.evapotranspiration,
            cropDemand: waterAnalysis.cropDemand,
          },
        },
        trackingId: waterTracking._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update water application status
router.post('/water-applied', protect, async (req, res) => {
  try {
    const { waterTrackingId, waterQuantity } = req.body;

    if (!waterTrackingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide waterTrackingId',
      });
    }

    const waterTracking = await WaterTracking.findById(waterTrackingId);

    if (!waterTracking) {
      return res.status(404).json({
        success: false,
        message: 'Water tracking record not found',
      });
    }

    if (waterTracking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    waterTracking.waterApplied = true;
    waterTracking.waterAppliedDate = new Date();
    waterTracking.waterQuantity = waterQuantity || null;

    await waterTracking.save();

    res.status(200).json({
      success: true,
      message: 'Water application recorded successfully',
      data: waterTracking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get water tracking history
router.get('/water-history', protect, async (req, res) => {
  try {
    const waterHistory = await WaterTracking.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: waterHistory.length,
      data: waterHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current water status for a crop
router.get('/current-status/:waterTrackingId', protect, async (req, res) => {
  try {
    const waterTracking = await WaterTracking.findById(req.params.waterTrackingId);

    if (!waterTracking) {
      return res.status(404).json({
        success: false,
        message: 'Water tracking record not found',
      });
    }

    if (waterTracking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: waterTracking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
