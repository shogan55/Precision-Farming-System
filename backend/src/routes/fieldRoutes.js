const express = require("express");
const {
  createField,
  getFields,
  getFieldById
} = require("../controllers/fieldController");

const router = express.Router();

router.post("/", createField);
router.get("/", getFields);
router.get("/:id", getFieldById);

module.exports = router;
