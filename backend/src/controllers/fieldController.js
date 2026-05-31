const Field = require("../models/Field");

exports.createField = async (req, res) => {
  try {
    const field = await Field.create(req.body);
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFields = async (req, res) => {
  const fields = await Field.find();
  res.json(fields);
};

exports.getFieldById = async (req, res) => {
  const field = await Field.findById(req.params.id);
  if (!field) {
    return res.status(404).json({ error: "Field not found" });
  }
  res.json(field);
};
