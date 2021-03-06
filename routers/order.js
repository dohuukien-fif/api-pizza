const checkOuts = require("./../model/Orders");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const newOrder = new checkOuts(req.body);
  const savedOrder = await newOrder.save();
  res.status(200).json(savedOrder);
});

//UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const updatedOrder = await checkOuts.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await checkOuts.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
//DELETEAll
router.delete("/", async (req, res) => {
  try {
    await checkOuts.deleteMany({});
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:_id", async (req, res) => {
  try {
    const orders = await checkOuts.findOne({ _id: req.params._id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const limit = Number.parseInt(req.query.limit);

  const totalRow = Math.ceil(page * limit);
  const pages = (page - 1) * limit;
  const limits = page * limit;

  try {
    let dataUser;
    const orders = await checkOuts.find();

    if (page && limit) {
      dataUser = orders.slice(pages, limits);
    } else {
      dataUser = orders;
    }

    console.log(dataUser, pages, limits);
    const newUser = {
      pagination: {
        page,
        limit,
        totalRow: orders.length,
      },
      data: [...dataUser],
    };

    if (page || limit) {
      res.status(200).json(newUser);

      return;
    } else {
      res.status(200).json({ data: [...dataUser] });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET DELIVERY
router.get("/delivery", async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const limit = Number.parseInt(req.query.limit);

  const totalRow = Math.ceil(page * limit);
  const pages = (page - 1) * limit;
  const limits = page * limit;

  try {
    let dataUser;
    const orders = await (
      await checkOuts.find({})
    ).filter((e) => e.status === "Success");

    if (page && limit) {
      dataUser = orders.slice(pages, limits);
    } else {
      dataUser = orders;
    }

    console.log("orders", orders);
    const newUser = {
      pagination: {
        page,
        limit,
        totalRow: orders.length,
      },
      data: [...dataUser],
    };
    console.log(newUser);
    if (page || limit) {
      res.status(200).json(newUser);

      return;
    } else {
      res.status(200).json({ data: [...dataUser] });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
