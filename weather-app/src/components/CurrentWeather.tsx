import { useCurrentWeather } from "../hooks/useFetchWeather";
import ForecastCard from "./ForecastCard";

const CurrentWeather = ({ city }: { city: string }) => {
    const { data, isLoading, error } = useCurrentWeather(city);
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    if (data) {
      return (
        <ForecastCard key={data.dt} forecast={data} />
      );
    }
  
    return null;
  };

export default CurrentWeather;
