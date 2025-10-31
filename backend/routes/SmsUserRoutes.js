const Message = require("../controllers/user/Messagecontroller");
const express = require("express");
const router = express.Router();

router.post("/", Message.createMessage);
router.get("/", Message.getAllMessage);
router.delete("/:idmessage", Message.deleteMessage);
module.exports = router;
