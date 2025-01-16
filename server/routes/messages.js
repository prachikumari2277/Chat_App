const { addMessage, getMessages , clearChat, sendPhoto , getPhoto} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/clearMessage/", clearChat);
router.post("/sendPhoto/", sendPhoto);
router.post("/getPhoto/", getPhoto);


module.exports = router;
