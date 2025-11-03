const Statistique = require("../../models/admin/Statistique");

const createStatistique = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Aucun article fourni" });
    }

    // Transformation pour correspondre au modèle
    // Transformation pour correspondre au modèle
    const data = items.map((item) => ({
      produit: item.names || "Produit inconnu",
      prixUnitaire: item.price || 0,
      quantiteVendue: item.quantity || 0,
      revenuTotal: (item.price || 0) * (item.quantity || 0),
      periode: "jour",
      dateStat: new Date(),
      // Les autres champs optionnels
      admin_id: null,
      order_id: null,
      product_id: null,
      user_id: null,
    }));

    // Insertion en masse dans la base
    await Statistique.bulkCreate(data);

    return res.status(200).json({
      message: "Statistiques enregistrées avec succès",
      count: data.length,
    });
  } catch (error) {
    console.error("Erreur createStatistique:", error);
    return res.status(500).json({ message: "Une erreur est survenue", error });
  }
};

//  Récupérer toutes les statistiques
const getAllStatistique = async (req, res) => {
  try {
    const statistiques = await Statistique.findAll({
      order: [["dateStat", "DESC"]],
    });
    return res.status(200).json(statistiques);
  } catch (error) {
    console.error("Erreur getAllStatistique:", error);
    return res.status(500).json({ message: "Une erreur est survenue", error });
  }
};
module.exports = {
  createStatistique,
  getAllStatistique,
};
