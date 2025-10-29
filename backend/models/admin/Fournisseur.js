const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");
const Admin = require("./Admin");

const Fournisseur = sequelize.define("Fournisseur", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nomentreprise: { type: DataTypes.STRING, allowNull: false },
  logoproduit: { type: DataTypes.STRING, allowNull: true }, // URL ou chemin du logo
  nomproduit: { type: DataTypes.STRING, allowNull: false },
  telephone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  commentaire: { type: DataTypes.TEXT, allowNull: true },
  dateAjout: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  // ✅ Lien avec l’admin qui a créé ce fournisseur
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // important pour éviter l’erreur MySQLs
  },
});

module.exports = Fournisseur;
