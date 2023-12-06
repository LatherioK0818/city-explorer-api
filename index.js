// index.js

const axios = require('axios');

// Replace the following URL with the actual URL where your server is deployed
const serverUrl = 'http://localhost:3000';

// Function to get weather data from the server
async function getWeatherData(latitude, longitude) {
  try {
    const response = await axios.get(`${serverUrl}/?latitude=${latitude}&longitude=${longitude}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    // Handle error appropriately
  }
}

// Example usage
const latitude = 40.7128; // replace with your actual latitude
const longitude = -74.0060; // replace with your actual longitude

getWeatherData(latitude, longitude)
  .then(data => {
    console.log('Weather data:', data);
    // Do something with the received data
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Error:', error.message);
  });
