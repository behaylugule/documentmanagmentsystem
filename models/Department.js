const mongoose = require("mongoose");

const Department = new mongoose.Schema(
  {
    depName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", Department);
