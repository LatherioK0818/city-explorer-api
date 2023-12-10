// movies.js
"use strict";

const axios = require("axios");
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class MovieResult {
  constructor(title, overview, voteAverage) {
    this.title = title;
    this.overview = overview;
    this.voteAverage = voteAverage;
  }
}

async function getMovieData(city) {
  const movieURL = `https://api.themoviedb.org/3/search/movie?query=${city}&include_adult=false&language=en-US&page=1`;

  const movieResponse = await axios.get(movieURL, {
    params: { query: city, include_adult: false, language: "en-US", page: 1, api_key: MOVIE_API_KEY },
  });

  const movieArray = movieResponse.data.results.map(value => {
    const title = value.original_title;
    const overview = value.overview;
    const voteAverage = value.vote_average;
    return new MovieResult(title, overview, voteAverage);
  });

  return movieArray;
}

module.exports = {
  getMovieData,
};
