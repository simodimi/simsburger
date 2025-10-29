const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Messageclient = sequelize.define("Messageclient", {
  idmessageclient: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email_service: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  messageService: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  user_id: {
    // clé étrangère
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Messageclient;
