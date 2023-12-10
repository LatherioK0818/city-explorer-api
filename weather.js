// weather.js
"use strict";

const axios = require("axios");
const WEATHER_KEY = process.env.WEATHER_KEY;

class Forecast {
  constructor(date, description, highTemp, lowTemp) {
    this.date = date;
    this.description = description;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
  }
}

async function getWeatherData(userLat, userLon) {
  const weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_KEY}&lat=${userLat}&lon=${userLon}&units=I&days=7`;

  const weatherResponse = await axios.get(weatherURL);
  const forecastArray = weatherResponse.data.data.map((day) => {
    const date = day.datetime;
    const highTemp = day.high_temp;
    const lowTemp = day.low_temp;
    const description = day.weather.description;
    return new Forecast(date, description, lowTemp, highTemp);
  });

  return forecastArray;
}

module.exports = {
  getWeatherData,
};
