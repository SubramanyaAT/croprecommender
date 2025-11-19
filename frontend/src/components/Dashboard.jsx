import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cropAPI } from '../api/api';
import WeatherWaterStatus from './WeatherWaterStatus';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [season, setSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [temperature, setTemperature] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [humidity, setHumidity] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
    fetchHistory();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await cropAPI.getOptions();
      setSeasons(response.data.data.seasons);
      setSoilTypes(response.data.data.soilTypes);
    } catch (err) {
      console.error('Failed to fetch options:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await cropAPI.getHistory();
      setHistory(response.data.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const response = await cropAPI.getRecommendations(
        season,
        soilType,
        temperature || undefined,
        rainfall || undefined,
        humidity || undefined
      );
      setRecommendations(response.data.data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Smart Crop Advisor</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="form-card">
          <h2>Get Crop Recommendations</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleGetRecommendations}>
            <div className="form-group">
              <label htmlFor="season">Season *</label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                required
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="soilType">Soil Type *</label>
              <select
                id="soilType"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                required
              >
                <option value="">Select Soil Type</option>
                {soilTypes.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="temperature">Temperature (°C)</label>
                <input
                  id="temperature"
                  type="number"
                  placeholder="e.g., 25"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rainfall">Rainfall (mm)</label>
                <input
                  id="rainfall"
                  type="number"
                  placeholder="e.g., 100"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="humidity">Humidity (%)</label>
                <input
                  id="humidity"
                  type="number"
                  placeholder="e.g., 60"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </button>
          </form>
        </div>

        {recommendations && (
          <div className="recommendations-card">
            <h2>Recommended Crops</h2>
            <div className="recommendation-info">
              <p>
                <strong>Season:</strong> {recommendations.season.toUpperCase()}
              </p>
              <p>
                <strong>Soil Type:</strong> {recommendations.soilType.toUpperCase()}
              </p>
              {recommendations.weather && (
                <div className="weather-info">
                  <p>
                    <strong>Temperature:</strong> {recommendations.weather.temperature}
                  </p>
                  <p>
                    <strong>Rainfall:</strong> {recommendations.weather.rainfall}
                  </p>
                  <p>
                    <strong>Humidity:</strong> {recommendations.weather.humidity}
                  </p>
                </div>
              )}
            </div>

            <div className="crops-grid">
              {recommendations.recommendedCrops.map((crop, index) => (
                <div key={index} className="crop-card">
                  <h3>{crop.name}</h3>
                  <div className="crop-details">
                    <p>
                      <strong>Suitability:</strong>
                      <span className={`badge badge-${crop.suitability}`}>
                        {crop.suitability.toUpperCase()}
                      </span>
                    </p>
                    <p>
                      <strong>Yield:</strong> {crop.yieldPotential}
                    </p>
                    <p>
                      <strong>Water:</strong> {crop.waterRequirement}
                    </p>
                    <p>
                      <strong>Harvest:</strong> {crop.harvestTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {recommendations && (
          <WeatherWaterStatus recommendationId={recommendations._id || null} />
        )}

        <div className="history-section">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="toggle-history-btn"
          >
            {showHistory ? 'Hide History' : 'Show History'} ({history.length})
          </button>

          {showHistory && history.length > 0 && (
            <div className="history-card">
              <h2>Recommendation History</h2>
              <div className="history-list">
                {history.map((item) => (
                  <div key={item._id} className="history-item">
                    <p>
                      <strong>{item.season.toUpperCase()}</strong> - {item.soilType}
                    </p>
                    <p className="timestamp">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <p className="crops">
                      {item.recommendedCrops.map((c) => c.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
