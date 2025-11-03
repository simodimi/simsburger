const express = require("express");
const router = express.Router();
const Statistiquecontroller = require("../controllers/admin/Statistiquecontroller");
//recuperation de tous les statistiques:
router.get("/", Statistiquecontroller.getAllStatistique);
//creation de statistiques:
router.post("/", Statistiquecontroller.createStatistique);
module.exports = router;
