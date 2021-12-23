const express = require("express");
const router = express.Router();
const {
  getMessages,
  deleteMessageById,
} = require("../controllers/message.controller");

router.route("/get_messages").post(getMessages);
router.route("/:messageId").delete(deleteMessageById);

module.exports = router;
