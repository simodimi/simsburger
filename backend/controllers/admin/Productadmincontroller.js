// controllers/productController.js
const Product = require("../../models/admin/Productadmin");

// Récupération de tous les produits
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Erreur récupération produits:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits." });
  }
};

// Activation / désactivation d'un produit
const toggleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { active } = req.body;

    if (active === undefined) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir un statut 'active'." });
    }

    const product = await Product.findOne({ where: { productId } });
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable." });
    }

    // Mise à jour du statut
    product.active = active;
    await product.save();

    res.status(200).json({
      message: `Produit ${product.name} ${
        active ? "activé" : "désactivé"
      } avec succès.`,
      product,
    });
  } catch (error) {
    console.error("Erreur mise à jour produit:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du produit." });
  }
};

// Initialisation des produits si la base est vide
const initProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Veuillez fournir un tableau de produits." });
    }

    const existingProducts = await Product.findAll();
    if (existingProducts.length > 0) {
      return res.status(200).json({
        message: "Produits déjà initialisés",
        existingCount: existingProducts.length,
      });
    }

    await Product.bulkCreate(
      products.map((p) => ({
        productId: p.id,
        name: p.text,
        active: true,
      }))
    );

    res.status(200).json({
      message: "Initialisation des produits effectuée avec succès.",
      count: products.length,
    });
  } catch (error) {
    console.error("Erreur initialisation produits:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'initialisation des produits." });
  }
};

module.exports = {
  getAllProducts,
  toggleProduct,
  initProducts,
};
