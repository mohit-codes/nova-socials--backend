const express = require("express");
const authenticate = require("../middleware/authenticate");
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
  searchUser,
  getUserChats,
} = require("../controllers/user.controllers");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/follow").post(authenticate, follow);
router.route("/unfollow").post(authenticate, unFollow);
router.route("/search").get(authenticate, searchUser);

router.param("userId", searchById);
router.route("/:userId").get(authenticate, getSingleUserInfo);
router.route("/chats/:userId").get(authenticate, getUserChats);
router.route("/feed/:userId").get(authenticate, getUserFeed);
router.route("/followers").post(authenticate, fetchUserFollowers);
router.route("/following").post(authenticate, fetchUserFollowing);
router.route("/get-user-posts").post(authenticate, fetchUserPosts);
router.route("/update/:userId").put(authenticate, updateCurrentUserDetails);
router
  .route("/notifications/:userId")
  .get(authenticate, fetchUserNotifications);
router
  .route("/get-recently-joined-users/:userId")
  .get(fetchRecentlyJoinedUsers);

module.exports = router;
