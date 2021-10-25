const express = require("express");
const router = express.Router();

const {
  login,
  searchById,
  signup,
  updateCurrentUserDetails,
  fetchUserPosts,
  follow,
} = require("../controllers/user.controllers");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/follow").post(follow);

router.param("userId", searchById);
router.route("/get-user-posts/:userId").get(fetchUserPosts);
router.route("/update/:userId").put(updateCurrentUserDetails);

module.exports = router;
