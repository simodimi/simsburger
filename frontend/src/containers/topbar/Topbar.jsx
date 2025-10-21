import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import menu from "../../assets/logo/menu.png";
import nouveau from "../../assets/logo/caddie.png";
import service from "../../assets/logo/service.png";
import joindre from "../../assets/logo/joindre.png";
import connecter from "../../assets/logo/connecter.png";
import parametre from "../../assets/logo/parametre.png";
import "../../styles/topbar.css";
import men from "../../assets/icone/men.png";
import { ProductContext } from "../../components/ProductContext";
const Topbar = () => {
  const navigate = useNavigate();
  const { count } = useContext(ProductContext);
  const [affichetopbar, setaffichetopbar] = useState(false);
  const handleclick = () => {
    setaffichetopbar(!affichetopbar);
  };
  return (
    <div className="TopbarName">
      <div className="TopbarLogo">
        <div className="TopbarLogoContainer">
          <img
            src={logo}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <div className="TopbarLogoSmoke"></div>
        </div>
        <span>Sim'sburger</span>
      </div>

      <div className="TopbarTitle">
        <div className="TopbarIcon">
          <Link to="/carte">
            <img src={menu} alt="" />
          </Link>
          <p>Ma Carte</p>
        </div>

        <div className="TopbarIcon">
          <Link to="/services">
            <img src={service} alt="" />
          </Link>
          <p>Mes Services</p>
        </div>
        <div className="TopbarIcon">
          <Link to="/nous rejoindre">
            <img src={joindre} alt="" />
          </Link>
          <p>Nous joindre</p>
        </div>
        <div className="TopbarIcon">
          <Link to="/nouveauté">
            <img src={nouveau} alt="" />
          </Link>
          <p>paiement</p>
          <div className="account">{count}</div>
        </div>
      </div>
      <div className="TopbarParams">
        <div className="TopbarIcon">
          <Link to="/connecter">
            <img src={connecter} alt="" />
          </Link>
          <p>se connecter</p>
        </div>
        <div className="TopbarIcon">
          <Link to="/parametre">
            <img src={parametre} alt="" />
          </Link>
          <p>paramètre</p>
        </div>
      </div>
      <div className="TopBarMenu">
        <div className="TopbarIcon">
          <Link>
            <img src={men} alt="" onClick={handleclick} />
          </Link>
          <p>Mon menu</p>
        </div>
        {affichetopbar && (
          <div className="TopbarTitle">
            <div className="TopbarIcon">
              <Link to="/carte">
                <img src={menu} alt="" />
              </Link>
              <p>Ma Carte</p>
            </div>

            <div className="TopbarIcon">
              <Link to="/services">
                <img src={service} alt="" />
              </Link>
              <p>Mes Services</p>
            </div>
            <div className="TopbarIcon">
              <Link to="/nous rejoindre">
                <img src={joindre} alt="" />
              </Link>
              <p>Nous joindre</p>
            </div>
            <div className="TopbarIcon">
              <Link to="/nouveauté">
                <img src={nouveau} alt="" />
              </Link>
              <p>paiement</p>
              <div className="account">{count}</div>
            </div>
            <div className="TopbarIcon">
              <Link to="/connecter">
                <img src={connecter} alt="" />
              </Link>
              <p>se connecter</p>
            </div>
            <div className="TopbarIcon">
              <Link to="/parametre">
                <img src={parametre} alt="" />
              </Link>
              <p>paramètre</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
