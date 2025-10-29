const express = require("express");
const router = express.Router();
const Fournisseurcontroller = require("../controllers/admin/Fournisseurcontroller");
const multer = require("multer");
const path = require("path");

//configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
//route avec creer un utilisateur et upload de fichier
router.post(
  "/",
  upload.single("logoproduit"),
  Fournisseurcontroller.createFournisseur
);
//route pour modifier un fournisseur
router.put("/:id", Fournisseurcontroller.updateFournisseur);
//route pour supprimer un fournisseur
router.delete("/:id", Fournisseurcontroller.deleteFournisseur);
//route pour obtenir tous les fournisseurs
router.get("/", Fournisseurcontroller.getAllFournisseur);
module.exports = router;
