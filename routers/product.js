const Product = require("./../data");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
console.log(Product);
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/search", async (req, res) => {
  const qpSearch = req.query.q;

  try {
    let products;
    if (qpSearch) {
      products = Product.filter((items) =>
        items.category?.toLowerCase().includes(qpSearch.trim().toLowerCase())
      );
    } else {
      products = Product;
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const sorts = req.query._sort;
  const price_lt = req.query._price_lt;
  const price_gt = req.query._price_gt;
  const names = req.query.name;
  const qCategory = req.query.category;
  const qprice = req.query.price;
  const reqQuery = { ...req.query };
  const filters = req.query;

  console.log(sorts);
  try {
    let products;
    // else if (qprice) {
    //   products = await Product.find({
    //     $and: [
    //       {
    //         $or: [{ price: { $price: qprice } }, { price_gt: { $gt: qprice } }],
    //       },
    //     ],
    //   });
    // }
    if (sorts === "asc") {
      products = Product.sort((a, b) => b.price - a.price);
    } else if (sorts === "desc") {
      products = Product.sort((a, b) => a.price - b.price);
    } else if (qprice) {
      products = Product.filter((a) => a.price >= qprice);
    } else if (names || qCategory) {
      products = Product.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          item[key].includes(value)
        )
      );
    } else {
      products = Product;
    }
    // console.log((await Product.find()).sort((e) => e.price - e.price));
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
