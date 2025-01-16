const Messages = require("../models/messageModel");
const Users = require("../models/messageModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



const uploadDirectory = "./uploads/";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});




module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        photo: msg.message.file || null, 
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.clearChat = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    await Messages.deleteMany({
      users: {
        $all: [from, to],
      },
    });

    res.json({ msg: "Chat cleared successfully" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.sendPhoto = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { from, to } = req.body;

      if (!req.file) {
        return res.status(400).json({ success: false, msg: "No file provided." });
      }    
      const imageUrl = `/uploads/${req.file.filename}`; 
      const data = await Messages.create({
        message: { text: imageUrl },
        users: [from, to],
        sender: from,
      });

      if (data) {
        return res.status(200).json({
          success: true,
          imageUrl,
          msg: "Photo uploaded and message added successfully.",
        });
      } else {
        return res.status(500).json({
          success: false,
          msg: "Failed to add photo message to the database.",
        });
      }
    } catch (error) {
      console.error("Error in sendPhoto route:", error);
      next(error);
    }
  },
];


module.exports.getPhoto = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const photoMessages = messages
      .filter((msg) => msg.message.text.startsWith("/uploads/"))
      .map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          photoUrl: msg.message.text,
        };
      });

    if (photoMessages.length > 0) {
      return res.status(200).json(photoMessages);
    } else {
      return res.status(404).json({
        success: false,
        msg: "No photo messages found between the users.",
      });
    }
  } catch (error) {
    console.error("Error in getPhoto:", error.message);
    next(error);
  }
};






