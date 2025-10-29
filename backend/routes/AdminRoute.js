const express = require("express");
const router = express.Router();
const Admincontroller = require("../controllers/admin/Admincontroller");

// validation via token (clic dans l'email)
router.get("/validation/:token", Admincontroller.validateAdminByToken);

// endpoint pour vérifier statut (polling frontend)
router.get(
  "/status/:idadmin",
  Admincontroller.verifyToken,
  Admincontroller.getAdminStatus
);
//route pour creer un utilisateur
router.post("/", Admincontroller.createAdmin);
//route d'inscription d'un utilisateur
router.post("/inscription", Admincontroller.createAdmin);
//route de connexion d'un utilisateur
router.post("/login", Admincontroller.loginAdmin);
//route pour modifier un utilisateur
router.put(
  "/:idadmin",
  Admincontroller.updateAdmin,
  Admincontroller.verifyToken
);
//route pour supprimer un utilisateur
router.delete(
  "/:idadmin",
  Admincontroller.deleteAdmin,
  Admincontroller.verifyToken
);
//route pour obtenir tous les utilisateurs
router.get("/", Admincontroller.verifyToken, Admincontroller.getAllAdmin);
//route pour obtenir un utilisateur par son id
router.get("/:idadmin", Admincontroller.getAdmin, Admincontroller.verifyToken);
module.exports = router;

router.get("/validation/:token", Admincontroller.validateAdminByToken);
// Route pour vérifier le token (AJOUTER)
router.get(
  "/verify/token",
  Admincontroller.verifyToken,
  Admincontroller.checkTokenValidity
);
//route pour réinitialiser le mot de passe admin
router.post("/forgotpassword", Admincontroller.forgotPassword);
router.post("/verifycode", Admincontroller.verifyCode);
router.post("/resetpassword", Admincontroller.resetPassword);
