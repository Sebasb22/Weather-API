// weatherService.js
const axios = require("axios");
const redis = require("redis");
const { promisify } = require("util");
require("dotenv").config();

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect();

async function getWeather(city) {
  const cacheKey = `weather:${city.toLowerCase()}`;
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    console.log("✅ Cache hit");
    return JSON.parse(cachedData);
  }

  console.log("❌ Cache miss. Fetching from API...");
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`;
  const response = await axios.get(url);

  const weatherData = response.data;
  await redisClient.setEx(cacheKey, 43200, JSON.stringify(weatherData)); // 12h

  return weatherData;
}

module.exports = { getWeather };
