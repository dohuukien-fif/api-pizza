const Customers = require("./../model/Customers");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const newOrder = new Customers(req.body);

  console.log(newOrder);
  try {
    const savedOrder = await newOrder.save();
    console.log(savedOrder);
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.patch("/:id", async (req, res) => {
  console.log(req.params.userId);

  try {
    const updatedOrder = await Customers.findOne({
      userId: req.params.id,
    });
    updatedOrder.userId = req.body.userId;
    updatedOrder.userName = req.body.userName;
    updatedOrder.amount = req.body.amount;
    updatedOrder.totalOrder = req.body.totalOrder;
    updatedOrder.address = req.body.address;
    updatedOrder.status = req.body.status;

    await updatedOrder.save();

    console.log("updatedOrder", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:userId", async (req, res) => {
  try {
    await Customers.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS

router.get("/:id", async (req, res) => {
  console.log("id", req.params.userId);
  try {
    const Customer = await Customers.findOne({ userId: req.params.id });
    res.status(200).json(Customer);
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
    const orders = await Customers.find();

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
