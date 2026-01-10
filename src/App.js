import React, { useState, useEffect } from "react";
import axios from "axios";
import DefaultVideo from "../src/assets/videos/default.mp4"; // Replace with your default video
import cloudVideo from "../src/assets/videos/clouds.mp4"; // Replace with your default video
import sunnyVideo from "../src/assets/videos/sunny.mp4"; // Replace with your sunny video
import rainyVideo from "../src/assets/videos/rain.mp4"; // Replace with your rainy video
import snowyVideo from "../src/assets/videos/snow.mp4"; // Replace with your snowy video
import thunderVideo from "../src/assets/videos/thunder.mp4"; // Replace with your thunderstorm video
import mistVideo from "../src/assets/videos/mist.mp4"; // Replace with your mist video
import fogVideo from "../src/assets/videos/fog.mp4"; // Replace with your haze video
import tornalodovideo from "../src/assets/videos/tornado.mp4"; // Replace with your tornado video

import "./App.css"; // Import styles

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric for Celsius, imperial for Fahrenheit
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null); // To store current location weather

  const apiKey = "d087e1ddfc3d986746779c7ff00796f1"; // Replace with your OpenWeatherMap API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;

  // Fetch weather data when the component mounts or when the city or unit changes
  useEffect(() => {
    const controller = new AbortController();

    // debounce timer
    const timer = setTimeout(() => {
      if (city.trim() === "") return;

      axios
        .get(apiUrl, { signal: controller.signal })
        .then((response) => {
          setWeatherData(response.data);
          setError(null);
        })
        .catch((error) => {
          if (error.name !== "CanceledError") {
            setWeatherData(null);
            setError("Failed to fetch weather data");
          }
        });
    }, 500); // 👈 debounce delay

    return () => {
      clearTimeout(timer); // cancel debounce
      controller.abort(); // cancel API
    };
  }, [city, unit, apiUrl]);

  useEffect(() => {
    const controller = new AbortController();

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

      axios
        .get(locationUrl, { signal: controller.signal })
        .then((res) => setCurrentLocationWeather(res.data))
        .catch(() => setCurrentLocationWeather(null));
    });

    return () => controller.abort();
  }, [unit]);

  // Handle the city change
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Handle unit toggle (Celsius or Fahrenheit)
  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  // Determine the background image based on the weather condition
  // const getBackgroundImage = (weatherType) => {
  //   switch (weatherType) {
  //     case "Clear":
  //       return "sunny.gif"; // Clear sky, sunny
  //     case "Few clouds":
  //       return "partly-cloudy.gif"; // Few clouds
  //     case "Scattered clouds":
  //       return "cloudy.gif"; // Scattered clouds
  //     case "Broken clouds":
  //       return "overcast.gif"; // Broken clouds (overcast)
  //     case "Shower rain":
  //       return "rain-shower.gif"; // Shower rain
  //     case "Rain":
  //       return "rain.gif"; // Heavy rain
  //     case "Thunderstorm":
  //       return "thunderstorm.gif"; // Thunderstorm
  //     case "Snow":
  //       return "snow.gif"; // Snowy weather
  //     case "Mist":
  //       return "mist.gif"; // Misty or foggy
  //     case "Haze":
  //       return "haze.gif"; // Haze or smoke
  //     case "Dust":
  //       return "dust-storm.gif"; // Dust storm
  //     case "Fog":
  //       return "foggy.gif"; // Foggy weather
  //     case "Tornado":
  //       return "tornado.gif"; // Tornado
  //     case "Windy":
  //       return "windy.gif"; // Windy weather
  //     default:
  //       return "default.gif"; // Default background if no match
  //   }
  // };

  const getBackgroundVideo = (weather) => {
    console.log(weather);

    switch (weather) {
      case "Clouds":
        return cloudVideo;
      case "Clear":
        return sunnyVideo;
      case "Rain":
      case "Drizzle":
        return rainyVideo;
      case "Snow":
        return snowyVideo;
      case "Thunderstorm":
        return thunderVideo;
      case "Mist":
        return mistVideo;
      case "Fog":
      case "Haze":
        return fogVideo;
      case "Tornado":
        return tornalodovideo;
      default:
        return DefaultVideo;
    }
  };

  return (
    <div
      className="App"
      style={{
        // backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${getBackgroundImage(weatherData ? weatherData.weather[0].main : "Clear")})`,.
        // backgroundImage: `url(${cloudBackground})`, // Default background
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <video
        key={getBackgroundVideo(
          weatherData ? weatherData.weather[0].main : "Default"
        )} // ✅ this forces re-mount
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src={getBackgroundVideo(
            weatherData ? weatherData.weather[0].main : "Default"
          )}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h1>Weather App</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleCityChange}
        />
        <button onClick={toggleUnit}>
          Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
        </button>

        {error && city.trim() !== "" && <p>{error}</p>}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <h3>{weatherData.weather[0].main}</h3>
            <p>{weatherData.weather[0].description}</p>
            <p>
              Temperature: {weatherData.main.temp}°{" "}
              {unit === "metric" ? "C" : "F"}
            </p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>

      {/* Current Location Weather (Top-right corner) */}
      {currentLocationWeather && (
        <div
          className="current-location"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: weatherData?.weather[0]?.main === "Clouds" ? "#000" : "#fff",
          }}
        >
          <h3>Current Location</h3>
          <p>{currentLocationWeather.name}</p>
          <p>{currentLocationWeather.weather[0].main}</p>
          <p>
            {currentLocationWeather.main.temp}° {unit === "metric" ? "C" : "F"}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
