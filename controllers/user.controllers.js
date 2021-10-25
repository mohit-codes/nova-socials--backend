require("dotenv").config();
const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { extend } = require("lodash");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.secret
      );
      return res.json({
        success: true,
        message: "Login Successful",
        user: user,
        token: token,
      });
    }
    return res.json({
      token: null,
      user: null,
      success: false,
      message: "Wrong password, please try again",
    });
  }
  return res.json({
    token: null,
    user: null,
    success: false,
    message: "No account found with entered email",
  });
};

const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = await User.findOne({ email: email }).catch((err) => {
    console.log(err);
  });
  if (user) {
    return res.json({
      token: null,
      user: null,
      success: false,
      message: "Account with email already exists, Try logging in instead!",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name },
      process.env.secret
    );

    return res.json({
      user: savedUser,
      token: token,
      success: true,
      message: "Signed up successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      user: null,
      token: null,
      message: err.message,
    });
  }
};

const searchById = async (req, res, next, userId) => {
  try {
    const userObject = await User.findById(userId);
    if (!userObject) {
      return res.json({ success: false, massage: "User not found" });
    }
    req.user = userObject;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to Update User",
      errorMessage: error.message,
    });
  }
};

const updateCurrentUserDetails = async (req, res) => {
  try {
    let userUpdate = req.body;
    let { user } = req;

    let search = await User.findOne({ username: userUpdate.username });

    if (search && search.email !== user.email) {
      return res.json({
        success: false,
        errorMessage: "Username already exists",
      });
    }

    user = extend(user, userUpdate);
    user = await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to Update User",
      errorMessage: err.message,
    });
  }
};

const follow = async (req, res) => {
  try {
    const { targetId, sourceId } = req.body;
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.json({ success: false, message: "Invalid Target Id" });
    }
    const sourceUser = await User.findById(sourceId);
    if (!sourceUser) {
      return res.json({ success: false, message: "Invalid Source Id" });
    }
    targetUser.followers.push(sourceId);
    sourceUser.following.push(targetUser);
    await targetUser.save();
    await sourceUser.save();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const { user } = req;
    const posts = Post.find({ author: user._id });
    return res.json({ success: true, posts: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  signup,
  updateCurrentUserDetails,
  searchById,
  follow,
  fetchUserPosts,
};
