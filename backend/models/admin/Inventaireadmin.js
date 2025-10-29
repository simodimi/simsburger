const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Inventaireadmin = sequelize.define("Inventaireadmin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numserie: {
    type: DataTypes.STRING,
  },
  numstock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dateperemption: {
    type: DataTypes.DATE, // Changé en DATE pour meilleure gestion
  },
  perte: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentaire: {
    type: DataTypes.TEXT,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dateEnregistrement: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Inventaireadmin;
