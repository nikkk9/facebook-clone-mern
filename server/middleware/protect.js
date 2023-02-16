import jwt from "jsonwebtoken";
const jwtkey = process.env.JWTKEY;
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decode token id
      const decode = jwt.verify(token, jwtkey);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.send("token not authorized!");
    }
  }
  if (!token) {
    res.status(400).send("token not found");
  }
};
