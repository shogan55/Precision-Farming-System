module.exports = function deviceAuth(req, res, next) {
  const deviceKey = req.headers["x-device-key"];

  if (!deviceKey) {
    return res.status(401).json({ error: "Device key missing" });
  }

  if (deviceKey !== process.env.DEVICE_API_KEY) {
    return res.status(403).json({ error: "Invalid device key" });
  }

  next();
};
