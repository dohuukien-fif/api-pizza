const UserAdmin = require("./../model/UserAdmin");
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

  console.log(id);
  const { username, typePassword, newPassword, password } = req.body;
  if (req.body.password) {
    req.body.password;
  }

  try {
    const user = await UserAdmin.findOne({ username });

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

    const updatedUser = await UserAdmin.findByIdAndUpdate(
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
//IMAGE
router.patch("/image/:id", async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  console.log(id);
  try {
    const updatedProduct = await UserAdmin.findByIdAndUpdate(
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
    await UserAdmin.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", async (req, res) => {
  try {
    const user = await UserAdmin.findById(req.params.id);

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
  try {
    const users = query
      ? await UserAdmin.find().sort({ _id: -1 }).limit(5)
      : await UserAdmin.find();
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
    const data = await UserAdmin.aggregate([
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
