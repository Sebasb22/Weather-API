// index.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const { getWeather } = require("./weatherService");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requests por IP por minuto
});
app.use(limiter);
app.use(express.static(path.join(__dirname, "public")));

app.get("/weather/:city", async (req, res) => {
  const { city } = req.params;

  try {
    const data = await getWeather(city);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el clima." });
  }
});

app.get("/", (req, res) => {
  res.send(
    "🌤️ Bienvenido a la API del Clima. Usa /weather/:city para obtener el clima."
  );
});

app.listen(PORT, () => {
  console.log(`🌦️ Weather API escuchando en http://localhost:${PORT}`);
});
