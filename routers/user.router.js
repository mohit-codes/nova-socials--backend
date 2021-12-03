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
  unFollow,
  getUserFeed,
  fetchUserFollowers,
  fetchUserFollowing,
  getSingleUserInfo,
  fetchRecentlyJoinedUsers,
} = require("../controllers/user.controllers");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/follow").post(follow);
router.route("/unfollow").post(unFollow);

router.param("userId", searchById);
router.route("/:userId").get(getSingleUserInfo);
router.route("/feed/:userId").get(getUserFeed);
router.route("/followers").post(fetchUserFollowers);
router.route("/following").post(fetchUserFollowing);
router.route("/get-user-posts").post(fetchUserPosts);
router.route("/update/:userId").put(updateCurrentUserDetails);
router.route("/notifications/:userId").get(fetchUserNotifications);
router
  .route("/get-recently-joined-users/:userId")
  .get(fetchRecentlyJoinedUsers);

module.exports = router;
