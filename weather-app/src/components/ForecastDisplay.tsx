import React from "react";
import { ForecastItem } from "../types/weather";

interface ForecastDisplayProps {
  forecast: ForecastItem[];
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ forecast }) => {
  return (
    <div className="forecast-container">
      {forecast.map((item) => (
        <div key={item.dt} className="forecast-item">
          <p>{new Date(item.dt * 1000).toLocaleString()}</p> {}
          <p>Temp: {item.main.temp}°C</p>
          <p>Humidity: {item.main.humidity}%</p>
          <p>Wind: {item.wind.speed} m/s</p>
          <p>Probability of precipitation: {item.pop * 100}%</p>
          <p>{item.weather[0].description}</p>       
        </div>
      ))}
    </div>
  );
};

export default ForecastDisplay;
