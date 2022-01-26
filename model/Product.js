const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    detail: { type: String, required: true, unique: true },
    spice: { type: String, required: true },
    selling: { type: String, required: true },
    more: { type: Array },
    size: { type: Array },
    soles: { type: Array },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
