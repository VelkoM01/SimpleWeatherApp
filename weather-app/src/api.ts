import axios from "axios";
import { Favorite } from "./types/favorite";

const API_BASE_URL = "https://localhost:7174/api/weather";
const FAVORITES_API_BASE_URL = "https://localhost:7174/api/weather/favorites";


export const getCurrentWeather = (city: string) =>
  axios.get(`${API_BASE_URL}/current`, { params: { city } });

export const getWeatherForecast = (city: string, duration: string) =>
  axios.get(`${API_BASE_URL}/forecast`, { params: { city, duration } });

export const fetchFavorites = (userId: string): Promise<{ data: Favorite[] }> => {
  return axios.get(`${FAVORITES_API_BASE_URL}?userId=${userId}`);
};

export const addFavorite = (favorite: Omit<Favorite, "id">): Promise<{ data: Favorite }> => {
  return axios.post(FAVORITES_API_BASE_URL, favorite);
};

export const removeFavorite = (id: string): Promise<void> => {
  return axios.delete(`${FAVORITES_API_BASE_URL}/${id}`);
};
