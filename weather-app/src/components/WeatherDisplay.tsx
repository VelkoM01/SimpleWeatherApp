import React from "react";
import { useWeatherForecast } from "../hooks/useFetchWeather";
import ForecastCard from "./ForecastCard";

interface Props {
  city: string;
  duration: string;
}

const WeatherDisplay: React.FC<Props> = ({ city, duration }) => {
  const { data, isLoading, error } = useWeatherForecast(city, duration);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading weather data.</p>;

  return (
    <div>
      {data.map((forecast: any) => (
        <ForecastCard key={forecast.dt} forecast={forecast} />
      ))}
    </div>
  );
};

export default WeatherDisplay;
