const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Orderitem = sequelize.define("Orderitem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  is_custom: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  custom_data: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  menu_data: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  order_id: {
    // clé étrangère explicite
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Orderitem;
