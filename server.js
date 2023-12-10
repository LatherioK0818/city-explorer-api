"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getWeatherData } = require("./weather");
const { getMovieData } = require("./movies");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/combined', async (request, response) => {
  const city = request.query.city;
  const userLat = request.query.lat;
  const userLon = request.query.lon;

  if (!city || !userLat || !userLon) {
    return response.status(400).json({ error: "city, lat, and lon are required parameters" });
  }

  try {
    // Fetch movie data
    const movieArray = await getMovieData(city);

    // Fetch weather data
    const forecastArray = await getWeatherData(userLat, userLon);

    // Respond with combined data
    response.json({ Movies: movieArray, Forecast: forecastArray });

  } catch (error) {
    console.error("Error fetching data", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Starting the server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
