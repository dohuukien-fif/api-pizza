const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true, unique: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timeseries: true }
);
module.exports = mongoose.model("Cart", CartSchema);
