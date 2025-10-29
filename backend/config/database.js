//configuration connexion base de données
const { Sequelize } = require("sequelize"); //importation de la librairie sequelize
require("dotenv").config(); //importation de la librairie dotenv

//variable d'environnement*
const DB_Host = process.env.HOST;
const DB_User = process.env.USER;
const DB_Password = process.env.PASSWORD;
const DB_Name = process.env.NAME;
const DB_Port = process.env.PORT;

//creer une nouvelle instance de sequelize
const sequelize = new Sequelize(DB_Name, DB_User, DB_Password, {
  host: DB_Host,
  dialect: "mysql",
  port: DB_Port,
  logging: false, //ne pas afficher les requetes sql dans la console
});

//test de connexion
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion a la base de données etablie avec success");
  })
  .catch((error) => {
    console.log("Echec de la connexion a la base de données", error);
  });

module.exports = sequelize;
