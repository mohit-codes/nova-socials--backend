const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const { Comment } = require("../models/comment.model");

const createPost = async (req, res) => {
  const { author, content } = req.body;
  try {
    const user = await User.findById(author);
    if (!user) {
      return res.json({ success: false, massage: "User not found" });
    }
    let newPost = new Post({ author: author, content: content });
    await newPost.save();
    return res.status(200).json({ success: true, message: "post created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const likePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, massage: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, massage: "User not found" });
    }
    post.likes.push(user._id);
    await post.save();
    return res.status(200).json({ success: true, message: "post liked" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const unlikePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, massage: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, massage: "User not found" });
    }
    post.likes.slice(user._id);
    await post.save();
    return res.status(200).json({ success: true, message: "post disliked" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const commentPost = async (req, res) => {
  const { userId, postId, comment } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, massage: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, massage: "User not found" });
    }
    const newComment = new Comment({
      comment: comment,
      commentBy: user._id,
      postId: post._id,
    });
    await newComment.save();
    return res.status(200).json({ success: true, message: "comment added" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ success: true, message: "post deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({
        success: false,
        message: "Invalid Id, post not found",
      });
    }
    const likes = await User.find(
      { _id: { $in: post.likes } },
      "_id name username"
    );
    return res.status(200).json({ success: true, likes: likes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({
        success: false,
        message: "Invalid Id, post not found",
      });
    }
    const comments = await Comment.find({ postId: post._id });
    return res.status(200).json({ success: true, comments: comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  likePost,
  commentPost,
  createPost,
  unlikePost,
  deletePost,
  fetchLikes,
  fetchComments,
};
