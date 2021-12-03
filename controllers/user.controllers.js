require("dotenv").config();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { extend } = require("lodash");
const { newNotification } = require("./notification.controller");

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
        process.env.JWT_SECRET
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
  let user = await User.findOne({ email: email }).catch((err) => {
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
  user = await User.findOne({ username: username }).catch((err) => {
    console.log(err);
  });
  if (user) {
    return res.json({
      token: null,
      user: null,
      success: false,
      message: "Account with username already exists",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      bio: "Hi there! I'm using Nova Socials",
      profileUrl:
        "https://res.cloudinary.com/formula-web-apps/image/upload/v1623766149/148-1486972_mystery-man-avatar-circle-clipart_kldmy3.jpg",
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name },
      process.env.JWT_SECRET
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

const getSingleUserInfo = async (req, res) => {
  try {
    const { user } = req;
    return res.json({ success: true, user: user });
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
    await newNotification(targetId, sourceId, "NEW_FOLLOWER", 0);
    targetUser.followers.push(sourceId);
    sourceUser.following.push(targetUser);
    await targetUser.save();
    await sourceUser.save();
    return res.json({ success: true, targetUserId: targetUser._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unFollow = async (req, res) => {
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
    let index = targetUser.followers.indexOf(sourceId);
    targetUser.followers.splice(index, 1);
    index = sourceUser.following.indexOf(targetId);
    sourceUser.following.push(index, 1);
    await targetUser.save();
    await sourceUser.save();
    return res.json({ success: true, targetUserId: targetUser._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const { userId, clientId } = req.body;
    const user = await User.findById(userId);
    const posts = await Post.find({ author: user._id });
    let userPosts = [];

    for (const post of posts) {
      const isLikedByUser = post.likes.some(
        (id) => id.toString() === clientId.toString()
      );

      userPosts.push({
        ...post._doc,
        isLikedByUser: isLikedByUser,
        authorName: user.name,
        authorUsername: user.username,
        authorProfileUrl: user.profileUrl,
      });
    }

    return res.json({ success: true, posts: userPosts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUserFollowers = async (req, res) => {
  try {
    const { userId, clientId } = req.body;
    const user = await User.findById(userId);
    const client = await User.findById(clientId);
    const followers = await User.find(
      { _id: { $in: user.followers } },
      "_id name username profileUrl"
    );
    let result = [];
    for (const obj of followers) {
      const isFollowedByClient = client.following.some(
        (id) => obj.id.toString() === id.toString()
      );
      result.push({ ...obj._doc, isFollowedByClient });
    }
    return res.json({ success: true, followers: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchUserFollowing = async (req, res) => {
  try {
    const { userId, clientId } = req.body;
    const user = await User.findById(userId);
    const client = await User.findById(clientId);
    const following = await User.find(
      { _id: { $in: user.following } },
      "_id name username profileUrl"
    );
    let result = [];
    for (const obj of following) {
      const isFollowedByClient = client.following.some(
        (id) => obj.id.toString() === id.toString()
      );
      result.push({ ...obj._doc, isFollowedByClient });
    }
    return res.json({ success: true, following: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserFeed = async (req, res) => {
  try {
    const { user } = req;
    let tempFeed = [];
    let posts = await Post.find({ author: user._id });
    tempFeed.push(posts);
    for (const _user of user.following) {
      posts = await Post.find({ author: _user._id });
      tempFeed.push(posts);
    }
    tempFeed = tempFeed.flat();
    let feed = [];
    for (const post of tempFeed) {
      let author = await User.findById(post.author);
      const isLikedByUser = post.likes.some(
        (id) => id.toString() === user._id.toString()
      );
      feed.push({
        ...post._doc,
        isLikedByUser: isLikedByUser,
        authorName: author.name,
        authorUsername: user.username,
        authorProfileUrl: user.profileUrl,
      });
    }
    feed.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    return res.json({ success: true, feed: feed });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchRecentlyJoinedUsers = async (req, res) => {
  try {
    const { user } = req;
    const users = await User.find(
      { $and: [{ _id: { $nin: user.following } }, { _id: { $ne: user._id } }] },
      "id name username profileUrl"
    );
    return res.json({ success: true, users: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  signup,
  updateCurrentUserDetails,
  fetchRecentlyJoinedUsers,
  searchById,
  follow,
  unFollow,
  fetchUserPosts,
  fetchUserFollowers,
  fetchUserFollowing,
  getUserFeed,
  getSingleUserInfo,
};
