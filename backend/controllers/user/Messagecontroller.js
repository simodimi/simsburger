const Message = require("../../models/user/Message");
const { Op } = require("sequelize");
//creer un message
const createMessage = async (req, res) => {
  try {
    const { email_service, messageService } = req.body;
    if (!email_service || !messageService) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }
    //emailregex valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_service)) {
      return res
        .status(400)
        .json({ message: "Veuillez entrer une adresse email valide" });
    }
    const newMessage = await Message.create({ email_service, messageService });
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("Erreur createMessage:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const getAllMessage = async (req, res) => {
  try {
    //on calcule la date limite= il y'a 3 mois
    const dateLimite = new Date();
    dateLimite.setMonth(dateLimite.getMonth() - 3);
    //on supprime les messages plus vieux de 3 mois
    await Message.destroy({
      where: {
        date: {
          [Op.lt]: dateLimite,
        },
      },
    });
    //on recupere tous les messages recent
    const messages = await Message.findAll({
      where: {
        date: {
          [Op.gte]: dateLimite,
        },
        order: [["date", "DESC"]],
      },
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur getAllMessage:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.destroy({
      where: { idmessage: req.params.idmessage },
    });
    if (deleted) {
      return res.status(200).json({ message: "message supprimé" });
    } else {
      return res.status(404).json({ message: "message  introuvable" });
    }
  } catch (error) {
    console.error("erreur lors de la suppression du message ", error);
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
module.exports = { createMessage, getAllMessage, deleteMessage };
