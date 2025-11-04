/*const db = require("./config/database"); //importation de la base de données
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
const StatistiqueRoutes = require("./routes/StatistiqueRoute");
const OrderitemRoutes = require("./routes/OrderitemRoute");

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
app.use("/statistique", StatistiqueRoutes);
app.use("/orderitem", OrderitemRoutes);
//lancement serveur
db.sync() // alter: true pour mettre à jour la base de données
  .then(() => {
    server.listen(process.env.SERVER_PORT, () => console.log("serveur lance"));
  })
  .catch((error) => {
    console.error("une erreur est survenue", error);
    process.exit(1);
  });*/
// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const adminRoutes = require("./routes/AdminRoute");
const fournisseurRoutes = require("./routes/FournisseurRoute");
const userRoutes = require("./routes/UserRoute");
const InventaireRoutes = require("./routes/InventaireRoute");
const ProductRoutes = require("./routes/ProductRoute");
const MessageRoutes = require("./routes/SmsUserRoutes");
const StatistiqueRoutes = require("./routes/StatistiqueRoute");
const OrderitemRoutes = require("./routes/OrderitemRoute");

const db = require("./config/database");

const app = express();
const server = http.createServer(app);

// Sécurité: headers HTTP sûrs
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Rate limiter basique pour éviter bruteforce
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limiter le nombre de requêtes par IP
});
app.use(limiter);

// Parser
app.use(express.json({ limit: "10kb" })); // limite la taille du body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (important: withCredentials côté frontend)
const CLIENT_ORIGIN = "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // permet d'envoyer/recevoir cookies
  })
);

// Routes
app.use("/admin", adminRoutes);
app.use("/fournisseur", fournisseurRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/inventaire", InventaireRoutes);
app.use("/product", ProductRoutes);
app.use("/message", MessageRoutes);
app.use("/statistique", StatistiqueRoutes);
app.use("/orderitem", OrderitemRoutes);

db.sync() // alter: true pour mettre à jour la base de données
  .then(() => {
    const PORT = process.env.SERVER_PORT || 5000;
    server.listen(PORT, () => console.log(`serveur lance sur ${PORT}`));
  })
  .catch((error) => {
    console.error("une erreur est survenue", error);
    process.exit(1);
  });
