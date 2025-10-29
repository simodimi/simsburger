const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Productadmin = sequelize.define("Productadmin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Productadmin;
