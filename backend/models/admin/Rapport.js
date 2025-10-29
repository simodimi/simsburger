const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Rapport = sequelize.define("Rapport", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dateJour: { type: DataTypes.DATEONLY, allowNull: false },
  revenuJour: { type: DataTypes.FLOAT, defaultValue: 0 },
  revenuSemaine: { type: DataTypes.FLOAT, defaultValue: 0 },
  revenuMois: { type: DataTypes.FLOAT, defaultValue: 0 },
  commandesJour: { type: DataTypes.INTEGER, defaultValue: 0 },
  commandesSemaine: { type: DataTypes.INTEGER, defaultValue: 0 },
  commandesMois: { type: DataTypes.INTEGER, defaultValue: 0 },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Rapport;
