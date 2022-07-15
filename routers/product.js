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

router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  console.log("id", req.params.id);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
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

  try {
    const productss = await Product.findOne({ orderId: Number(qpid) });
    res.status(200).json(productss);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/search", async (req, res) => {
  const qpSearch = req.query.q;
  console.log("qpSearch", req.query.q);
  try {
    let products;

    const dataProduct = await Product.find({});

    console.log(dataProduct);
    console.log("qpSearch", dataProduct);
    if (qpSearch) {
      products = dataProduct.filter((items) =>
        items.category?.toLowerCase().includes(qpSearch.trim().toLowerCase())
      );
    } else {
      products = dataProduct;
    }

    res.status(200).json(dataProduct);
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

  checkFilters = Object.keys(filters).length > 0;
  try {
    let products = {};

    const dataProduct = await Product.find({});

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
      products = dataProduct.sort((a, b) => b.price - a.price);
    } else if (qCategory) {
      products = dataProduct.filter((e) => e.category === qCategory);
    } else if (sorts === "price" && order === "desc") {
      products = dataProduct.sort((a, b) => a.price - b.price);
    } else if (qprice) {
      products = dataProduct.filter((a) => a.price >= qprice);
    } else if (page || limit) {
      products = dataProduct.slice(startIndex, endIndex);
    } else if (checkFilters) {
      products = dataProduct.filter((item) =>
        item[Object.keys(filters)].includes(Object.values(filters).join())
      );

      // console.log((await Product.find()).sort((e) => e.price - e.price));
    } else {
      products = dataProduct;
    }

    if (page || limit) {
      const newProduct = {
        pagination: {
          page: page || 1,
          limit: limit || 10,
          totalRow: dataProduct.length,
        },
        data: [...products],
      };

      // console.log((await Product.find()).sort((e) => e.price - e.price));
      res.status(200).json(newProduct);

      return;
    } else {
      const newProductss = {
        data: [...products],
      };

      console.log("dataProduct", newProductss);
      res.status(200).json(newProductss);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
////
router.put("/:id/like", async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  console.log(id);
  try {
    const post = await Product.findOne({ orderId: id });
    if (!post.like.includes(userId)) {
      await post.updateOne({ $push: { like: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { like: userId } });
      res.status(200).json("Post Unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
