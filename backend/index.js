require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

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

// Configuration Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// CORS (important: withCredentials côté frontend)
const CLIENT_ORIGIN = "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // permet d'envoyer/recevoir cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// Sécurité: headers HTTP sûrs
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// Parser
app.use(express.json({ limit: "10mb" })); // limite la taille du body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
// Rate limiter basique pour éviter bruteforce
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limiter le nombre de requêtes par IP
});
app.use(limiter);

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log("🔌 Client connecté:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client déconnecté:", socket.id);
  });
  // gestion activaction/desactivation produits
  socket.on("join_products", () => {
    socket.join("products_room");
  });

  socket.on("leave_products", () => {
    socket.leave("products_room");
  });
  // Messages utilisateurs
  socket.on("join_messages_room", () => socket.join("messages_room"));
  socket.on("leave_messages_room", () => socket.leave("messages_room"));
});

// Exporter io pour l'utiliser dans les controllers
global.io = io;

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
