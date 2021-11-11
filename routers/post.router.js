const express = require("express");
const router = express.Router();
const {
  createPost,
  likePost,
  commentPost,
  deletePost,
  unlikePost,
  fetchLikes,
  fetchComments,
} = require("../controllers/post.controller");

router.route("/new").post(createPost);
router.route("/like").post(likePost);
router.route("/comment").post(commentPost);
router.route("/unlike").post(unlikePost);
router.route("/likes/:postId").get(fetchLikes);
router.route("/comments/:postId").get(fetchComments);
router.route("/delete/:postId").delete(deletePost);

module.exports = router;
