const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Statistiques = sequelize.define("Statistiques", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  periode: {
    type: DataTypes.ENUM("jour", "semaine", "mois"),
    allowNull: false,
  },
  produit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prixUnitaire: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  quantiteVendue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  revenuTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  dateStat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Statistiques;
