const express = require("express");
const router = express.Router();
const Usercontroller = require("../controllers/user/Usercontroller");
// Public
router.post("/inscription", Usercontroller.createUser);
router.post("/login", Usercontroller.loginUser);
router.get("/validation/:token", Usercontroller.validateUserByToken);
router.post("/forgotpassword", Usercontroller.forgotPassword);
router.post("/verifycode", Usercontroller.verifyCode);
router.post("/resetpassword", Usercontroller.resetPassword);

// Logout (clear cookie)
router.post("/logout", Usercontroller.logoutUser);

// Vérifier token (route dédiée)
router.get(
  "/verify/token",
  Usercontroller.verifyToken,
  Usercontroller.checkTokenValidity
);

// Routes protégées exemple
router.get("/", Usercontroller.verifyToken, Usercontroller.getAllusers);
router.get("/:iduser", Usercontroller.verifyToken, Usercontroller.getUser);
router.put("/:iduser", Usercontroller.verifyToken, Usercontroller.updateuser);
router.delete(
  "/:iduser",
  Usercontroller.verifyToken,
  Usercontroller.deleteUser
);
//mis à jour code bonus
router.post(
  "/updatecode",
  Usercontroller.verifyToken,
  Usercontroller.updatevaluecode
);
router.get(
  "/updatecode",
  Usercontroller.verifyToken,
  Usercontroller.updatevaluecode
);
//
router.get("/points", Usercontroller.verifyToken, Usercontroller.getUserPoints);

// 🟡 Mettre à jour les points après une commande
router.post(
  "/updatePoints",
  Usercontroller.verifyToken,
  Usercontroller.updateUserPoints
);
/*// Statut (exemple)
router.get(
  "/status/:iduser",
  Usercontroller.verifyToken,
  Usercontroller.getUserStatus
);*/
module.exports = router;
