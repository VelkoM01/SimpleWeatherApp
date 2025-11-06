import React, { useState, useEffect } from "react";
import CurrentWeather from "./components/CurrentWeather";
import ForecastDisplay from "./components/ForecastDisplay";
import Favorites from "./components/Favorites";
import "./App.css";
import { useWeatherForecast } from "./hooks/useFetchWeather";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleClientId } from "./config";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [city, setCity] = useState("Sofia");
  const [forecastDuration, setForecastDuration] = useState<string>("");
  const [visibleForecast, setVisibleForecast] = useState<string>("");
  const [cityError, setCityError] = useState<string | null>(null);
  const { data: forecast, isLoading, error } = useWeatherForecast(city, forecastDuration);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    const storedAuthState = localStorage.getItem("isAuthenticated");

    if (storedUserInfo && storedAuthState === "true") {
      setUserInfo(JSON.parse(storedUserInfo));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.city) {
                setCity(data.city);
                setCityError(null);
              } else {
                setCity("Sofia");
                setCityError("Could not determine your location. Using default city Sofia.");
              }
            })
            .catch(() => {
              setCity("Sofia");
              setCityError("Failed to fetch your location. Using default city Sofia.");
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCity("Sofia");
          setCityError(
            error.code === error.PERMISSION_DENIED
              ? "Geolocation permission denied. Using default city Sofia."
              : "Error getting your location. Using default city Sofia."
          );
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    } else {
      setCity("Sofia");
      setCityError("Geolocation is not supported by your browser. Using default city Sofia.");
    }
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setCityError(null);
  };

  const handleCityClick = (selectedCity: string) => {
    setCity(selectedCity);
  };

  const toggleForecast = (duration: string) => {
    if (visibleForecast === duration) {
      setForecastDuration("");
      setVisibleForecast("");
    } else {
      setForecastDuration(duration);
      setVisibleForecast(duration);
    }
  };

  const handleLoginSuccess = (credentialResponse: any) => {
    const parseJwt = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Error parsing JWT:", error);
        return null;
      }
    };

    const decodedToken = parseJwt(credentialResponse.credential);

    if (decodedToken) {
      console.log("Login successful:", decodedToken);
      const userDetails = {
        name: decodedToken.name,
        email: decodedToken.email,
      };
      setUserInfo(userDetails);
      setIsAuthenticated(true);

      localStorage.setItem("userInfo", JSON.stringify(userDetails));
      localStorage.setItem("isAuthenticated", "true");
    } else {
      alert("Failed to decode token. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setShowDropdown(false);

    localStorage.removeItem("userInfo");
    localStorage.removeItem("isAuthenticated");
  };

  if (!isAuthenticated) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <div className="login-container">
          <h1>Welcome to Weather App</h1>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => alert("Login failed. Please try again.")}
          />
        </div>
      </GoogleOAuthProvider>
    );
  }


  return (
    <div className="weather-card">
      <h1>Weather App</h1>
      {userInfo && (
        <div
          className="user-greeting"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Hello, {userInfo.name || userInfo.email}
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleCityChange}
      />
      {cityError && <p className="error-message">{cityError}</p>}
      <CurrentWeather city={city} />
      <Favorites userId={userInfo?.email || "guest"} city={city} onCityClick={handleCityClick} />
      <div className="button-group">
        <button onClick={() => toggleForecast("today")} disabled={error !== null}>
          {visibleForecast === "today" ? "Hide Today Forecast" : "Show Today Forecast"}
        </button>
        <button onClick={() => toggleForecast("3")} disabled={error !== null}>
          {visibleForecast === "3" ? "Hide 3-Day Forecast" : "Show 3-Day Forecast"}
        </button>
        <button onClick={() => toggleForecast("5")} disabled={error !== null}>
          {visibleForecast === "5" ? "Hide 5-Day Forecast" : "Show 5-Day Forecast"}
        </button>
      </div>
      {isLoading && <p>Loading forecast...</p>}
      {error && <p>Error: {error.message}</p>}
      {visibleForecast && forecast.length > 0 && <ForecastDisplay forecast={forecast} />}
    </div>
  );
};

export default App;
