const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Admin = sequelize.define("Admin", {
  idadmin: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  adminemail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  adminpassword: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  inscriptiondateadmin: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  role: {
    type: DataTypes.ENUM("admin", "superadmin"),
    defaultValue: "admin",
    allowNull: false,
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, //attente de la validation du superadmin
  },
  validationToken: {
    type: DataTypes.STRING(255),
    allowNull: true, //token envoyé au superadmin pour validation
    field: "validationtoken",
  },
});

module.exports = Admin;
