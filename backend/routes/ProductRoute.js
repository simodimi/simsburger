const express = require("express");
const router = express.Router();
const Productcontroller = require("../controllers/admin/Productadmincontroller");

//recuperation de tous les status:
router.get("/", Productcontroller.getAllProducts);
//modification de status:
router.put("/:productId", Productcontroller.toggleProduct);
//init du frontend:
router.post("/init", Productcontroller.initProducts);
module.exports = router;
