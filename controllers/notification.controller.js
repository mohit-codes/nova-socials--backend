const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const newNotification = async (targetId, sourceId, type, postId) => {
  try {
    let notification;
    if (postId === 0) {
      notification = new Notification({
        targetId: targetId,
        sourceId: sourceId,
        isRead: false,
        type: type,
      });
    } else {
      notification = new Notification({
        targetId: targetId,
        sourceId: sourceId,
        isRead: false,
        type: type,
        postId: postId,
      });
    }
    await notification.save();
  } catch (error) {
    console.log(error);
  }
};

const fetchUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "invalid id, user not found",
      });
    }
    let result = [];
    const notifications = await Notification.find({ targetId: userId }).sort({
      createdAt: -1,
    });
    for (const notification of notifications) {
      const _user = await User.findById(notification.sourceId);
      result.push({
        ...notification._doc,
        sourceName: _user.name,
      });
    }
    return res.json({ success: true, notifications: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { newNotification, fetchUserNotifications };
