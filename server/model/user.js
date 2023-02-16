import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      min: 3,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 3,
      required: true,
    },
    profilePic: {
      type: String,
      default: "default-dp.jpg",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("USER", userSchema);

export default User;
