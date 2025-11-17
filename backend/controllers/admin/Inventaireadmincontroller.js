const Inventaireadmin = require("../../models/admin/Inventaireadmin");
const Admin = require("../../models/admin/Admin");
const Mailjet = require("node-mailjet");
const { Parser } = require("json2csv"); //bibliotheque de conversion de json en csv

//utilitaire pour l'envoi des mails
const mailjet = new Mailjet({
  apiKey: process.env.EMAIL_USER,
  apiSecret: process.env.EMAIL_PASSWORD,
});
//création d'un inventaire de produit et envoie de mail au superadmin
const critiqueseuil = 2;
const createInventaire = async (req, res) => {
  try {
    const inventaires = req.body;

    if (!Array.isArray(inventaires) || inventaires.length === 0) {
      return res.status(400).json({ message: "Aucune donnée reçue." });
    }

    // Vérification des champs requis
    for (const item of inventaires) {
      const { nomproduit, numserie, numstock, dateperemption, perte } = item;
      if (
        !nomproduit ||
        numserie === undefined ||
        numstock === undefined ||
        !dateperemption ||
        perte === null ||
        perte === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Veuillez remplir tous les champs requis." });
      }
    }

    // Utiliser l'admin de verifyToken
    const adminId = req.admin.idadmin;

    // Ajouter les infos d'admin à chaque ligne
    const inventairesEnregistres = inventaires.map((item) => ({
      nomproduit: item.nomproduit,
      numserie: item.numserie,
      numstock: item.numstock,
      dateperemption: item.dateperemption,
      perte: item.perte,
      commentaire: item.commentaire || "",
      admin_id: adminId,
      dateEnregistrement: new Date(),
    }));

    // Insertion en masse (supprimer le code dupliqué)
    const newInventaires = await Inventaireadmin.bulkCreate(
      inventairesEnregistres
    );

    // Identifier les produits critiques (stock ≤ 2)
    const critiques = inventairesEnregistres.filter(
      (p) => Number(p.numstock) <= critiqueseuil
    );

    // Envoi d'email pour tous les inventaires
    try {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: { Email: process.env.SUPERADMIN_EMAIL, Name: "Sim'sburger" },
            To: [{ Email: process.env.SUPERADMIN_EMAIL, Name: "Superadmin" }],
            Subject: `Nouvel inventaire enregistré - ${new Date().toLocaleString()}`,
            HTMLPart: `
              <h2>Nouvel inventaire enregistré</h2>
              <p><strong>Réalisé par :</strong> ${req.admin.adminname}</p>
              <p><strong>Nombre de produits :</strong> ${inventaires.length}</p>
              <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>      
            `,
          },
        ],
      });
    } catch (err) {
      console.error("Erreur envoi mail notification :", err.message);
    }

    // Email pour produits critiques
    if (critiques.length > 0) {
      const produitsCritiquesHTML = critiques
        .map(
          (p) => `
          <li>
            <strong>${p.nomproduit}</strong> — Stock : ${p.numstock} 
            (péremption : ${p.dateperemption})
          </li>`
        )
        .join("");

      try {
        await mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: process.env.SUPERADMIN_EMAIL,
                Name: "Sim'sburger",
              },
              To: [{ Email: process.env.SUPERADMIN_EMAIL, Name: "Superadmin" }],
              Subject: `Alerte stock critique - ${new Date().toLocaleString()}`,
              HTMLPart: `  
                 <div style="text-align: center;">
                <h2>Alerte stock critique</h2>
                 <h1 style="margin-bottom: 10px;">Sim'burger</h1>
              <img src="http://localhost:5000/public/logo/logo.png" alt="Logo" style="width: 90px; height: 90px;" />
              </div>
                <p>${critiques.length} produit(s) en stock critique.</p>
                <p>Inventaire réalisé par ${
                  req.admin.adminname
                } le ${new Date().toLocaleString()}.</p>
                <p>Les produits suivants ont un stock inférieur ou égal à ${critiqueseuil} :</p>
                <ul>${produitsCritiquesHTML}</ul>
              `,
            },
          ],
        });
      } catch (err) {
        console.error("Erreur envoi mail alerte critique :", err.message);
      }
    }

    return res.status(200).json({
      message: "Inventaire enregistré avec succès.",
      inventaires: newInventaires,
    });
  } catch (error) {
    console.error("Erreur createInventaire:", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};
const deleteInventaire = async (req, res) => {
  try {
    const admin = req.admin;
    if (admin.role !== "superadmin") {
      return res.status(403).json({ message: "Accès interdit." });
    }
    const deleted = await Inventaireadmin.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "inventaire introuvable." });
    }
    return res.status(200).json({ message: "inventaire supprimé." });
  } catch (error) {
    return res.status(500).json({ message: "une erreur est survenue." });
  }
};
//recuperer les inventaires
const getInventairesForParam = async (req, res) => {
  try {
    const admin = req.admin;
    if (admin.role !== "superadmin") {
      return res.status(403).json({ message: "Accès réservé au superadmin." });
    }

    const inventaires = await Inventaireadmin.findAll({
      include: [
        { model: Admin, as: "admin", attributes: ["adminname", "adminemail"] },
      ],
      order: [["dateEnregistrement", "DESC"]],
    });

    res.status(200).json(inventaires);
  } catch (error) {
    console.error("Erreur getInventairesForParam :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// Téléchargement CSV (superadmin seulement)
const downloadInventairesCSV = async (req, res) => {
  try {
    const admin = req.admin;
    if (admin.role !== "superadmin") {
      return res.status(403).json({ message: "Accès réservé au superadmin." });
    }

    const inventaires = await Inventaireadmin.findAll({
      include: [
        { model: Admin, as: "admin", attributes: ["adminname", "adminemail"] },
      ],
      order: [["dateEnregistrement", "DESC"]],
      raw: true,
      nest: true,
    });

    const fields = [
      { label: "Nom produit", value: "nomproduit" },
      { label: "Num série", value: "numserie" },
      { label: "Quantité", value: "numstock" },
      { label: "Date péremption", value: "dateperemption" },
      { label: "Admin", value: "admin.adminname" },
      { label: "Date enregistrement", value: "dateEnregistrement" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(inventaires);

    res.header("Content-Type", "text/csv");
    res.attachment("inventaires.csv");
    res.send(csv);
  } catch (error) {
    console.error("Erreur downloadInventairesCSV :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
module.exports = {
  createInventaire,
  deleteInventaire,
  downloadInventairesCSV,
  getInventairesForParam,
};
