const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String },
  products: [
    {
      product: {
        category: { type: String },
        orderId: { type: Number },
        image: { type: String },
        name: { type: String },
        price: { type: String },
        detail: { type: String },
        Spice: { type: String },
        // selling: { type: String },
        more: { type: Object },
        size: { type: Object },
        soles: { type: Array },
      },
      note: { type: String },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  day: { type: String },
  time: { type: String },
  code: { type: Number },
  order: { type: String },
  store: { type: Object },
  discount: { type: Number },
  amount: { type: Number },
  address: { type: Object },
  status: { type: String, default: "Pending" },
  user: { type: Object },
});

module.exports = mongoose.model("CheckOuts", OrderSchema);
