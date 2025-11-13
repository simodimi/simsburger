const Orderitem = require("../../models/user/Orderitem");
const { Op } = require("sequelize");

//creer un article de commande

const createOrderitem = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Aucun article fourni" });
    }
    const createOrders = await Promise.all(
      items.map((item) => {
        const totalRevenue = item.price * item.quantity;
        return Orderitem.create({
          product_id: item.product_id, // Gérer les deux cas
          names: item.names,
          quantity: item.quantity,
          price: item.price,
          type: item.type,
          isCustom: item.isCustom || false,
          removedItems: item.removedItems || [],
          customItems: item.customItems || [],
          order_id: item.order_id,
          total_revenue: totalRevenue,
          product_name: item.names, // Même chose que names pour cohérence
          order_date: new Date(),
          adresse: item.adresse,
          prixLivraison: item.prixLivraison,
          telephone: item.telephone,
        });
      })
    );
    if (global.io) {
      global.io.to("orders_room").emit("new_orderitems", createOrders);
    }
    res.status(200).json(createOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllOrderitems = async (req, res) => {
  try {
    const datelimite = new Date();
    datelimite.setMonth(datelimite.getMonth() - 3);
    await Orderitem.destroy({
      where: {
        order_date: {
          [Op.lt]: datelimite,
        },
      },
      order: [["date", "DESC"]],
    });
    //on recupere tous les messages recent
    const messages = await Orderitem.findAll({
      where: {
        order_date: {
          [Op.gte]: datelimite,
        },
      },
      order: [["order_date", "DESC"]],
    });

    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrderitem = async (req, res) => {
  try {
    const orderitems = await Orderitem.findByPk(req.params.id);
    if (!orderitems) {
      return res.status(404).json({ error: "Commande introuvable" });
    }
    await orderitems.destroy();
    res.status(200).json({ message: "commande supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// backend/controllers/user/Orderitemcontroller.js
const deleteOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deleted = await Orderitem.destroy({ where: { order_id: orderId } });

    if (deleted === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Commande introuvable" });
    }

    // Réponse toujours explicite avec code 200 et JSON
    return res.status(200).json({
      success: true,
      message: `Commande ${orderId} supprimée avec succès`,
    });
  } catch (error) {
    console.error("Erreur suppression :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrderitem,
  getAllOrderitems,
  deleteOrderitem,
  deleteOrderByOrderId,
};
