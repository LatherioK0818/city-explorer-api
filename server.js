"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();
const WEATHER_KEY = process.env.WEATHER_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_READ = process.env.MOVIE_READ_ACCESS;
const PORT = process.env.PORT || 3000;

app.use(cors());

class Forecast {
  constructor(date, description, highTemp, lowTemp) {
    this.date = date;
    this.description = description;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
  }
}

class Movie {
  constructor(name, description, voteAvg, rating) {
    this.name = name;
    this.description = description;
    this.voteAvg = voteAvg;
    this.rating = rating;
  }
}

class MovieResult {
  constructor(title, overview, voteAverage) {
    this.title = title;
    this.overview = overview;
    this.voteAverage = voteAverage;
  }
}

app.get('/movies', async (request, response) => {
  const city = request.query.city;

  if (!city) {
    return response.status(400).json({ error: "city is a required parameter" });
  }

  const movieURL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";

  try {
    const movieResponse = await axios.get(movieURL, {
      params: { query: city, include_adult: false, language: "en-US", page: 1, api_key: MOVIE_API_KEY },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${MOVIE_READ}`,
      },
    });

    const movieArray = movieResponse.data.results.map(value => {
      const title = value.original_title;
      const overview = value.overview;
      const voteAverage = value.vote_average;
      return new MovieResult(title, overview, voteAverage);
    });

    response.json(movieArray);
  } catch (error) {
    console.error("Error fetching movie data", error);

    // Check for specific error status codes and respond accordingly
    if (error.response && error.response.status) {
      response.status(error.response.status).json({ error: `TMDb API Error: ${error.response.status}` });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get("/", (request, response) => {
  response.status(200).send("Hello World");
});

app.get('/weather', async (request, response) => {
  console.log(request.query);
  let userLat = request.query.lat;
  let userLon = request.query.lon;
  let searchQuery = request.query.q;

  // Check for null or undefined values for lat, lon, and searchQuery
  if (
    userLat == null
    || userLon == null
    || searchQuery == null
    || userLat === undefined
    || userLon === undefined
    || searchQuery === undefined
  ) {
    console.log("City not found");
    return response.status(400).json({ error: "lat, lon, and searchQuery are required parameters" });
  }

  const weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_KEY}&lat=${userLat}&lon=${userLon}&units=I&days=7`;

  try {
    const weatherResponse = await axios.get(weatherURL);
    const forecastArray = weatherResponse.data.data.map((day) => {
      const date = day.datetime;
      const highTemp = day.high_temp;
      const lowTemp = day.low_temp;
      const description = day.weather.description;
      return new Forecast(date, highTemp, lowTemp, description);
    });

    response.json({ Forecast: forecastArray });
  } catch (error) {
    console.error("Error fetching weather data", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Starting the server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
