const axios = require("axios");

exports.getWeather = async (req, res) => {
  try {

    const lat = 18.5204;   // your farm location
    const lon = 73.8567;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability&timezone=auto`;

    const response = await axios.get(url);

    const hourly = response.data.hourly;

    // next 3 hours prediction
    const forecast = [];
    for (let i = 0; i < 3; i++) {
      forecast.push({
        time: hourly.time[i],
        temp: hourly.temperature_2m[i],
        rain: hourly.precipitation_probability[i]
      });
    }

    res.json(forecast);

  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
};
