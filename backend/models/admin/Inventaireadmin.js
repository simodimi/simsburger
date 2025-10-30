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
    allowNull: true,
  },
  nomproduit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numserie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numstock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  dateperemption: {
    type: DataTypes.DATE, // Changé en DATE pour meilleure gestion
    allowNull: false,
  },
  perte: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dateEnregistrement: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Inventaireadmin;
