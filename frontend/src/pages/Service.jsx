import React, { useRef, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../styles/service.css";
import "../styles/shopping.css";
import logo from "../assets/logo/logo.png";
import delivery from "../assets/serviceP/Designer.jpeg";
import bas from "../assets/icone/bas.png";
import haut from "../assets/icone/haut.png";
const Service = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [arrow, setarrow] = useState({
    arrow1: true,
    arrow2: false,
    arrow3: false,
    arrow4: false,
  });

  const handleClick = (id) => {
    setarrow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div className="shoppingService">
      <div className="Service">
        <Button
          className="retourbtn"
          onClick={() => {
            handleback();
          }}
        >
          <p>Retour</p>
        </Button>
        <div className="shoppingfull">
          <div className="shoppingcontent">
            <div className="ServiceTitle">
              <img src={logo} alt="" />
              <p>
                Chez SimsBurger, nous nous engageons à rendre chaque expérience
                unique. Découvrez comment nos services simplifient vos commandes
                et rendent vos repas encore plus délicieux.
              </p>
            </div>
          </div>
          <div className="ServiceOptions">
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Livraison rapide 🚚</p>
                <div
                  className="ServiceOptionIcons"
                  onClick={() => handleClick("arrow1")}
                >
                  {arrow.arrow1 ? (
                    <img src={haut} alt="" />
                  ) : (
                    <img src={bas} alt="" />
                  )}
                </div>
              </div>
              <div
                className={`ServiceOptionLine ${
                  arrow.arrow1 ? "affichage" : "cacher"
                }`}
              >
                <p>
                  Recevez vos burgers chauds et savoureux directement à votre
                  porte, en un temps record. Nous veillons à ce que chaque
                  commande arrive parfaitement fraîche.
                </p>
                <img src={delivery} alt="" />
              </div>
            </div>
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Offres spéciales 🎁</p>
                <div
                  className="ServiceOptionIcons"
                  onClick={() => handleClick("arrow2")}
                >
                  {arrow.arrow2 ? (
                    <img src={haut} alt="" />
                  ) : (
                    <img src={bas} alt="" />
                  )}
                </div>
              </div>
              <div
                className={`ServiceOptionLine ${
                  arrow.arrow2 ? "affichage" : "cacher"
                }`}
              >
                <p>
                  Profitez régulièrement de promotions exclusives et de
                  surprises gourmandes, conçues pour nos clients fidèles.
                </p>
              </div>
            </div>
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Qualité garantie ⭐</p>
                <div
                  className="ServiceOptionIcons"
                  onClick={() => handleClick("arrow3")}
                >
                  {arrow.arrow3 ? (
                    <img src={haut} alt="" />
                  ) : (
                    <img src={bas} alt="" />
                  )}
                </div>
              </div>
              <div
                className={`ServiceOptionLine ${
                  arrow.arrow3 ? "affichage" : "cacher"
                }`}
              >
                <p>
                  Tous nos ingrédients sont soigneusement sélectionnés pour
                  garantir le meilleur goût et la meilleure qualité pour chaque
                  burger.
                </p>
              </div>
            </div>
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Disponibilité🕒</p>
                <div
                  className="ServiceOptionIcons"
                  onClick={() => handleClick("arrow4")}
                >
                  {arrow.arrow4 ? (
                    <img src={haut} alt="" />
                  ) : (
                    <img src={bas} alt="" />
                  )}
                </div>
              </div>
              <div
                className={`ServiceOptionLine ${
                  arrow.arrow4 ? "affichage" : "cacher"
                }`}
              >
                <p>
                  Nous sommes disponibles. lundi au dimanche, de 11h à 23h, pour
                  satisfaire vos envies de burgers à tout moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
