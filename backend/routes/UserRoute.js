const express = require("express");
const router = express.Router();
const Usercontroller = require("../controllers/user/Usercontroller");

//route pour creer un utilisateur
router.post("/", Usercontroller.createUser);
//route d'inscription d'un utilisateur
router.post("/inscription", Usercontroller.createUser);
//route de connexion d'un utilisateur
router.post("/login", Usercontroller.loginUser);
//route pour modifier un utilisateur
router.put("/:iduser", Usercontroller.updateuser);
//route pour supprimer un utilisateur
router.delete("/:iduser", Usercontroller.deleteUser);
//route pour obtenir tous les utilisateurs
router.get("/", Usercontroller.getAllusers);
//route pour obtenir un utilisateur par son id
router.get("/:iduser", Usercontroller.getUser);
module.exports = router;
