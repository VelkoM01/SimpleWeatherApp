import { getCurrentWeather, getWeatherForecast } from "../api";
import { useEffect, useState } from "react";

export const useCurrentWeather = (city: string) => {
  const [data, setData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCurrentWeather(city); 
        setData(response.data); 
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 400) {
          setError(new Error("City not found. Please try another city."));
        } else {
          setError(new Error("An error occurred. Please try again later."));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentWeather();
  }, [city]);

  return { data, isLoading, error };
};

export const useWeatherForecast = (city: string, duration: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getWeatherForecast(city, duration);
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError(new Error("City not found. Please try another city."));
        } else {
          setError(new Error("An error occurred. Please try again later."));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherForecast();
  }, [city, duration]);

  return { data, isLoading, error };
};