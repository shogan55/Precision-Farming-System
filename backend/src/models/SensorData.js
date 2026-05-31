const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
  soil: Number,
  temperature: Number,
  humidity: Number,
  light: Number,
  rain: Boolean,
  tank: Number,
  tankStatus: String,
  flowRate: Number,
  pump: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SensorData", SensorDataSchema);
