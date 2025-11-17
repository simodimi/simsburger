const Admin = require("../../models/admin/Admin");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Mailjet = require("node-mailjet");
const { NOEXPAND } = require("sequelize/lib/table-hints");

//utilitaire pour l'envoi des mails
const mailjet = new Mailjet({
  apiKey: process.env.EMAIL_USER,
  apiSecret: process.env.EMAIL_PASSWORD,
});
//générer un token jwt
const generateToken = (admin) => {
  return jwt.sign(
    {
      idadmin: admin.idadmin,
      adminemail: admin.adminemail,
      adminname: admin.adminname,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );
};
//créer un utilisateur
const createAdmin = async (req, res) => {
  try {
    const { adminemail, adminpassword, adminname, adminpasswordconfirm } =
      req.body;
    if (!adminname || !adminemail || !adminpassword || !adminpasswordconfirm) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoires" });
    }
    //mots de passe ne correspondent pas
    if (adminpassword !== adminpasswordconfirm) {
      return res
        .status(400)
        .json({ message: "les mots de passes ne correspondent pas" });
    }
    //vérification de l'existence de l'utilisateur dans la base de données
    const user = await Admin.findOne({ where: { adminemail } });
    if (user) {
      return res.status(400).json({ message: "utilisateur deja existant" });
    }
    //generer un token de confirmation
    const token = crypto.randomBytes(32).toString("hex");
    //hachage du mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminpassword, salt);
    //création de l'utilisateur
    const newUser = await Admin.create({
      adminname,
      adminemail,
      adminpassword: hashedPassword,
      role: "admin",
      isactive: false,
      validationToken: token,
    });
    //envoi de l'email de confirmation au superadmin
    try {
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: process.env.SUPERADMIN_EMAIL,
              Name: "Sim'sburger",
            },
            To: [
              {
                Email: process.env.SUPERADMIN_EMAIL,
                Name: "Super Admin",
              },
            ],
            Subject: "Nouvel administrateur à valider",
            HTMLPart: `
             <div style="text-align: center;">
              <h1 style="margin-bottom: 10px;">Sim'burger</h1>
              <img src="http://localhost:5000/public/logo/logo.png" alt="Logo" style="width: 90px; height: 90px;" />
              </div>
                <p>Bonjour Superadmin,</p>
                <p>Un nouvel administrateur souhaite s'inscrire :</p>
                <ul>
                  <li>Nom: ${newUser.adminname}</li>
                  <li>Email: ${newUser.adminemail}</li>
                </ul>
                <p>Pour valider le compte, cliquez sur ce lien :</p>
          <p><a href="${process.env.BASE_URL}/admin/validation/${token}">Valider l'administrateur</a></p>
              `,
          },
        ],
      });

      console.log("Email envoyé au superadmin avec succès");
    } catch (emailError) {
      console.error("Erreur envoi mail:", emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }

    //renvoyer les données de l'utilisateur en excluant le mot de passe
    return res.status(201).json({
      idadmin: newUser.idadmin,
      adminemail: newUser.adminemail,
      adminname: newUser.adminname,
    });
  } catch (error) {
    console.error("erreur lors de la création de l'utilisateur", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { adminemail, adminpassword } = req.body;
    if (!adminemail || !adminpassword) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoires" });
    }

    const user = await Admin.findOne({ where: { adminemail } });
    if (!user) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }

    if (!user.isactive) {
      return res.status(403).json({
        message:
          "Votre compte n'est pas encore validé par le super administrateur.",
      });
    }

    const passwordmatch = await bcrypt.compare(
      adminpassword,
      user.adminpassword
    );
    if (!passwordmatch) {
      return res.status(401).json({ message: "mot de passe incorrect" });
    }

    const token = generateToken(user);

    // Cookie options : secure en production, httpOnly, sameSite Strict
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 5 * 60 * 60 * 1000, // 5h
      // domain: process.env.COOKIE_DOMAIN // optionnel si besoin
    };

    res.cookie("token", token, cookieOptions);

    // Ne PAS renvoyer le token côté client. Renvoie uniquement les données utiles (sans password)
    return res.status(200).json({
      idadmin: user.idadmin,
      adminemail: user.adminemail,
      adminname: user.adminname,
      role: user.role,
    });
  } catch (error) {
    console.error("erreur lors de la connexion", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const validateAdminByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await Admin.findOne({ where: { validationToken: token } });
    if (!user)
      return res.status(404).send("Lien invalide ou utilisateur introuvable");

    user.isactive = true;
    user.validationToken = null;
    await user.save();

    // Option: envoyer un email de confirmation à l'admin validé
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: process.env.SUPERADMIN_EMAIL, Name: "Sim'sburger" },
          To: [{ Email: user.adminemail, Name: user.adminname }],
          Subject: "Compte validé",
          HTMLPart: `
           <div style="text-align: center;">
              <h1 style="margin-bottom: 10px;">Sim'burger</h1>
              <img src="http://localhost:5000/public/logo/logo.png" alt="Logo" style="width: 90px; height: 90px;" />
              </div>
          <p>Bonjour ${user.adminname}, votre compte a été activé.</p>`,
        },
      ],
    });

    // redirige ou message
    return res.send("Compte activé avec succès !");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur serveur");
  }
};

// Endpoint pour vérifier le statut d'un admin (polling côté frontend)
const getAdminStatus = async (req, res) => {
  try {
    const idadmin = req.params.idadmin;
    const user = await Admin.findByPk(idadmin, {
      attributes: ["idadmin", "isactive"],
    });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });
    return res
      .status(200)
      .json({ idadmin: user.idadmin, isactive: user.isactive });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.destroy({
      where: { idadmin: req.params.idadmin },
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
const getAllAdmin = async (req, res) => {
  try {
    const user = await Admin.findAll({
      attributes: { exclude: ["adminpassword"] },
    });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "une erreur est survenue" });
  }
};
//récupere un seul utilisateur
const getAdmin = async (req, res) => {
  try {
    const user = await Admin.findByPk(req.params.idadmin, {
      attributes: { exclude: ["adminpassword"] },
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
const updateAdmin = async (req, res) => {
  try {
    const { adminname, adminemail, adminpassword, isactive } = req.body;
    // Préparer les données à mettre à jour
    const updateData = { adminname, adminemail };
    if (isactive !== "undefined") {
      updateData.isactive = isactive;
    }
    // Si un nouveau mot de passe est fourni, le hasher
    if (adminpassword) {
      const hashedPassword = await bcrypt.hash(adminpassword, 12);
      updateData.adminpassword = hashedPassword;
    }

    const [updatedCount] = await Admin.update(updateData, {
      where: { idadmin: req.params.idadmin },
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

// --- checkTokenValidity : renvoie les données admin fraîches ---
const checkTokenValidity = async (req, res) => {
  try {
    // Ici verifyToken a déjà été exécuté (middleware), et req.admin est present
    const admin = await Admin.findByPk(req.admin.idadmin, {
      attributes: ["idadmin", "adminemail", "adminname", "role", "isactive"],
    });
    if (!admin || !admin.isactive) {
      return res
        .status(401)
        .json({ valid: false, message: "Admin non valide" });
    }
    return res.status(200).json({
      valid: true,
      admin: {
        idadmin: admin.idadmin,
        adminemail: admin.adminemail,
        adminname: admin.adminname,
        role: admin.role,
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
    const { adminemail } = req.body;
    if (!adminemail) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir le champ email" });
    }
    const user = await Admin.findOne({ where: { adminemail } });
    if (!user) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    //return res.status(200).json();
    const code = generateVerificationCode();
    //stockage du code temporairement
    verificationCodes.set(adminemail, { code, timestamp: Date.now() });
    //nettoyer les codes temporairements expirés
    cleanExpiredCodes();
    // Envoyer l’email
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: process.env.SUPERADMIN_EMAIL, Name: "Sim'sburger" },
          To: [{ Email: adminemail, Name: user.adminname }],
          Subject: "Code de vérification - Réinitialisation de mot de passe",
          HTMLPart: `
            <div style="text-align: center;">
              <h1>Sim'sburger</h1>
              <p>Bonjour ${user.adminname},</p>
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
  for (const [adminemail, data] of verificationCodes.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      // 5 minutes
      verificationCodes.delete(adminemail);
    }
  }
};
// --- Vérification du code ---
const verifyCode = async (req, res) => {
  try {
    const { adminemail, code } = req.body;
    const entry = verificationCodes.get(adminemail);

    if (!entry) {
      return res
        .status(400)
        .json({ message: "Aucun code trouvé pour cet email ou expiré" });
    }

    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      verificationCodes.delete(adminemail);
      return res.status(400).json({ message: "Code expiré" });
    }

    if (entry.code !== code) {
      return res.status(400).json({ message: "Code invalide" });
    }

    // on le supprime pour éviter la réutilisation
    verificationCodes.delete(adminemail);

    return res.status(200).json({ message: "Code vérifié avec succès" });
  } catch (error) {
    console.error("Erreur verifyCode:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { adminemail, adminpassword } = req.body;

    // Vérifier les champs
    if (!adminemail || !adminpassword) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    // Vérifier si l'utilisateur existe
    const user = await Admin.findOne({ where: { adminemail } });
    if (!user) {
      return res.status(404).json();
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(adminpassword, 10);

    // Mettre à jour le mot de passe
    user.adminpassword = hashedPassword;
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
const logoutAdmin = (req, res) => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'admin existe toujours et est actif
    const admin = await Admin.findByPk(decoded.idadmin);
    if (!admin || !admin.isactive) {
      return res.status(401).json({ message: "Admin non valide" });
    }

    // Attacher les infos utiles à req
    req.admin = {
      idadmin: admin.idadmin,
      adminemail: admin.adminemail,
      adminname: admin.adminname,
      role: admin.role,
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
module.exports = {
  loginAdmin,
  createAdmin,
  deleteAdmin,
  getAllAdmin,
  getAdmin,
  updateAdmin,
  getAdminStatus,
  validateAdminByToken,
  verifyToken,
  checkTokenValidity,
  forgotPassword,
  verifyCode,
  resetPassword,
  logoutAdmin,
};
