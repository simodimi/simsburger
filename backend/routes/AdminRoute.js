/*const express = require("express");
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
// Logout (efface le cookie sécurisé)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Déconnexion réussie" });
});

//route pour réinitialiser le mot de passe admin
router.post("/forgotpassword", Admincontroller.forgotPassword);
router.post("/verifycode", Admincontroller.verifyCode);
router.post("/resetpassword", Admincontroller.resetPassword);*/
// routes/AdminRoute.js
const express = require("express");
const router = express.Router();
const Admincontroller = require("../controllers/admin/Admincontroller");

// Public
router.post("/inscription", Admincontroller.createAdmin);
router.post("/login", Admincontroller.loginAdmin);
router.get("/validation/:token", Admincontroller.validateAdminByToken);
router.post("/forgotpassword", Admincontroller.forgotPassword);
router.post("/verifycode", Admincontroller.verifyCode);
router.post("/resetpassword", Admincontroller.resetPassword);

// Logout (clear cookie)
router.post("/logout", Admincontroller.logoutAdmin);

// Vérifier token (route dédiée)
router.get(
  "/verify/token",
  Admincontroller.verifyToken,
  Admincontroller.checkTokenValidity
);

// Routes protégées exemple
router.get("/", Admincontroller.verifyToken, Admincontroller.getAllAdmin);
router.get("/:idadmin", Admincontroller.verifyToken, Admincontroller.getAdmin);
router.put(
  "/:idadmin",
  Admincontroller.verifyToken,
  Admincontroller.updateAdmin
);
router.delete(
  "/:idadmin",
  Admincontroller.verifyToken,
  Admincontroller.deleteAdmin
);

// Statut (exemple)
router.get(
  "/status/:idadmin",
  Admincontroller.verifyToken,
  Admincontroller.getAdminStatus
);

module.exports = router;
