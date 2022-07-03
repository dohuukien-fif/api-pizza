const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    gender: { type: String },
    date: { type: String },
    position: { type: String },
    identification: { type: Number },
    telephone: { type: Number },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manager", ManagerSchema);
