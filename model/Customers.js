const mongoose = require("mongoose");

const CustomersSchema = new mongoose.Schema(
  {
    userId: { type: String },
    userName: { type: String },
    amount: { type: Number },
    totalOrder: { type: Number },
    address: { type: Object },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customers", CustomersSchema);
