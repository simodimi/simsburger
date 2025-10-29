const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Order = sequelize.define("Order", {
  idorder: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  order_type: {
    type: DataTypes.ENUM("sur place", "emporter", "livraison"),
    allowNull: false,
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true, //peut être null pour une surplace ou emporter
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  user_id: {
    // clé étrangère explicite
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = Order;
