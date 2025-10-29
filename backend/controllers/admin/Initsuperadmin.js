require("dotenv").config();
const db = require("../../config/database");
const Admin = require("../../models/admin/Admin");
const bcrypt = require("bcrypt");
//POUR créer le superadmin dans la console de vs code taper node controllers/admin/Initsuperadmin.js
(async () => {
  try {
    await db.authenticate();
    const existing = await Admin.findOne({ where: { role: "superadmin" } });
    if (existing) {
      console.log("Superadmin déjà existant:", existing.adminemail);
      process.exit(0);
    }
    const password = process.env.SUPERADMIN_PASSWORD || "ChangeMe123!";
    const hashed = await bcrypt.hash(password, 12);
    const superAdmin = await Admin.create({
      adminname: "SuperAdmin",
      adminemail: process.env.SUPERADMIN_EMAIL,
      adminpassword: hashed,
      role: "superadmin",
      isactive: true,
      validationToken: null,
    });
    console.log("Superadmin créé :", superAdmin.adminemail);
    process.exit(0);
  } catch (err) {
    console.error("Erreur init superadmin:", err);
    process.exit(1);
  }
})();
