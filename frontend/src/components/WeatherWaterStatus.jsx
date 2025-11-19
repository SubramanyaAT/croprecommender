import { useState, useEffect } from 'react';
import { waterAPI } from '../api/api';
import '../styles/Weather.css';

export default function WeatherWaterStatus({ recommendationId }) {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waterStatus, setWaterStatus] = useState(null);
  const [waterApplied, setWaterApplied] = useState(false);
  const [waterQuantity, setWaterQuantity] = useState('');
  const [useGeolocation, setUseGeolocation] = useState(false);

  // Get user's location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setUseGeolocation(true);
      });
    }
  };

  const handleCheckWaterStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await waterAPI.getWaterStatus(
        city || null,
        latitude || null,
        longitude || null,
        recommendationId
      );

      setWaterStatus(response.data.data);
      setWaterApplied(false);
      setWaterQuantity('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get water status');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyWater = async () => {
    if (!waterStatus) return;

    try {
      await waterAPI.updateWaterApplied(waterStatus.trackingId, waterQuantity || null);
      setWaterApplied(true);
      
      // Refresh status
      setTimeout(() => {
        handleCheckWaterStatus({ preventDefault: () => {} });
      }, 1000);
    } catch (err) {
      setError('Failed to record water application');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'insufficient':
        return '#e74c3c';
      case 'excess':
        return '#3498db';
      case 'adequate':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'insufficient':
        return '💧';
      case 'excess':
        return '💦';
      case 'adequate':
        return '✓';
      default:
        return '?';
    }
  };

  return (
    <div className="weather-water-container">
      <h2>🌤️ Real-time Weather & Water Status</h2>

      <form onSubmit={handleCheckWaterStatus} className="weather-form">
        <div className="form-section">
          <h3>Location Information</h3>

          <div className="location-options">
            <button
              type="button"
              onClick={handleGetLocation}
              className="geolocation-btn"
            >
              📍 Use My Current Location
            </button>
          </div>

          <div className="or-divider">OR</div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="city">City Name</label>
              <input
                id="city"
                type="text"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={useGeolocation && (latitude || longitude)}
              />
            </div>
          </div>

          {useGeolocation && (latitude || longitude) && (
            <div className="coordinates-info">
              <p>
                <strong>Coordinates:</strong> {latitude?.toFixed(2)}, {longitude?.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setUseGeolocation(false);
                  setLatitude('');
                  setLongitude('');
                  setCity('');
                }}
                className="change-location-btn"
              >
                Use Different Location
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="check-status-btn">
            {loading ? 'Fetching Weather...' : '🔄 Check Water Status'}
          </button>
        </div>
      </form>

      {waterStatus && (
        <div className="water-status-card">
          <div className="weather-info-grid">
            <div className="weather-item">
              <div className="weather-label">🌡️ Temperature</div>
              <div className="weather-value">{waterStatus.weather.temperature}°C</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">💨 Humidity</div>
              <div className="weather-value">{waterStatus.weather.humidity}%</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">🌧️ Rainfall</div>
              <div className="weather-value">{waterStatus.weather.rainfall}mm</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">☁️ Cloud Cover</div>
              <div className="weather-value">{waterStatus.weather.cloudCover}%</div>
            </div>
          </div>

          <div className="water-requirement-section">
            <h3>Crop Water Analysis</h3>
            <div className="crop-info">
              <p>
                <strong>Crop:</strong> {waterStatus.cropInfo.name}
              </p>
              <p>
                <strong>Water Requirement:</strong> {waterStatus.cropInfo.waterRequirement}
              </p>
              <p>
                <strong>Soil Type:</strong> {waterStatus.cropInfo.soilType}
              </p>
            </div>

            <div
              className="water-status-indicator"
              style={{
                borderColor: getStatusColor(waterStatus.waterAnalysis.status),
              }}
            >
              <div className="status-header">
                <span className="status-icon">
                  {getStatusIcon(waterStatus.waterAnalysis.status)}
                </span>
                <span className="status-label">
                  {waterStatus.waterAnalysis.status.toUpperCase()}
                </span>
              </div>

              <div className="recommendation-box">
                <p>{waterStatus.waterAnalysis.recommendation}</p>
              </div>

              <div className="analysis-details">
                <div className="detail-item">
                  <span>Water Deficit:</span>
                  <span className="detail-value">
                    {waterStatus.waterAnalysis.details.waterDeficit}mm
                  </span>
                </div>
                <div className="detail-item">
                  <span>Available Water:</span>
                  <span className="detail-value">
                    {waterStatus.waterAnalysis.details.availableWater}mm
                  </span>
                </div>
                <div className="detail-item">
                  <span>Evapotranspiration:</span>
                  <span className="detail-value">
                    {waterStatus.waterAnalysis.details.evapotranspiration}mm
                  </span>
                </div>
                <div className="detail-item">
                  <span>Crop Demand:</span>
                  <span className="detail-value">
                    {waterStatus.waterAnalysis.details.cropDemand}mm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {waterStatus.waterAnalysis.status === 'insufficient' && !waterApplied && (
            <div className="water-application-section">
              <h3>Apply Water</h3>
              <div className="water-input-group">
                <label htmlFor="waterQuantity">Water Quantity (optional)</label>
                <div className="water-input-row">
                  <input
                    id="waterQuantity"
                    type="number"
                    placeholder="e.g., 25 mm or liters per sqm"
                    value={waterQuantity}
                    onChange={(e) => setWaterQuantity(e.target.value)}
                  />
                  <button
                    onClick={handleApplyWater}
                    className="apply-water-btn"
                  >
                    💧 Record Water Application
                  </button>
                </div>
              </div>
            </div>
          )}

          {waterApplied && (
            <div className="success-message">
              ✓ Water application recorded successfully!
            </div>
          )}

          <div className="location-display">
            <p>
              <strong>Location:</strong> {waterStatus.location.city}, {waterStatus.location.country}
            </p>
            <p className="timestamp">
              Updated: {new Date(waterStatus.weather.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
