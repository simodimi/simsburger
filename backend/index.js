const db = require("./config/database"); //importation de la base de données
const express = require("express"); //importation de express
require("dotenv").config(); //importation de dotenv
const http = require("http"); //création serveur
const cors = require("cors");
const adminRoutes = require("./routes/AdminRoute");
const fournisseurRoutes = require("./routes/FournisseurRoute");
const userRoutes = require("./routes/UserRoute");
const InventaireRoutes = require("./routes/InventaireRoute");
const ProductRoutes = require("./routes/ProductRoute");
const MessageRoutes = require("./routes/SmsUserRoutes");

//importer les modeles et les relations
require("./models/Unituser");

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("nous sommes bien connecté!");
});
// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/fournisseur", fournisseurRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/inventaire", InventaireRoutes);
app.use("/product", ProductRoutes);
app.use("/message", MessageRoutes);
//lancement serveur
db.sync({ force: false, alter: true })
  .then(() => {
    server.listen(process.env.SERVER_PORT, () => console.log("serveur lance"));
  })
  .catch((error) => {
    console.error("une erreur est survenue", error);
    process.exit(1);
  });
