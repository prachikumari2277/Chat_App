const { addMessage, getMessages , clearChat } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/clearMessage/", clearChat);

module.exports = router;

