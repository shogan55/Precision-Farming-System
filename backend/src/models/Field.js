const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    crop: {
      type: String,
      default: "Not specified"
    },
    location: {
      lat: Number,
      lng: Number
    },
    thresholds: {
      soilMoistureMin: {
        type: Number,
        default: 30
      },
      soilMoistureMax: {
        type: Number,
        default: 70
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
