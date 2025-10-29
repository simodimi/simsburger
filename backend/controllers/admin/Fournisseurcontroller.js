const Fournisseur = require("../../models/admin/Fournisseur");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Mailjet = require("node-mailjet");
const fs = require("fs");
const path = require("path");

//creer un fournisseur
const createFournisseur = async (req, res) => {
  try {
    const { nomentreprise, nomproduit, telephone, email, commentaire } =
      req.body;
    //générer url complete pour le logo
    const logoproduit = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    if (!nomentreprise || !nomproduit || !telephone || !email) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs." });
    }
    //verifions si le fournisseur existe
    const fournisseur = await Fournisseur.findOne({ where: { email } });
    if (fournisseur) {
      return res.status(400).json({ message: "Ce fournisseur existe deja." });
    }
    //creer un fournisseur
    const newFournisseur = await Fournisseur.create({
      nomentreprise,
      logoproduit,
      nomproduit,
      telephone,
      email,
      commentaire,
    });
    return res.status(200).json(newFournisseur);
  } catch (error) {
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};
const updateFournisseur = async (req, res) => {
  try {
    const {
      nomentreprise,
      logoproduit,
      nomproduit,
      telephone,
      email,
      commentaire,
    } = req.body;
    const [updatedfournisseur] = await Fournisseur.update(
      {
        nomentreprise,
        logoproduit,
        nomproduit,
        telephone,
        email,
        commentaire,
      },
      { where: { id: req.params.id } }
    );
    if (!updatedfournisseur) {
      return res.status(404).json({ message: "fournisseur non trouvé." });
    }
    return res.status(200).json({ message: "fournisseur mis à jour." });
  } catch (error) {
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};
const deleteFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOne({
      where: { id: req.params.id },
    });

    if (!fournisseur) {
      return res.status(404).json({ message: "fournisseur non trouve" });
    }
    //supprimer l'image si elle existe
    if (fournisseur.logoproduit) {
      //extraire le nom du fichier depuis l'url
      const filename = fournisseur.logoproduit.split("/uploads/")[1];
      const filepath = path.join(__dirname, "../../uploads", filename);

      fs.unlink(filepath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression du fichier:", err);
        }
      });
    }

    await fournisseur.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "fournisseur supprimé" });
  } catch (error) {
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const getAllFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findAll();
    if (fournisseur) {
      return res.status(200).json(fournisseur);
    } else {
      return res.status(404).json({ message: "fournisseur non trouvé" });
    }
  } catch (error) {
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
module.exports = {
  createFournisseur,
  updateFournisseur,
  deleteFournisseur,
  getAllFournisseur,
};
