const SensorData = require("../models/SensorData");

exports.receiveSensorData = async (req, res) => {
  try {
    await SensorData.create(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLatestSensorData = async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSensorHistory = async (req, res) => {
  try {
    const data = await SensorData.find().sort({ createdAt: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
