const sequelize = require("../../config/database"); //importer la configuration de la base de données
const { DataTypes } = require("sequelize"); //importer les types de données

const User = sequelize.define("User", {
  iduser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nameuser: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mailuser: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  passworduser: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  inscriptiondateuser: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  pointscumules: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  pointsutilises: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  valuecode: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: null,
    validate: { len: [5, 5] },
  },
});
module.exports = User;
