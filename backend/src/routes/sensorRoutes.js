const express = require("express");
const router = express.Router();

const deviceAuth = require("../middleware/deviceAuth");

const {
  receiveSensorData,
  getLatestSensorData,
  getSensorHistory
} = require("../controllers/sensorController");

// OPTIONAL debug (SAFE POSITION)
console.log("deviceAuth loaded:", typeof deviceAuth);
console.log("receiveSensorData loaded:", typeof receiveSensorData);

router.post("/", deviceAuth, receiveSensorData);
router.get("/latest", getLatestSensorData);
router.get("/history", getSensorHistory);

module.exports = router;
