const User = require("../../models/user/User");
const bcrypt = require("bcrypt");

//connexion utilisateur
const loginUser = async (req, res) => {
  try {
    const { mailuser, passworduser } = req.body; //recuperer les donnees de l'utilisateur
    if (!mailuser || !passworduser) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoires" });
    }
    //vérification de l'existence de l'user dans la base de données
    const user = await User.findOne({ where: { mailuser } });
    if (!user) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    //vérification du mot de passe de l'utilisateur
    const passwordmatch = await bcrypt.compare(passworduser, user.passworduser);
    if (!passwordmatch) {
      return res.status(401).json({ message: "mot de passe incorrect" });
    }
    //si tout est ok, renvoyer les données de l'utilisateur en excluant le mot de passe
    return res.status(200).json({
      iduser: user.iduser,
      mailuser: user.mailuser,
    });
  } catch (error) {
    console.error("erreur lors de la connexion", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};

//créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { nameuser, mailuser, passworduser, passwordconfirmuser } = req.body;
    if (!nameuser || !mailuser || !passworduser || !passwordconfirmuser) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoires" });
    }
    //mots de passe ne correspondent pas
    if (passworduser !== passwordconfirmuser) {
      return res
        .status(400)
        .json({ message: "les mots de passes ne correspondent pas" });
    }
    //vérification de l'existence de l'utilisateur dans la base de données
    const user = await User.findOne({ where: { mailuser } });
    if (user) {
      return res.status(400).json({ message: "utilisateur deja existant" });
    }
    //hachage du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(passworduser, salt);
    //création de l'utilisateur
    const newUser = await User.create({
      nameuser,
      mailuser,
      passworduser: hashedPassword,
    });
    //renvoyer les données de l'utilisateur en excluant le mot de passe
    return res.status(201).json({
      iduser: newUser.iduser,
      mailuser: newUser.mailuser,
      nameuser: newUser.nameuser,
    });
  } catch (error) {
    console.error("erreur lors de la création de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { iduser: req.params.iduser },
    }); //on supprime l'utilisateur de la base de données
    if (deleted) {
      return res.status(200).json({ message: "utilisateur supprimé" });
    } else {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur lors de la suppression de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
//recuperer tous les utilisateurs
const getAllusers = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: { exclude: ["passworduser"] },
    });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "une erreur est survenue" });
  }
};
//récupere un seul utilisateur
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.iduser, {
      attributes: { exclude: ["passworduser"] },
    });
    if (user) {
      return res.status(200).json(user);
    } else {
      res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: "une erreur est survenue" });
  }
};
//mis à jour d'un utilisateur
const updateuser = async (req, res) => {
  try {
    const { nameuser, mailuser, passworduser } = req.body;

    // Préparer les données à mettre à jour
    const updateData = { nameuser, mailuser };

    // Si un nouveau mot de passe est fourni, le hasher
    if (passworduser) {
      const hashedPassword = await bcrypt.hash(passworduser, 12);
      updateData.passworduser = hashedPassword;
    }

    const [updatedCount] = await User.update(updateData, {
      where: { iduser: req.params.iduser },
    });

    if (updatedCount > 0) {
      return res.status(200).json({ message: "Utilisateur mis à jour" });
    } else {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: "une erreur est survenue" });
  }
};
module.exports = {
  loginUser,
  createUser,
  deleteUser,
  getAllusers,
  getUser,
  updateuser,
};
