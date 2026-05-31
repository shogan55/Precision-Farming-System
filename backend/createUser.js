const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    email: "admin@farm.com",
    password: hashed
  });

  console.log("Admin user created");
  process.exit();
});
