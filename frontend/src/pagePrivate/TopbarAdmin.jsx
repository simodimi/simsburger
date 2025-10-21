import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import dashboard from "../assets/logo/dashboard.png";
import gestionmenu from "../assets/logo/gestionmenu.png";
import gestionuser from "../assets/logo/gestionuser.png";
import support from "../assets/logo/support.png";
import parametre from "../assets/logo/parametre.png";
import connecter from "../assets/logo/connecter.png";
import "../styles/topbar.css";
const TopbarAdmin = () => {
  const navigate = useNavigate();
  return (
    <div className="TopbarName">
      <div className="TopbarLogo">
        <div className="TopbarLogoContainer">
          <img
            src={logo}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/home")}
          />
          <div className="TopbarLogoSmoke"></div>
        </div>
        <span>Sim'sburger</span>
      </div>
      <div className="TopbarTitle">
        <div className="TopbarIcon">
          <Link to="/admin/">
            <img src={connecter} alt="" />
          </Link>
          <p>se connecter</p>
        </div>
        <div className="TopbarIcon">
          <Link to="/admin/dashboard">
            <img src={dashboard} alt="" />
          </Link>
          <p>Tableau de bord</p>
        </div>

        <div className="TopbarIcon">
          <Link to="/admin/gestionmenu">
            <img src={gestionmenu} alt="" />
          </Link>
          <p>Gestion des menus</p>
        </div>
      </div>
      <div className="TopbarParams">
        <div className="TopbarIcon">
          <Link to="/admin/paramadmin">
            <img src={parametre} alt="" />
          </Link>
          <p>Paramètres</p>
        </div>
      </div>
    </div>
  );
};

export default TopbarAdmin;
