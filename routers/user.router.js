const express = require("express");
const router = express.Router();

const {
  fetchUserNotifications,
} = require("../controllers/notification.controller");
const {
  login,
  searchById,
  signup,
  updateCurrentUserDetails,
  fetchUserPosts,
  follow,
  getUserFeed,
  fetchUserFollowers,
  fetchUserFollowing,
  getSingleUserInfo,
} = require("../controllers/user.controllers");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/follow").post(follow);

router.param("userId", searchById);
router.param("/:userId").get(getSingleUserInfo);
router.route("/feed/:userId").get(getUserFeed);
router.route("/followers/:userId").get(fetchUserFollowers);
router.route("/following/:userId").get(fetchUserFollowing);
router.route("/get-user-posts/:userId").get(fetchUserPosts);
router.route("/update/:userId").put(updateCurrentUserDetails);
router.route("/notifications/:userId").get(fetchUserNotifications);

module.exports = router;
