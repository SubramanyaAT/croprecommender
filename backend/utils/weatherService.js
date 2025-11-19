const axios = require('axios');

// Using Open-Meteo API (free, no API key needed)
const getWeatherByCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: latitude,
        longitude: longitude,
        current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover',
        timezone: 'auto',
      },
    });

    const current = response.data.current;
    return {
      success: true,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainfall: current.precipitation || 0,
      cloudCover: current.cloud_cover,
      weatherCode: current.weather_code,
      timestamp: new Date(current.time),
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get weather by city name using geocoding
const getWeatherByCity = async (city) => {
  try {
    // First, get coordinates for the city
    const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: city,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return {
        success: false,
        error: 'City not found',
      };
    }

    const location = geoResponse.data.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;

    // Then get weather for those coordinates
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: latitude,
        longitude: longitude,
        current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover',
        timezone: 'auto',
      },
    });

    const current = weatherResponse.data.current;
    return {
      success: true,
      city: location.name,
      country: location.country,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainfall: current.precipitation || 0,
      cloudCover: current.cloud_cover,
      weatherCode: current.weather_code,
      latitude: latitude,
      longitude: longitude,
      timestamp: new Date(current.time),
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Analyze water requirement based on weather and soil
const analyzeWaterRequirement = (weatherData, cropWaterNeeds, soilType) => {
  if (!weatherData.success) {
    return {
      status: 'unknown',
      recommendation: 'Unable to fetch weather data',
    };
  }

  const { rainfall, humidity, temperature } = weatherData;

  // Water loss due to evapotranspiration (simple estimation)
  const evapotranspiration = Math.max(0, (temperature / 20) * (100 - humidity) / 100);

  // Soil water retention capacity
  const soilRetention = {
    sandy: 0.5,
    loamy: 0.7,
    clay: 0.85,
    silty: 0.75,
    peaty: 0.9,
    chalky: 0.6,
  };

  const retention = soilRetention[soilType.toLowerCase()] || 0.7;

  // Available water from rainfall
  const availableWater = rainfall * retention;

  // Crop water demand based on needs string (e.g., "High", "Medium", "Low")
  const waterDemandMap = {
    'high': 60,
    'medium': 40,
    'low': 20,
  };

  const cropDemand = waterDemandMap[cropWaterNeeds.toLowerCase()] || 40;

  // Calculate if irrigation is needed
  const waterDeficit = Math.max(0, cropDemand - availableWater - evapotranspiration);

  let status = 'adequate';
  let recommendation = '';

  if (waterDeficit > 30) {
    status = 'insufficient';
    recommendation = `⚠️ Urgent: Your crop needs watering! Deficit of ${Math.round(waterDeficit)}mm. Apply irrigation immediately.`;
  } else if (waterDeficit > 15) {
    status = 'insufficient';
    recommendation = `Water your crop soon. Moderate deficit of ${Math.round(waterDeficit)}mm. Plan irrigation within next 2-3 days.`;
  } else if (rainfall > 40 && humidity > 80) {
    status = 'excess';
    recommendation = `⚡ High rainfall detected (${rainfall}mm). Ensure proper drainage to prevent waterlogging.`;
  } else if (availableWater >= cropDemand) {
    status = 'adequate';
    recommendation = `✓ Current rainfall and soil moisture are sufficient. Monitor closely.`;
  } else {
    status = 'adequate';
    recommendation = `✓ Water requirements are being met. Continue monitoring weather.`;
  }

  return {
    status,
    recommendation,
    waterDeficit: Math.round(waterDeficit),
    availableWater: Math.round(availableWater),
    evapotranspiration: Math.round(evapotranspiration),
    cropDemand,
    rainfall,
    humidity,
    temperature,
  };
};

module.exports = {
  getWeatherByCoordinates,
  getWeatherByCity,
  analyzeWaterRequirement,
};
