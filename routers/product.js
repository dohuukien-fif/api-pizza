const Product = require("./../model/Product");
const Products = require("./../data");
const {
  verifyToken,
  verifyTokens,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

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
router.get("/:id", async (req, res) => {
  const qpid = req.params.id;

  console.log("cho", qpid);
  try {
    const product = await Product.find((e) => e.id === Number(qpid));
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
  const body = req.query.body;
  const qNew = req.query.new;
  const sorts = req.query._sort;
  const order = req.query._order;
  const price_lt = req.query._price_lt;
  const price_gt = req.query._price_gt;
  const names = req.query.name;
  const qCategory = req.query.category;
  const qprice = req.query.price;
  const reqQuery = { ...req.query };
  const filters = req.query;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  console.log(sorts);
  try {
    let products = {};
    // else if (qprice) {
    //   products = await Product.find({
    //     $and: [
    //       {
    //         $or: [{ price: { $price: qprice } }, { price_gt: { $gt: qprice } }],
    //       },
    //     ],
    //   });
    // }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (sorts === "price" && order === "asc") {
      products = Products.sort((a, b) => b.price - a.price);
    } else if (sorts === "price" && order === "desc") {
      products = Products.sort((a, b) => a.price - b.price);
    } else if (qprice) {
      products = Products.filter((a) => a.price >= qprice);
    } else if (startIndex || endIndex) {
      products.data = Products.slice(startIndex, endIndex);
      products.pagination = {
        page: page,
        limit: limit,
      };
    } else if (filters) {
      products = Products.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          item[key].includes(value)
        )
      );
    } else {
      products = Products;
    }
    // console.log((await Product.find()).sort((e) => e.price - e.price));
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
