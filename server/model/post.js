import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "USER",
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "USER",
      },
    ],
    comments: [
      {
        text: String,
        userId: { type: mongoose.Types.ObjectId, ref: "USER" },
      },
    ],
  },
  { timestamps: true }
);
const Post = mongoose.model("POST", postSchema);

export default Post;
