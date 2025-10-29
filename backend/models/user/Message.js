const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Message = sequelize.define("Message", {
  idmessage: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    // clé étrangère
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  email_service: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  messageService: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
module.exports = Message;
