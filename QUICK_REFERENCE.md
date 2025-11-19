# 🌾 Smart Crop Advisor - Quick Reference Card

## 🚀 Start the Application

### Terminal 1 - Backend (Port 5000)
```bash
cd d:\CC\smartcropadvisor\backend
npm run dev
```

### Terminal 2 - Frontend (Port 5173)
```bash
cd d:\CC\smartcropadvisor\frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 📋 User Login Flow

1. **Register** → Enter name, email, password → Token saved
2. **Login** → Email & password → Redirected to dashboard
3. **Dashboard** → Select season & soil type → Get recommendations
4. **Weather Check** → Enter city or enable GPS → See water status
5. **Record Water** → When you water the crop → Save for history
6. **View History** → Check past recommendations → Track patterns

---

## 🎯 Key Features at a Glance

| Feature | Purpose | How to Use |
|---------|---------|-----------|
| **Crop Recommendations** | Get best crops for your conditions | Select season + soil type |
| **Real-Time Weather** | See current weather conditions | Enter city or use GPS |
| **Water Analysis** | Know if crop needs water | Check water status after weather |
| **Water Tracking** | Record when you water | Click "Record Water Application" |
| **History View** | Track your actions | Open history section |

---

## 🌍 Water Status Meanings

```
💧 INSUFFICIENT (Red)
├─ Action: Water your crop NOW
├─ Timing: Immediate irrigation needed
└─ Water Deficit: > 30mm

✓ ADEQUATE (Green)
├─ Action: Continue monitoring
├─ Timing: No action needed
└─ Conditions: Sufficient moisture

💦 EXCESS (Blue)
├─ Action: Check drainage
├─ Timing: Prevent waterlogging
└─ Condition: Too much water

❓ UNKNOWN (Gray)
├─ Action: Check weather data
├─ Cause: Unable to analyze
└─ Solution: Try again later
```

---

## 📊 Water Analysis Numbers

```
Water Deficit = Crop Demand - Available Water - Evapotranspiration

Examples:
- 0mm = Perfect balance
- 10mm = Monitor closely
- 25mm = Plan to water soon
- 40mm = Water immediately
```

---

## 🌾 Crops by Season

### Spring 🌱
- Wheat, Barley, Chickpea, Potato

### Summer ☀️
- Maize, Sugarcane, Sorghum, Millet

### Monsoon 🌧️
- Rice, Lentil, Green Gram, Black Gram

### Autumn 🍂
- Wheat, Gram, Groundnut, Sesame

### Winter ❄️
- Wheat, Pea, Potato, Mustard, Carrot

---

## 🌍 Soil Types & Water Retention

| Soil Type | Retention | Best For | Watering |
|-----------|-----------|----------|----------|
| **Sandy** | Low (50%) | Groundnut, Watermelon | Frequent |
| **Silty** | Medium (75%) | Various crops | Moderate |
| **Loamy** | Good (70%) | Most crops | Balanced |
| **Chalky** | Medium (60%) | Legumes | Frequent |
| **Clay** | High (85%) | Rice | Less frequent |
| **Peaty** | Very High (90%) | Specialized | Rare |

---

## 🔐 Account Security

✅ Passwords are hashed with bcryptjs
✅ JWT tokens last 7 days
✅ Token stored in browser (localStorage)
✅ Only your data visible to you
✅ Login required for all features

**Note:** JWT_SECRET should be changed in production

---

## 🌐 API Endpoints Summary

### Authentication
```
POST   /api/auth/register     → Create account
POST   /api/auth/login        → Login user
GET    /api/auth/me           → Get profile
```

### Crops
```
POST   /api/crops/recommend   → Get recommendations
GET    /api/crops/history     → View history
GET    /api/crops/info/options → Get seasons/soils
```

### Weather & Water
```
POST   /api/water/water-status    → Check water need
POST   /api/water/water-applied   → Record watering
GET    /api/water/water-history   → View history
```

---

## 💡 Pro Tips

### 1. Best Time to Check
- **Summer**: Daily
- **Spring/Autumn**: Every 2-3 days
- **Monsoon**: Every 3-5 days
- **Winter**: Weekly

### 2. Location Accuracy
- Use full city name (e.g., "Mumbai" not "MUM")
- GPS is more accurate than city name
- Update location if you move

### 3. Water Quantity
- Optional to record amount
- Helps track patterns
- In mm or liters/sqm

### 4. Crop Selection
- Choose crops suited to your season
- Consider soil type carefully
- Check high suitability crops first

### 5. Weather Monitoring
- Heavy rain = less watering needed
- High humidity = less watering needed
- High temp = more watering needed
- Rainfall data = water added automatically

---

## 🔧 Troubleshooting

### Backend won't start
```
✓ Check MongoDB connection in .env
✓ Verify port 5000 is free
✓ Run: npm install
```

### Can't login
```
✓ Check backend is running (port 5000)
✓ Clear browser cache
✓ Verify credentials correct
```

### Weather not loading
```
✓ Check internet connection
✓ Verify city spelling
✓ Allow GPS permission
✓ Try refreshing page
```

### Water status shows "Unknown"
```
✓ Check weather data loaded
✓ Ensure crop recommendation exists
✓ Verify location is correct
```

---

## 📊 Example: Complete Water Analysis

```
SCENARIO: Growing Wheat in Mumbai, Spring Season

Step 1: Get Recommendation
├─ Season: Spring ✓
├─ Soil Type: Loamy ✓
└─ Crop: Wheat (High suitability) ✓

Step 2: Check Weather
├─ Temperature: 28°C
├─ Humidity: 65%
├─ Rainfall: 5mm
└─ Cloud Cover: 30%

Step 3: Water Analysis
├─ Crop Demand: 40mm
├─ Available Water: 3.5mm (5mm × 0.7 retention)
├─ Evapotranspiration: 7.5mm
└─ Water Deficit: 29mm

Step 4: Recommendation
├─ Status: INSUFFICIENT 💧
├─ Action: Water crop soon
├─ Timing: Within 1-2 days
└─ Amount: Apply 30mm irrigation

Step 5: Record Action
├─ Click: "Record Water Application"
├─ Enter: 30mm (optional)
├─ Save: ✓ Recorded

Step 6: Track History
├─ View: Water application date
├─ See: Previous recommendations
└─ Analyze: Seasonal patterns
```

---

## 📱 Browser Requirements

✅ Chrome/Edge/Firefox (Latest)
✅ JavaScript enabled
✅ Cookies enabled (for token)
✅ Location access (for GPS)
✅ Stable internet connection

---

## 🎯 Dashboard Layout

```
┌─────────────────────────────────────┐
│  🌾 Smart Crop Advisor              │
│  Welcome, [User Name]  [Logout]     │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Get Crop Recommendations     │   │
│  │ [Season] [Soil Type]         │   │
│  │ [Temperature] [Rainfall]     │   │
│  │ [Get Recommendations Button] │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Real-Time Weather & Water    │   │
│  │ [City] [GPS Button]          │   │
│  │ [Check Status Button]        │   │
│  │ Weather Cards & Analysis     │   │
│  │ [Record Water Button]        │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ [Show History]               │   │
│  │ History List (if showing)    │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔑 Key Files

**Backend**
- `index.js` - Main server
- `routes/water.js` - Weather endpoints
- `utils/weatherService.js` - Weather logic
- `models/WaterTracking.js` - Data model

**Frontend**
- `Dashboard.jsx` - Main page
- `WeatherWaterStatus.jsx` - Weather widget
- `api.js` - API client

**Database**
- User collection
- CropRecommendation collection
- WaterTracking collection

---

## 📞 Quick Support

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env or kill process |
| Module not found | Run `npm install` |
| API not responding | Check backend running |
| GPS not working | Allow permission or use city |
| Weather shows error | Check city spelling |
| Can't save water | Ensure logged in |

---

## 🎓 Learning Path

1. **Day 1**: Register, explore recommendations
2. **Day 2**: Enable weather, check location
3. **Day 3**: Record water applications
4. **Day 4**: Review history, spot patterns
5. **Day 5+**: Fine-tune based on results

---

## 🌟 Features Highlights

| Feature | Benefit |
|---------|---------|
| Real-time weather | Make informed decisions |
| Smart analysis | Know exactly when to water |
| GPS location | No manual entry needed |
| Water tracking | Track your actions |
| History | Learn seasonal patterns |
| Multiple crops | Try different varieties |
| Soil consideration | Account for soil type |
| Mobile friendly | Use on phone too |

---

## 🚀 What's Next?

1. Explore crop recommendations
2. Check real-time weather
3. Track water applications
4. View your history
5. Adjust strategy based on data
6. Achieve better yields!

---

## 📚 Documentation

- **API_DOCUMENTATION.md** - All API endpoints
- **WEATHER_API_GUIDE.md** - Weather system details
- **IMPLEMENTATION_SUMMARY.md** - Complete technical overview
- **WEATHER_SETUP_GUIDE.md** - Getting started

---

**Version: 1.0**
**Last Updated: November 2025**
**Happy Farming! 🌾**
