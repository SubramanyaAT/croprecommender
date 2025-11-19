# Smart Crop Advisor - API Examples & Curl Commands

## Complete Examples for Testing

### Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ Authentication Examples

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com"
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "password123"
  }'
```

### Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 2️⃣ Crop Recommendation Examples

### Get Crop Recommendations
```bash
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "season": "spring",
    "soilType": "loamy",
    "temperature": 25,
    "rainfall": 50,
    "humidity": 65
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Crop recommendations generated successfully",
  "data": {
    "season": "spring",
    "soilType": "loamy",
    "weather": {
      "temperature": 25,
      "rainfall": 50,
      "humidity": 65
    },
    "recommendedCrops": [
      {
        "name": "Wheat",
        "suitability": "high",
        "yieldPotential": "5-6 tons/ha",
        "waterRequirement": "Low-Medium",
        "harvestTime": "120-140 days"
      },
      {
        "name": "Barley",
        "suitability": "high",
        "yieldPotential": "4-5 tons/ha",
        "waterRequirement": "Low",
        "harvestTime": "110-130 days"
      },
      {
        "name": "Chickpea",
        "suitability": "high",
        "yieldPotential": "2-3 tons/ha",
        "waterRequirement": "Low",
        "harvestTime": "100-120 days"
      }
    ],
    "timestamp": "2025-11-19T10:30:00Z"
  }
}
```

### Get Recommendation History
```bash
curl -X GET http://localhost:5000/api/crops/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Available Seasons and Soil Types
```bash
curl -X GET http://localhost:5000/api/crops/info/options
```

**Response:**
```json
{
  "success": true,
  "data": {
    "seasons": ["spring", "summer", "monsoon", "autumn", "winter"],
    "soilTypes": ["clay", "sandy", "loamy", "silty", "peaty", "chalky"]
  }
}
```

---

## 3️⃣ Weather & Water Status Examples

### Check Water Status by City
```bash
curl -X POST http://localhost:5000/api/water/water-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "city": "Mumbai"
  }'
```

### Check Water Status by Coordinates
```bash
curl -X POST http://localhost:5000/api/water/water-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "latitude": 19.0760,
    "longitude": 72.8777
  }'
```

### Check Water Status with Recommendation ID
```bash
curl -X POST http://localhost:5000/api/water/water-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "city": "Delhi",
    "recommendationId": "507f1f77bcf86cd799439011"
  }'
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
      "rainfall": 5,
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
        "waterDeficit": 12,
        "availableWater": 35,
        "evapotranspiration": 7,
        "cropDemand": 54
      }
    },
    "trackingId": "507f2f77bcf86cd799439012"
  }
}
```

### Record Water Application
```bash
curl -X POST http://localhost:5000/api/water/water-applied \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "waterTrackingId": "507f2f77bcf86cd799439012",
    "waterQuantity": 25
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Water application recorded successfully",
  "data": {
    "_id": "507f2f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "cropName": "Wheat",
    "waterApplied": true,
    "waterAppliedDate": "2025-11-19T10:45:00Z",
    "waterQuantity": 25,
    "waterRequirementStatus": "adequate"
  }
}
```

### Get Water Tracking History
```bash
curl -X GET http://localhost:5000/api/water/water-history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Current Water Status
```bash
curl -X GET http://localhost:5000/api/water/current-status/507f2f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Flow

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Farmer","email":"farmer@test.com","password":"test123"}' \
  | jq -r '.token')

# 2. Get recommendations
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"season":"spring","soilType":"loamy"}'

# 3. Check water status
curl -X POST http://localhost:5000/api/water/water-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"city":"Mumbai"}'
```

### Scenario 2: Different Seasons

**Summer - High Temperature:**
```bash
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "season": "summer",
    "soilType": "sandy",
    "temperature": 38,
    "rainfall": 0,
    "humidity": 35
  }'
```

**Monsoon - High Rainfall:**
```bash
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "season": "monsoon",
    "soilType": "clay",
    "temperature": 26,
    "rainfall": 60,
    "humidity": 85
  }'
```

---

## 📊 Using Postman (Recommended)

### Setup Postman Environment
1. Create new collection: "Smart Crop Advisor"
2. Create environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (empty, will fill after login)

### Save Token from Login Response
In Postman, after login request:
```javascript
// Tests tab
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

### Use Token in Subsequent Requests
```
Authorization: Bearer {{token}}
```

---

## 🔍 Error Examples

### Missing Authentication Token
```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Response:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Invalid Credentials
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@test.com","password":"wrong"}'
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### City Not Found
```bash
curl -X POST http://localhost:5000/api/water/water-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"city":"InvalidCityName123"}'
```

**Response:**
```json
{
  "success": false,
  "message": "Failed to fetch weather data",
  "error": "City not found"
}
```

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"season":"spring"}'
```

**Response:**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

---

## 📱 JavaScript/Fetch Examples

### Register User
```javascript
const registerUser = async () => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Farmer Name',
      email: 'farmer@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

### Get Crop Recommendations
```javascript
const getRecommendations = async (season, soilType) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/crops/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      season,
      soilType,
      temperature: 25,
      rainfall: 50,
      humidity: 65
    })
  });
  
  return await response.json();
};
```

### Check Water Status
```javascript
const checkWaterStatus = async (city) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/water/water-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ city })
  });
  
  return await response.json();
};
```

---

## 🛠️ Using Axios Examples

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to all requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
const register = (name, email, password) =>
  API.post('/auth/register', { name, email, password });

// Get Recommendations
const recommend = (season, soilType) =>
  API.post('/crops/recommend', { season, soilType });

// Check Water
const checkWater = (city) =>
  API.post('/water/water-status', { city });

// Usage
register('Name', 'email@test.com', 'pass123')
  .then(res => console.log(res.data));
```

---

## 📊 Data Validation Examples

### Valid Seasons
```
"spring", "summer", "monsoon", "autumn", "winter"
```

### Valid Soil Types
```
"clay", "sandy", "loamy", "silty", "peaty", "chalky"
```

### Valid Water Status
```
"adequate", "insufficient", "excess", "not-needed"
```

### Valid Suitability Levels
```
"high", "medium", "low"
```

---

## 🔗 Complete API Flow Chart

```
START
  ↓
REGISTER/LOGIN → Get JWT Token
  ↓
GET RECOMMENDATIONS (season + soilType) → Crop List
  ↓
CHECK WEATHER (city/coordinates) → Weather Data
  ↓
ANALYZE WATER → Water Status
  ↓
RECORD WATER (if needed) → Save Application
  ↓
VIEW HISTORY → Track Progress
  ↓
END
```

---

## 💾 Database Query Examples

### MongoDB: Find User
```javascript
db.users.findOne({ email: "farmer@example.com" })
```

### MongoDB: Get All Recommendations for User
```javascript
db.croprecommendations.find({ userId: ObjectId("...") })
```

### MongoDB: Get Water Tracking History
```javascript
db.watertrackings.find({ userId: ObjectId("...") }).sort({ createdAt: -1 })
```

---

## 📈 Performance Tips

1. **Cache tokens** - Don't fetch on every request
2. **Batch API calls** - Combine multiple requests when possible
3. **Use indices** - Database indexes on userId, email
4. **Lazy load** - Load recommendations only when needed
5. **Debounce** - Debounce weather checks (min 5 min gap)

---

## ✅ Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Weather fetched OK |
| 201 | Created | User registered |
| 400 | Bad Request | Missing fields |
| 401 | Unauthorized | No token |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource missing |
| 500 | Server Error | Database error |

---

**Last Updated: November 2025**
**API Version: 1.0**
