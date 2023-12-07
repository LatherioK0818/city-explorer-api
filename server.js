"use strict";

require("dotenv").config();
const weatherData = require("./data/weather.json");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(200).send("Hello World")
});

app.get('/weather', (request, response) => {
  console.log(request.query);
  let userLat = request.query.lat;
  let userLon = request.query.lon;
  let searchQuery = request.query.searchQuery;

  if (userLat && userLon) {
    console.log(weatherData)
    let userCity = weatherData.find(
      (city) => city.lon === userLon && city.lat === userLat
    );
      console.log("user City",userCity);
      if(userCity){
        response.json(userCity.data.map((day) => {
                const date = day.valid_date;
                const description = day.weather.description;
                return new Forecast(date, description);
              })
        );
      }
      else {
            console.log("City not found");
            response.status(404).json({ error: 'City not found' });
          }
    }
    else if(searchQuery){
      const cityName = searchQuery.toLowerCase();
      let userCity = weatherData.find(
        (city) => city.city_name.toLowerCase() === cityName
      );
      if(userCity){
        response.json(userCity.data.map((day) => {
          const date = day.valid_date;
          const description = day.weather.description;
          return new Forecast(date, description);
        })
        )
      }
    }
  //   if (userCity) {
  //     console.log(userCity.data);

  //     const forecastArray = userCity.data.map((day) => {
  //       const date = day.valid_date;
  //       const description = day.weather.description;
  //       return new Forecast(date, description);
  //     });

  //     response.json({ 'CityName': userCity.city_name, 'forecast': forecastArray });
  //   } else {
  //     console.log("City not found");
  //     response.status(404).json({ error: 'City not found' });
  //   }
  // } else {
  //   console.log("Invalid request parameters");
  //   response.status(400).json({ error: 'Invalid request parameters' });
  // }
});

// Starting the server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
