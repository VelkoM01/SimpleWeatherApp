import { useState, useEffect } from "react";
import { Favorite } from "../types/favorite";
import { addFavorite, fetchFavorites, removeFavorite } from "../api";

export const useFavorites = (userId: string) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFavorites(userId);
      setFavorites(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch favorites.");
    } finally {
      setLoading(false);
    }
  };

  const addFavoriteCity = async (city: string) => {
    setError(null);
    try {
      const response = await addFavorite({ userId, city });
      setFavorites((prev) => [...prev, response.data]);
    } catch (err: any) {
      setError(err.message || "Failed to add favorite.");
    }
  };

  const removeFavoriteCity = async (id: string) => {
    setError(null);
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to remove favorite.");
    }
  };

  return { favorites, loading, error, addFavoriteCity, removeFavoriteCity };
};
