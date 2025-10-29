//fiches de configuration des modèles côtés user:
const User = require("./user/User");
const Order = require("./user/Order");
const Orderitem = require("./user/Orderitem");
const Message = require("./user/Message");
const Admin = require("./admin/Admin");
const Fournisseur = require("./admin/Fournisseur");
const Inventaireadmin = require("./admin/Inventaireadmin");
const Messageclient = require("./admin/Messageclient");
const Productadmin = require("./admin/Productadmin");
const Rapport = require("./admin/Rapport");
const Statistique = require("./admin/Statistique");
const sequelize = require("../config/database");

// === RELATIONS UTILISATEUR ===
// Un utilisateur peut avoir plusieurs commandes (One-to-Many)
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Une commande peut contenir plusieurs articles (One-to-Many)
Order.hasMany(Orderitem, { foreignKey: "order_id", as: "items" });
Orderitem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Un utilisateur peut envoyer plusieurs messages (One-to-Many)
User.hasMany(Message, { foreignKey: "user_id", as: "messages" });
Message.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Un utilisateur peut avoir plusieurs messages client (One-to-Many)
User.hasMany(Messageclient, { foreignKey: "user_id", as: "clientMessages" });
Messageclient.belongsTo(User, { foreignKey: "user_id", as: "user" });

// === RELATIONS ADMINISTRATEUR ===
// Un administrateur peut gérer plusieurs fournisseurs (One-to-Many)
Admin.hasMany(Fournisseur, {
  foreignKey: "admin_id",
  as: "fournisseurs",
  onDelete: "SET NULL",
});
Fournisseur.belongsTo(Admin, { foreignKey: "admin_id", as: "admin" });

// Un administrateur peut gérer plusieurs inventaires (One-to-Many)
Admin.hasMany(Inventaireadmin, { foreignKey: "admin_id", as: "inventaires" });
Inventaireadmin.belongsTo(Admin, { foreignKey: "admin_id", as: "admin" });

// Un administrateur peut générer plusieurs rapports (One-to-Many)
Admin.hasMany(Rapport, { foreignKey: "admin_id", as: "rapports" });
Rapport.belongsTo(Admin, { foreignKey: "admin_id", as: "admin" });

// Un administrateur peut avoir plusieurs statistiques (One-to-Many)
Admin.hasMany(Statistique, { foreignKey: "admin_id", as: "statistiques" });
Statistique.belongsTo(Admin, { foreignKey: "admin_id", as: "admin" });

// === RELATIONS CROISÉES ===
// Une commande peut générer plusieurs statistiques (One-to-Many)
Order.hasMany(Statistique, { foreignKey: "order_id", as: "statistiques" });
Statistique.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Un produit admin peut avoir plusieurs statistiques (One-to-Many)
Productadmin.hasMany(Statistique, {
  foreignKey: "product_id",
  as: "statistiques",
});
Statistique.belongsTo(Productadmin, {
  foreignKey: "product_id",
  as: "product",
});

// Un utilisateur peut avoir plusieurs statistiques (One-to-Many)
User.hasMany(Statistique, { foreignKey: "user_id", as: "statistiques" });
Statistique.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Un produit admin peut être dans plusieurs articles de commande (One-to-Many)
Productadmin.hasMany(Orderitem, {
  foreignKey: "product_id",
  as: "orderItems",
});
Orderitem.belongsTo(Productadmin, {
  foreignKey: "product_id",
  as: "product",
});

const models = {
  User,
  Order,
  Orderitem,
  Message,
  Fournisseur,
  Inventaireadmin,
  Messageclient,
  Rapport,
  Statistique,
  Productadmin,
  Admin,
};

module.exports = { sequelize, models };
