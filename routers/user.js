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
  const { username, typePassword, newPassword, password } = req.body;
  if (req.body.password) {
    req.body.password;
  }

  try {
    const user = await User.findOne({ username });

    console.log(user);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    const ispassword = user.password !== password;
    if (ispassword)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect  password" });

    const isTypepassword = typePassword !== newPassword;

    if (isTypepassword)
      return res
        .status(400)
        .json({ success: false, message: "vui lòng kiểm lại tra mật  khẩu" });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
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
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
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
