const CryptoJS = require("crypto-js");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find({isVarify:true}).sort({ _id: -1 }).limit(5)
      : await User.find({isVarify:true});
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
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/notification",verifyTokenAndAdmin, async(req,  res)=>{
   try {
      const user = await User.find({isVarify:false})
      res.status(200).json(user);
   } catch (error) {
      res.status(500).json(error);
   }
})

router.put('/varify/:id', verifyTokenAndAdmin,async(req,res)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put('/password/:id',verifyTokenAndAuthorization,async(req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      const inputPassword = req.body.old_password;
      originalPassword != inputPassword && 
      res.status(401).json("Wrong Password");   
      user.password =  CryptoJS.AES.encrypt(
        req.body.new_password,
        process.env.PASS_SEC
      ).toString()
     await user.save()
     res.status(201).json("password has been changed"); 
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

router.put('/profile/:id',verifyTokenAndAuthorization, async(req,res)=>{
   try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      }
    );
    res.status(200).json(updatedUser);
   } catch (error) {
    res.status(500).json(error)
   }
})

module.exports = router;
