import express from "express";
const router = express.Router();
import Post from "../model/post.js";
import User from "../model/user.js";
import multer from "multer";
import { protect } from "../middleware/protect.js";

router.use("/images", express.static("multer"));

var Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "multer");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: Storage }).single("file");

// create a post
router.post("/post/create", protect, upload, async (req, res) => {
  // const { desc } = req.body;
  const desc = req.body.desc;
  const img = req.file && req.file.filename;

  if (!desc && !img) {
    return res.status(400).send("please fill any field!");
  }

  const newPost = await Post.create({
    userId: req.user._id,
    desc: desc,
    img: img,
  });

  if (newPost) {
    res.status(200).send(newPost);
  } else {
    res.status(400).send("create post failed!");
  }
});

// get a post
router.get("/post/:postId", protect, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(400).send("post not found");
  }
});

// delete a post
router.delete("/post/delete/:postId", protect, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  // we are using toString() bcuz it would return  id as a object
  if (post.userId.toString() === req.user._id.toString()) {
    // console.log(post.userId);
    await post.deleteOne();
    res.status(200).send(post);
  } else {
    res.status(400).send("you can delete only your post");
  }
});

// like and dislike the post
router.put("/post/like-dislike", protect, async (req, res) => {
  const post = await Post.findById(req.body.postId);
  if (!post.likes.includes(req.user._id)) {
    await post.updateOne({ $push: { likes: req.user._id } });
    res.status(200).send("the post has been liked");
  } else {
    await post.updateOne({ $pull: { likes: req.user._id } });
    res.status(200).send("the post has been disliked");
  }
});

router.put("/post/like", protect, async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).populate("userId", "_id name profilePic");
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(400).send("error");
  }
});
router.put("/post/dislike", protect, async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).populate("userId", "_id name profilePic");
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(400).send("error");
  }
});

router.put("/post/comment", protect, async (req, res) => {
  const comment = { text: req.body.text, userId: req.user._id };
  const post = await Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("userId", "_id name profilePic")
    .populate("comments.userId", "_id name profilePic");
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(400).send("error");
  }
});

// all user post in feed
router.get("/allPost", protect, async (req, res) => {
  const posts = await Post.find()
    .populate("userId", "_id name profilePic")
    .populate("comments.userId", "_id name")
    .sort("-createdAt");
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(400).send("posts are not found");
  }
});

// get user's all posts
router.get("/myPost", protect, async (req, res) => {
  const posts = await Post.find({ userId: req.user._id }).sort("-createdAt");
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(400).send("user's posts not found!");
  }
});

// get following user's posts
router.get("/followingUserPost", protect, async (req, res) => {
  const posts = await Post.find({ userId: { $in: req.user.followings } })
    .populate("userId", "_id name profilePic")
    .populate("comments.userId", "_id name")
    .sort("-createdAt");
  if (posts) {
    res.status(200).send(posts);
  } else {
    res.status(400).send("posts are not found");
  }
});

export default router;
