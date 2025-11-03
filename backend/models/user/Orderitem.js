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
  names: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("sur place", "emporter", "livraison"),
    allowNull: false,
  },
  isCustom: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  removedItems: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  customItems: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  total_revenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  order_id: {
    // clé étrangère explicite
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Orderitem;
