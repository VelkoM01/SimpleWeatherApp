import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import "./Favorites.css";

interface FavoritesProps {
  userId: string;
  city: string;
  onCityClick: (city: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ userId, city, onCityClick }) => {
  const { favorites, loading, error, addFavoriteCity, removeFavoriteCity } = useFavorites(userId);

  const handleAddFavorite = () => {
    addFavoriteCity(city);
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavoriteCity(id);
  };

  const handleCityClick = (city: string) => {
    onCityClick(city); // Call the passed function to update city in the parent component
  };

  return (
    <div className="favorites-section">
      <h2>Your Favorite Locations</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {favorites.map((fav) => (
          <li key={fav.id}>
            <button onClick={() => handleCityClick(fav.city)}>
              {fav.city}
            </button>{" "}
            <button onClick={() => handleRemoveFavorite(fav.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {city && !favorites.some((fav) => fav.city === city) && (
        <button onClick={handleAddFavorite}>Add {city} to Favorites</button>
      )}
    </div>
  );
};

export default Favorites;
