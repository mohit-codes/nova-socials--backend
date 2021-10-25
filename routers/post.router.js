const express = require("express");
const router = express.Router();
const {
  createPost,
  likePost,
  commentPost,
  deletePost,
} = require("../controllers/");

router.route("/new").post(createPost);
router.route("/like").post(likePost);
router.route("/comment").post(commentPost);

router.route("/delete").delete(deletePost);
