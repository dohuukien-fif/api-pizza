const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  orderId: { type: Number },
  category: { type: String },
  image: { type: String },
  name: { type: String },
  price: { type: Number || String },
  detail: { type: String },
  spice: { type: String },
  selling: { type: String },
  more: { type: Array },
  size: { type: Array },
  soles: { type: Array },
});
module.exports = mongoose.model("back", productSchema);
