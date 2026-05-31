const express = require("express");
const cors = require("cors");

const sensorRoutes = require("./routes/sensorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorRoutes);

module.exports = app;

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const weatherRoutes = require("./routes/weatherRoutes");
app.use("/api/weather", weatherRoutes);
                                                                                            