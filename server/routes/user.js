import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import User from "../model/user.js";
import { protect } from "../middleware/protect.js";
import multer from "multer";
import tokenGen from "../config/tokenGen.js";
import Post from "../model/post.js";

// get file in browser with localhost
router.use("/images", express.static("multer"));

//   file uploading with multer
var Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "multer");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: Storage }).single("file");

// user signup

router.post("/user/signup", upload, async (req, res) => {
  const { name, email, password } = req.body;
  const dp = req.file && req.file.filename;

  if (!name || !email || !password) {
    return res.status(400).send("please fill all the fields");
  }

  const userEmail = await User.findOne({ email: email });
  // const userUsername = await User.findOne({ username: username });
  if (userEmail) {
    return res.status(400).send("user already exist");
  }
  const hashPass = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name,
    email: email,
    password: hashPass,
    profilePic: dp,
  });

  if (user) {
    res.status(200).send(user);
  } else {
    res.status(400).send("user signup failed!");
  }
});
// user login
router.post("/user/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("please fill all the fields");
  }

  let userlog = await User.findOne({ email: email });
  if (userlog) {
    const userPassword = await bcrypt.compare(password, userlog.password);
    const accessToken = tokenGen(userlog._id);

    if (userPassword) {
      res.status(200).send({ userlog, accessToken });
    } else {
      res.status(400).send("invalid credentials");
    }
  } else {
    res.status(400).send("invalid credentials");
  }
});

// get all user
router.get("/allUser", protect, async (req, res) => {
  const allUser = await User.find();
  if (allUser) {
    res.status(200).send(allUser);
  } else {
    res.status(400).send("Users not found");
  }
});

//  get a user
router.get("/user/:id", protect, async (req, res) => {
  // if we dont want to send password and updatedAt as response then we can use 'select' method
  const getUser = await User.findById(req.params.id).select(
    "-password -updatedAt"
  );
  if (getUser) {
    const posts = await Post.find({ userId: req.params.id }).populate(
      "userId",
      "_id name profilePic"
    );
    res.status(200).send({ getUser, posts });
  } else {
    res.status(400).send("user not found!");
  }
});

// update user details
router.put("/user/update", protect, async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: req.body,
    },
    {
      new: true,
    }
  ).select("-password");

  if (updateUser) {
    res.status(200).send(updateUser);
  } else {
    res.status(400).send("user details are updated ");
  }
});

// delete user
router.delete("/user/delete", protect, async (req, res) => {
  const deleteUser = await User.findByIdAndDelete(req.user._id);
  if (deleteUser) {
    res.status(200).send("user account is deleted");
  } else {
    res.status(200).send("user account is not deleted!");
  }
});

// follow a user
router.put("/follow", protect, async (req, res) => {
  // req.user is from protect.js
  try {
    const loggedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { followings: req.body.userId },
      },
      {
        new: true,
      }
    ).select("-password");
    const followUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    );
    res.status(200).send(loggedUser);
  } catch (error) {
    console.log(error);
  }
});

// unfollow a user
router.put("/unfollow", protect, async (req, res) => {
  try {
    const loggedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { followings: req.body.userId },
      },
      {
        new: true,
      }
    ).select("-password");
    const followUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );
    res.status(200).send(loggedUser);
  } catch (error) {
    console.log(error);
  }
});

// get user by searching
router.get("/user-search", protect, async (req, res) => {
  try {
    const userPattern = req.query.search
      ? {
          $or: [
            {
              name: { $regex: req.query.search, $options: "i" },
            },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const user = await User.find(userPattern)
      .find({
        _id: { $ne: req.user._id },
      })
      .select("_id name profilePic");

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

//  friends whom i follow
router.get("/followingUser", protect, async (req, res) => {
  const friends = await User.find({
    _id: { $in: req.user.followings },
  }).select("_id name profilePic");

  if (friends) {
    res.status(200).send(friends);
  } else {
    res.status(400).send("posts are not found");
  }
});
//  friends who follow me
router.get("/followerUser", protect, async (req, res) => {
  const friends = await User.find({
    _id: { $in: req.user.followers },
  }).select("_id name profilePic");

  if (friends) {
    res.status(200).send(friends);
  } else {
    res.status(400).send("posts are not found");
  }
});

export default router;
