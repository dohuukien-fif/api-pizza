const Customers = require("../model/Customers");
const Product = require("./../model/Product");
const Users = require("./../model/User");
const {
  verifyToken,
  verifyTokens,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.get("/", async (req, res) => {
  const qpSearch = req.query.q;
  console.log("qpSearch", req.query.q);
  try {
    let products;

    const dataProduct = await Product.find({});

    console.log("qpSearch", dataProduct);
    if (qpSearch) {
      products = dataProduct.filter((items) =>
        items.category?.toLowerCase().includes(qpSearch.trim().toLowerCase())
      );
    } else {
      products = dataProduct;
    }

    const newData = {
      data: [...products],
    };

    res.status(200).json(newData);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/customers", async (req, res) => {
  const qpSearch = req.query.q;
  const page = Number.parseInt(req.query.page);
  const limit = Number.parseInt(req.query.limit);

  const totalRow = Math.ceil(page * limit);
  const pages = (page - 1) * limit;
  const limits = page * limit;
  console.log("qpSearch", req.query.q);
  try {
    let products;

    const dataProduct = await Customers.find({});

    console.log("qpSearch", dataProduct);
    if (qpSearch) {
      products = dataProduct.filter((items) =>
        items.userName?.toLowerCase().includes(qpSearch.trim().toLowerCase())
      );
    } else if (page || limit) {
      products = dataProduct.slice(pages, limits);
    } else {
      products = dataProduct;
    }

    const newData = {
      pagination: {
        page,
        limit,
        totalRow: dataProduct.length,
      },
      data: [...products],
    };

    res.status(200).json(newData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users", async (req, res) => {
  const qpSearch = req.query.q;
  const page = Number.parseInt(req.query.page);
  const limit = Number.parseInt(req.query.limit);

  const totalRow = Math.ceil(page * limit);
  const pages = (page - 1) * limit;
  const limits = page * limit;
  console.log("qpSearch", req.query.q);
  try {
    let products;

    const dataProduct = await Users.find({});

    console.log("qpSearch", dataProduct);
    if (qpSearch) {
      products = dataProduct.filter((items) =>
        items.username?.toLowerCase().includes(qpSearch.trim().toLowerCase())
      );
    } else if (page || limit) {
      products = dataProduct.slice(pages, limits);
    } else {
      products = dataProduct;
    }

    const newData = {
      pagination: {
        page,
        limit,
        totalRow: dataProduct.length,
      },
      data: [...products],
    };

    console.log(newData);

    console.log(Users);
    res.status(200).json(newData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
