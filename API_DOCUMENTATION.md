# Smart Crop Advisor

A full-stack web application that helps farmers get personalized crop recommendations based on season, soil type, and weather conditions.

## Features

- 🔐 User Authentication (Register/Login)
- 🌾 Crop Recommendations based on season and soil type
- 🌡️ Weather integration support (temperature, rainfall, humidity)
- 📊 Recommendation History
- 🎨 Modern, responsive UI

## Tech Stack

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password encryption

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
smartcropadvisor/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── CropRecommendation.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── crops.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── cropData.js
│   ├── .env
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── styles/
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartcropadvisor
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User logged in successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-17T..."
  }
}
```

### Crop Recommendation Endpoints

#### Get Recommendations
```
POST /crops/recommend
Authorization: Bearer {token}
Content-Type: application/json

{
  "season": "spring",
  "soilType": "loamy",
  "temperature": 25,
  "rainfall": 100,
  "humidity": 60
}

Response:
{
  "success": true,
  "message": "Crop recommendations generated successfully",
  "data": {
    "season": "spring",
    "soilType": "loamy",
    "weather": {
      "temperature": 25,
      "rainfall": 100,
      "humidity": 60
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
      }
    ],
    "timestamp": "2025-11-17T..."
  }
}
```

#### Get Recommendation History
```
GET /crops/history
Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "recommendation_id",
      "userId": "user_id",
      "season": "spring",
      "soilType": "loamy",
      "temperature": 25,
      "rainfall": 100,
      "humidity": 60,
      "recommendedCrops": [...],
      "createdAt": "2025-11-17T..."
    }
  ]
}
```

#### Get Available Options
```
GET /crops/info/options

Response:
{
  "success": true,
  "data": {
    "seasons": ["spring", "summer", "monsoon", "autumn", "winter"],
    "soilTypes": ["clay", "sandy", "loamy", "silty", "peaty", "chalky"]
  }
}
```

#### Get Specific Recommendation
```
GET /crops/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "_id": "recommendation_id",
    "userId": "user_id",
    "season": "spring",
    "soilType": "loamy",
    "recommendedCrops": [...],
    "createdAt": "2025-11-17T..."
  }
}
```

## Supported Seasons & Soil Types

### Seasons
- spring
- summer
- monsoon
- autumn
- winter

### Soil Types
- clay
- sandy
- loamy
- silty
- peaty
- chalky

## Crop Database

The application includes comprehensive crop recommendations for each season-soil type combination. Examples:

### Spring - Loamy Soil
- Wheat (High suitability)
- Barley (High suitability)
- Chickpea (High suitability)
- Potato (Medium suitability)

### Summer - Sandy Soil
- Pearl Millet (High suitability)
- Cowpea (High suitability)

### Monsoon - Clay Soil
- Rice (High suitability)
- Jute (Medium suitability)

And many more combinations for all seasons and soil types.

## Integration with Weather APIs

To integrate with external weather APIs (like OpenWeatherMap), modify the frontend's `Dashboard.jsx` to fetch real-time weather data and pass it to the recommendation endpoint:

```javascript
// Example integration with OpenWeatherMap API
const getWeatherData = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY`
  );
  const data = await response.json();
  return {
    temperature: data.main.temp,
    rainfall: data.clouds.all, // Approximate
    humidity: data.main.humidity
  };
};
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open your browser and navigate to `http://localhost:5173`

## Testing the Application

1. **Register** - Create a new account
2. **Login** - Use your credentials to log in
3. **Get Recommendations** - Select season, soil type, and optional weather data
4. **View History** - Check your past recommendations

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartcropadvisor
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## Future Enhancements

- [ ] Integration with real weather APIs (OpenWeatherMap, NOAA)
- [ ] GPS-based location detection
- [ ] Fertilizer and pesticide recommendations
- [ ] Crop price predictions
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and charts
- [ ] Email notifications for alerts
- [ ] Multi-language support

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
