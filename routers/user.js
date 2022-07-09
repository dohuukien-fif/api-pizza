const User = require("./../model/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenUser,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, typePassword, newPassword, password, newImage } = req.body;
  if (req.body.password) {
    req.body.password;
  }

  try {
    const user = await User.findOne({ username });

    console.log(user);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "tài  khoản hoặc mật khẩu không đúng",
      });

    const ispassword = user.password !== password;
    if (ispassword)
      return res.status(400).json({ success: false, message: "mật khẩu sai" });

    const isTypepassword = typePassword !== newPassword;

    if (isTypepassword)
      return res
        .status(400)
        .json({ success: false, message: "vui lòng kiểm lại tra mật  khẩu" });

    if (newImage === "")
      return res
        .status(400)
        .json({ success: false, message: "vui lòng kiểm lại ảnh đại diện" });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        image: newImage,
        password: typePassword,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
//IMAGE
router.patch("/image/:id", async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  console.log(id);
  try {
    const updatedProduct = await User.findByIdAndUpdate(
      id,
      {
        image: image,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    console.log(user);

    if (!user)
      return res.status(400).json({ success: false, message: "Fail user" });

    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", async (req, res) => {
  const query = req.query.new;
  const page = Number.parseInt(req.query.page);
  const limit = Number.parseInt(req.query.limit);

  const totalRow = Math.ceil(page * limit);
  const pages = (page - 1) * limit;
  const limits = page * limit;

  try {
    let dataUser;
    const users = await User.find();

    if (page && limit) {
      dataUser = users.slice(pages, limits);
    } else {
      dataUser = users;
    }

    console.log(dataUser, pages, limits);
    const newUser = {
      pagination: {
        page,
        limit,
        totalRow: users.length,
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

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
