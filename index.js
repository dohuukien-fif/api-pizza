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
app.use(express.json());
// const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
// const orderRoute = require("./routes/order");
// const stripeRoute = require("./routes/stripe");
// const cors = require("cors");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRouter);

app.use("/api/orders", orderRouter);
app.listen(process.env.PORT || 8000, () => {
  console.log("Backend server is running!");
});
