const express = require("express");
const router = express.Router();
const InventaireController = require("../controllers/admin/Inventaireadmincontroller");
const { verifyToken } = require("../controllers/admin/Admincontroller");

// Toutes les routes nécessitent l’authentification
router.post("/", verifyToken, InventaireController.createInventaire);
router.get("/param", verifyToken, InventaireController.getInventairesForParam);
router.get(
  "/download",
  verifyToken,
  InventaireController.downloadInventairesCSV
);
router.delete("/:id", verifyToken, InventaireController.deleteInventaire);
module.exports = router;
