const Product = require("./../model/Product");
const Products = require("./../data");
const router = require("express").Router();
router.post("/data", async (req, res) => {
  try {
    Products.forEach((element) => {
      const newEmploy = new Product.insertMany(element);

      console.log(newEmploy);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
