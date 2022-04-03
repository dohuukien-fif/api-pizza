const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routers/user");
const authRoute = require("./routers/auth");
const productRouter = require("./routers/product");

const orderRouter = require("./routers/order");
const cors = require("cors");
var corsOptions = {
  origin: "*",
  credentials: true,
  methods: "*",
};
app.use(cors());

// const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
// const orderRoute = require("./routes/order");
// const stripeRoute = require("./routes/stripe");
// const cors = require("cors");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://huukien:huukien@cluster0.fy5gf.mongodb.net/shop?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRouter);

app.use("/api/orders", orderRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend server is running!");
});
