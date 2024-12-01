const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false, message: "No token found" });
  } else {
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.json({ status: false, message: "Invalid token" });
      } else {
        const user = await User.findById(data.id);
        req.userId = user._id;
        req.username = user.username;
        next();
      }
    });
  }
}

const verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        return res.json({
          status: true,
          username: user.username,
          userId: user._id,
        });
      } else {
        return res.json({ status: false });
      }
    }
  });
};

module.exports = {
  verifyToken,
};
