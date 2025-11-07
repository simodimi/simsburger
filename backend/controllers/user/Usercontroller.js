const User = require("../../models/user/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Mailjet = require("node-mailjet");
const { NOEXPAND } = require("sequelize/lib/table-hints");

//générer un token jwt
const generateToken = (user) => {
  return jwt.sign(
    {
      iduser: user.iduser,
      mailuser: user.mailuser,
      nameuser: user.nameuser,
    },
    process.env.JWT_SECRET_USER,
    { expiresIn: "5h" }
  );
};
//utilitaire pour l'envoi des mails
const mailjet = new Mailjet({
  apiKey: process.env.EMAIL_USER,
  apiSecret: process.env.EMAIL_PASSWORD,
});
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
    //generer un token de confirmation
    const token = crypto.randomBytes(32).toString("hex");
    //hachage du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(passworduser, salt);
    //création de l'utilisateur
    const newUser = await User.create({
      nameuser,
      mailuser,
      passworduser: hashedPassword,
      validationToken: token,
    });
    //envoyer l'email de confirmation

    // Option: envoyer un email de confirmation à l'user validé
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: process.env.SUPERADMIN_EMAIL, Name: "Sim'sburger" },
          To: [{ Email: newUser.mailuser, Name: newUser.nameuser }],
          Subject: "Compte crée avec succès",
          HTMLPart: `
           <div style="text-align: center;">
              <h1 style="margin-bottom: 10px;">Sim'burger</h1>
              <img src="http://localhost:5000/public/logo/logo.png" alt="Logo" style="width: 90px; height: 90px;" />
              </div>
              
          <p>Bonjour ${newUser.nameuser}, votre compte a été crée avec succès.</p>`,
        },
      ],
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
    const token = generateToken(user);

    // Cookie options : secure en production, httpOnly, sameSite Strict
    const cookieOptions = {
      httpOnly: true,
      secure: true, // true en prod (HTTPS)
      sameSite: "None",
      maxAge: 5 * 60 * 60 * 1000, // 5h
      // domain: process.env.COOKIE_DOMAIN // optionnel si besoin
    };

    res.cookie("token", token, cookieOptions);
    //si tout est ok, renvoyer les données de l'utilisateur en excluant le mot de passe
    return res.status(200).json({
      iduser: user.iduser,
      mailuser: user.mailuser,
      nameuser: user.nameuser,
    });
  } catch (error) {
    console.error("erreur lors de la connexion", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
// Validation via token (clic dans l'email)
const validateUserByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { validationToken: token } });
    if (!user)
      return res.status(404).send("Lien invalide ou utilisateur introuvable");
    user.validationToken = null;
    await user.save();

    // redirige ou message
    return res.send("Compte activé avec succès !");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur serveur");
  }
};
/*//endpoint pour verifier statut (polling frontend)
const getUserStatus = async (req, res) => {
  try {
    const iduser = req.params.iduser;
    const user = await Admin.findByPk(iduser, {
      attributes: ["iduser"],
    });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });
    return res.status(200).json({ iduser: user.iduser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};*/
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
// --- checkTokenValidity : renvoie les données admin fraîches ---jw
const checkTokenValidity = async (req, res) => {
  try {
    // Ici verifyToken a déjà été exécuté (middleware), et req.admin est present
    const user = await User.findByPk(req.user.iduser, {
      attributes: ["iduser", "nameuser", "mailuser"],
    });
    if (!user) {
      return res
        .status(401)
        .json({ valid: false, message: "Utilisateur introuvable" });
    }
    // Token valide
    return res.status(200).json({
      valid: true,
      user: {
        iduser: user.iduser,
        nameuser: user.nameuser,
        mailuser: user.mailuser,
      },
    });
  } catch (error) {
    console.error("checkTokenValidity error:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Erreur de vérification" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { mailuser } = req.body;
    if (!mailuser) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir le champ email" });
    }
    const user = await User.findOne({ where: { mailuser } });
    if (!user) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    //return res.status(200).json();
    const code = generateVerificationCode();
    //stockage du code temporairement
    verificationCodes.set(mailuser, { code, timestamp: Date.now() });
    //nettoyer les codes temporairements expirés
    cleanExpiredCodes();
    // Envoyer l’email
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: process.env.SUPERADMIN_EMAIL, Name: "Sim'sburger" },
          To: [{ Email: user.mailuser, Name: user.nameuser }],
          Subject: "Code de vérification - Réinitialisation de mot de passe",
          HTMLPart: `
            <div style="text-align: center;">
              <h1>Sim'sburger</h1>
              <p>Bonjour ${user.nameuser},</p>
              <p>Voici votre code de vérification :</p>
              <h2>${code}</h2>
              <p>Ce code expirera dans 5 minutes.</p>
              <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
            </div>
          `,
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "Code de vérification envoyé par email" });
  } catch (error) {
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString().padStart(6, "0");
};
//stockage temporaire du code
const verificationCodes = new Map();
// Fonction pour nettoyer les codes expirés
const cleanExpiredCodes = () => {
  const now = Date.now();
  for (const [mailuser, data] of verificationCodes.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      // 5 minutes
      verificationCodes.delete(mailuser);
    }
  }
};
// --- Vérification du code ---
const verifyCode = async (req, res) => {
  try {
    const { mailuser, code } = req.body;
    const entry = verificationCodes.get(mailuser);

    if (!entry) {
      return res
        .status(400)
        .json({ message: "Aucun code trouvé pour cet email ou expiré" });
    }

    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      verificationCodes.delete(mailuser);
      return res.status(400).json({ message: "Code expiré" });
    }

    if (entry.code !== code) {
      return res.status(400).json({ message: "Code invalide" });
    }

    // Code correct → on le supprime pour éviter la réutilisation
    verificationCodes.delete(mailuser);

    return res.status(200).json({ message: "Code vérifié avec succès" });
  } catch (error) {
    console.error("Erreur verifyCode:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { mailuser, passworduser } = req.body;

    // Vérifier les champs
    if (!mailuser || !passworduser) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { mailuser } });
    if (!user) {
      return res.status(404).json();
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(passworduser, 10);

    // Mettre à jour le mot de passe
    user.passworduser = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la mise à jour" });
  }
};
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Déconnexion réussie" });
};
// --- MIDDLEWARE verifyToken : lit cookie httpOnly ---
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

    // Vérifier que l'admin existe toujours et est actif
    const user = await User.findByPk(decoded.iduser);
    if (!user) {
      return res.status(401).json({ message: "user non valide" });
    }

    // Attacher les infos utiles à req
    req.user = {
      iduser: user.iduser,
      nameuser: user.nameuser,
      mailuser: user.mailuser,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    console.error("verifyToken error:", error);
    return res.status(401).json({ message: "Token invalide" });
  }
};
//mis à jour code valuecode
const updatevaluecode = async (req, res) => {
  try {
    const { valuecode } = req.body;
    const iduser = req.user.iduser;

    if (!valuecode || valuecode.toString().length !== 5) {
      return res
        .status(400)
        .json({ message: "Le code doit contenir 5 chiffres" });
    }

    const [updatedCount] = await User.update(
      { valuecode },
      { where: { iduser } }
    );

    if (updatedCount > 0) {
      return res.status(200).json({ message: "Code fidélité mis à jour" });
    } else {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
  } catch (error) {
    console.error("Erreur updatevaluecode:", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const getUserPoints = async (req, res) => {
  try {
    const iduser = req.user.iduser;
    const user = await User.findByPk(iduser);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const pointsrestant = user.pointscumules - user.pointsutilises;

    res.status(200).json({
      pointscumules: user.pointscumules,
      pointsutilises: user.pointsutilises,
      pointsrestant,
    });
  } catch (error) {
    console.error("Erreur getUserPoints:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des points" });
  }
};

const updateUserPoints = async (req, res) => {
  try {
    const { pointsGagnes, pointsDepenses } = req.body;
    const iduser = req.user.iduser;

    const user = await User.findByPk(iduser);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    user.pointscumules = Number(user.pointscumules) + Number(pointsGagnes || 0);
    user.pointsutilises =
      Number(user.pointsutilises) + Number(pointsDepenses || 0);

    await user.save();

    const pointsrestant = user.pointscumules - user.pointsutilises;
    res.status(200).json({
      message: "Points mis à jour avec succès",
      pointscumules: user.pointscumules,
      pointsutilises: user.pointsutilises,
      pointsrestant,
    });
  } catch (error) {
    console.error("Erreur updateUserPoints:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour des points" });
  }
};

module.exports = {
  loginUser,
  createUser,
  deleteUser,
  getAllusers,
  getUser,
  updateuser,
  checkTokenValidity,
  verifyCode,
  resetPassword,
  logoutUser,
  verifyToken,
  forgotPassword,
  validateUserByToken,
  updatevaluecode,
  getUserPoints,
  updateUserPoints,
};
