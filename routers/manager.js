const Manager = require("./../model/Manager");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const newOrder = new Manager(req.body);

  console.log(newOrder);
  try {
    const savedOrder = await newOrder.save();

    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  console.log("id", req.params.id);
  console.log("updatedProduct", req.params.id);
  try {
    const updatedProduct = await Manager.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    console.log("updatedProduct", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:userId", async (req, res) => {
  try {
    await Manager.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS

router.get("/:id", async (req, res) => {
  console.log("id", req.params.id);
  try {
    const ManagetData = await Manager.findById(req.params.id);

    console.log("managerId", ManagetData);
    res.status(200).json(ManagetData);
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
    const orders = await Manager.find();

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
