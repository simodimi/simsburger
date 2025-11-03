const express = require("express");
const router = express.Router();
const Orderitemcontroller = require("../controllers/user/Orderitemcontroller");
//recuperation de tous les orderitems:
router.get("/", Orderitemcontroller.getAllOrderitems);
//creation de orderitems:
router.post("/", Orderitemcontroller.createOrderitem);
//suppression de orderitems:
router.delete("/:id", Orderitemcontroller.deleteOrderitem);
module.exports = router;
