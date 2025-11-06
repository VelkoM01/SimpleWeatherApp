import React from "react";
import { ForecastItem } from "../types/weather";

interface Props {
  forecast: ForecastItem;
}

const ForecastCard: React.FC<Props> = ({ forecast }) => (
  <div className="forecast-card">
    <h3>{forecast.dt_txt}</h3>
    <p>Temperature: {forecast.main.temp}°C</p>
    <p>Humidity: {forecast.main.humidity}%</p>
    <p>Wind Speed: {forecast.wind.speed} m/s</p>
    <p>Cloudiness: {forecast.clouds.all}%</p>
    <p>Weather: {forecast.weather[0].description}</p>
  </div>
);

export default ForecastCard;
