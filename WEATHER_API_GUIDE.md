# Real-Time Weather & Water Tracking System

## Overview

The Smart Crop Advisor now includes real-time weather integration and intelligent water requirement tracking. The system uses the **Open-Meteo API** (free, no API key required) to fetch live weather data and analyzes crop water needs based on current conditions.

## Features

✅ **Real-Time Weather Data**
- Temperature, Humidity, Rainfall, Cloud Cover
- Automatic location detection using GPS
- Search by city name
- Coordinates-based location support

✅ **Smart Water Analysis**
- Calculates water deficit based on crop type
- Considers soil water retention capacity
- Estimates evapotranspiration
- Provides personalized irrigation recommendations

✅ **Water Application Tracking**
- Record when water is applied
- Track water quantity applied
- Maintain water history for each crop

## Weather API Endpoints

### Get Real-Time Water Status

This endpoint provides real-time weather data and analyzes whether your crop needs watering.

```
POST /api/water/water-status
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Parameters:**

Option 1 - By City Name:
```json
{
  "city": "Mumbai",
  "recommendationId": "optional_recommendation_id"
}
```

Option 2 - By Coordinates:
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "recommendationId": "optional_recommendation_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Water status analyzed successfully",
  "data": {
    "location": {
      "city": "Mumbai",
      "country": "India",
      "coordinates": {
        "latitude": 19.0760,
        "longitude": 72.8777
      }
    },
    "weather": {
      "temperature": 28.5,
      "humidity": 72,
      "rainfall": 0,
      "cloudCover": 45,
      "timestamp": "2025-11-19T10:30:00Z"
    },
    "cropInfo": {
      "name": "Wheat",
      "waterRequirement": "Low-Medium",
      "soilType": "loamy"
    },
    "waterAnalysis": {
      "status": "adequate",
      "recommendation": "✓ Current rainfall and soil moisture are sufficient. Monitor closely.",
      "details": {
        "waterDeficit": 0,
        "availableWater": 45,
        "evapotranspiration": 8,
        "cropDemand": 40
      }
    },
    "trackingId": "water_tracking_id_123"
  }
}
```

**Water Status Values:**

| Status | Meaning | Action |
|--------|---------|--------|
| `insufficient` | Crop needs water urgently | Apply irrigation immediately |
| `adequate` | Current conditions sufficient | Continue monitoring |
| `excess` | Too much water/rainfall | Ensure proper drainage |
| `not-needed` | No watering needed | Monitor weather |

### Record Water Application

```
POST /api/water/water-applied
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "waterTrackingId": "water_tracking_id_123",
  "waterQuantity": 25
}
```

**Response:**
```json
{
  "success": true,
  "message": "Water application recorded successfully",
  "data": {
    "_id": "water_tracking_id_123",
    "userId": "user_id",
    "cropName": "Wheat",
    "waterApplied": true,
    "waterAppliedDate": "2025-11-19T10:45:00Z",
    "waterQuantity": 25,
    "waterRequirementStatus": "adequate"
  }
}
```

### Get Water Tracking History

```
GET /api/water/water-history
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "water_tracking_id_1",
      "userId": "user_id",
      "cropName": "Wheat",
      "season": "spring",
      "soilType": "loamy",
      "waterApplied": true,
      "waterAppliedDate": "2025-11-19T10:45:00Z",
      "waterQuantity": 25,
      "weatherConditions": {
        "rainfall": 0,
        "temperature": 28.5,
        "humidity": 72,
        "lastUpdated": "2025-11-19T10:30:00Z"
      },
      "waterRequirementStatus": "adequate",
      "recommendation": "✓ Current rainfall and soil moisture are sufficient.",
      "createdAt": "2025-11-19T10:30:00Z"
    }
  ]
}
```

### Get Current Water Status

```
GET /api/water/current-status/{waterTrackingId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "water_tracking_id_123",
    "userId": "user_id",
    "cropName": "Wheat",
    "waterRequirementStatus": "adequate",
    "recommendation": "✓ Current rainfall and soil moisture are sufficient.",
    "weatherConditions": {
      "temperature": 28.5,
      "humidity": 72,
      "rainfall": 0,
      "lastUpdated": "2025-11-19T10:30:00Z"
    },
    "createdAt": "2025-11-19T10:30:00Z"
  }
}
```

## Water Analysis Algorithm

### 1. **Evapotranspiration Estimation**
```
ET = (Temperature / 20) × ((100 - Humidity) / 100)
```
- Estimates water loss from soil and plants
- Higher in hot, dry conditions
- Lower in cool, humid conditions

### 2. **Soil Water Retention**
```
Available Water = Rainfall × Retention Coefficient
```

Retention by Soil Type:
- **Sandy**: 0.5 (lowest retention)
- **Silty**: 0.75
- **Loamy**: 0.7 (good retention)
- **Chalky**: 0.6
- **Clay**: 0.85
- **Peaty**: 0.9 (highest retention)

### 3. **Crop Water Demand**
Based on water requirement classification:
- **High**: 60mm
- **Medium**: 40mm
- **Low**: 20mm

### 4. **Water Deficit Calculation**
```
Water Deficit = Crop Demand - Available Water - Evapotranspiration
```

**Deficit Interpretation:**
- `> 30mm`: Urgent - Apply water immediately ⚠️
- `15-30mm`: Moderate - Plan irrigation in 2-3 days
- `< 15mm`: Adequate - Monitor closely
- `< 0`: Excess - Ensure proper drainage

## Frontend Usage

### Using the Weather & Water Component

The `WeatherWaterStatus` component is automatically displayed after getting crop recommendations:

```jsx
import WeatherWaterStatus from './components/WeatherWaterStatus';

// Use it in your dashboard or any component
<WeatherWaterStatus recommendationId={recommendation._id} />
```

### User Workflow

1. **Get Recommendations** → Select season and soil type
2. **Check Weather** → Enter city or allow GPS location access
3. **View Analysis** → See real-time weather and water status
4. **Apply Water** → Record when you water your crop
5. **Track History** → Monitor past water applications

## Real-World Examples

### Example 1: Urgent Watering Needed
```
Crop: Wheat (High water requirement)
Weather: 32°C, 45% humidity, 0mm rainfall
Soil: Loamy

Analysis:
- Available Water: 0mm
- Evapotranspiration: 12.8mm
- Crop Demand: 60mm
- Deficit: 47.2mm

Status: INSUFFICIENT ⚠️
Recommendation: "Urgent: Your crop needs watering! Deficit of 47mm. Apply irrigation immediately."
```

### Example 2: Adequate Moisture
```
Crop: Rice (High water requirement)
Weather: 25°C, 80% humidity, 15mm rainfall
Soil: Clay

Analysis:
- Available Water: 12.75mm (15 × 0.85)
- Evapotranspiration: 1.25mm
- Crop Demand: 60mm
- Deficit: 45.8mm

Status: ADEQUATE ✓
Recommendation: "✓ Current rainfall and soil moisture are sufficient. Monitor closely."
```

### Example 3: Excess Water Risk
```
Crop: Wheat (Low water requirement)
Weather: 20°C, 85% humidity, 45mm rainfall
Soil: Sandy

Analysis:
- Available Water: 22.5mm
- Rainfall: 45mm (excess detected)
- Humidity: 85% (high)

Status: EXCESS ⚡
Recommendation: "⚡ High rainfall detected (45mm). Ensure proper drainage to prevent waterlogging."
```

## Integration with Weather API

The system uses **Open-Meteo API** - a free, open-source weather API with:
- ✅ No API key required
- ✅ No rate limiting
- ✅ Global coverage
- ✅ Historical and forecast data
- ✅ Multiple weather parameters

**API Endpoints Used:**
- `https://api.open-meteo.com/v1/forecast` - Get weather data
- `https://geocoding-api.open-meteo.com/v1/search` - Get coordinates from city name

## Best Practices

### 1. Regular Monitoring
- Check water status every 2-3 days
- More frequently during dry seasons
- Adjust based on rainfall patterns

### 2. Soil Type Considerations
- **Sandy soils**: Water more frequently, less water retention
- **Clay soils**: Water less frequently, higher retention
- **Loamy soils**: Balanced, moderate watering

### 3. Seasonal Variations
- **Summer**: More frequent watering needed
- **Monsoon**: Less watering, focus on drainage
- **Winter**: Minimal watering for most crops
- **Spring/Autumn**: Moderate watering

### 4. Crop-Specific Tips
- **High water crops** (Rice, Sugarcane): Check status daily
- **Medium water crops** (Wheat, Cotton): Check every 2-3 days
- **Low water crops** (Millet, Groundnut): Weekly checks sufficient

## Error Handling

### City Not Found
```json
{
  "success": false,
  "message": "Failed to fetch weather data",
  "error": "City not found"
}
```
**Solution**: Verify city spelling and try again

### Missing Location
```json
{
  "success": false,
  "message": "Please provide either city name or coordinates"
}
```
**Solution**: Enter city name or enable GPS location access

### API Timeout
```json
{
  "success": false,
  "message": "Failed to fetch weather data",
  "error": "Request timeout"
}
```
**Solution**: Check internet connection and try again

## Future Enhancements

- [ ] Multi-day forecast with water predictions
- [ ] Soil moisture sensor integration
- [ ] SMS/Email alerts for watering
- [ ] Fertilizer recommendation based on weather
- [ ] Pest/disease prediction
- [ ] Historical weather analysis
- [ ] Machine learning for optimal watering schedule
- [ ] Integration with IoT soil sensors

## Support

For issues or questions about the weather system:
1. Check API response messages
2. Verify location information
3. Ensure stable internet connection
4. Review error handling section above
