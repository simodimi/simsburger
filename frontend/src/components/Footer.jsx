import React from "react";
import glace from "../assets/logo/glace.png";
import img1 from "../assets/logo/menu.png";
import img2 from "../assets/logo/logo.png";
import img3 from "../assets/logo/new.png";
import img4 from "../assets/logo/time.png";
import img5 from "../assets/logo/email.png";
import img6 from "../assets/logo/phone.png";
import img7 from "../assets/logo/localisation.png";
import img8 from "../assets/logo/Sim’sBurger.png";
import "../styles/footer.css";
import { useNavigate } from "react-router-dom";

const Footer = ({ handlenavigates, handlenavigat, handlenavig }) => {
  return (
    <div className="HomeFooter">
      <div className="HomeFooterBanner">
        <img src={img8} alt="" />
      </div>
      <div className="HomeFooterContent">
        <div className="HomeReference">
          <div className="HomeFooterLogo">
            <div className="HomeLinkCarte">
              <h5>une petite faim</h5>
              <div className="HomeLink">
                <img src={img3} alt="" />
                <p style={{ cursor: "pointer" }} onClick={handlenavig}>
                  nouveautés
                </p>
              </div>

              <div className="HomeLink">
                <img src={img2} alt="" />
                <p style={{ cursor: "pointer" }} onClick={handlenavigates}>
                  nos burgers
                </p>
              </div>

              <div className="HomeLink">
                <img src={img1} alt="" />
                <p style={{ cursor: "pointer" }} onClick={handlenavigat}>
                  notre carte
                </p>
              </div>
            </div>
            <div className="HomeContact">
              <h5>nous joindre</h5>
              <div className="HomeLink">
                <img src={img4} alt="" />
                <p> Lundi - Dimanche : 11h00 - 23h00</p>
              </div>
              <div className="HomeLink">
                <img src={img5} alt="" />
                <a
                  href="mailto:simodimitri08@gmail.com"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  simodimitri08@gmail.com
                </a>
              </div>
              <div className="HomeLink">
                <img src={img6} alt="" />
                <a href="tel:+33 0751255097" style={{ cursor: "pointer" }}>
                  {" "}
                  +33 0751255097
                </a>
              </div>
            </div>
          </div>
          <div className="HomeLocalisation">
            <h5>nous trouver</h5>
            <div className="HomeLink">
              <img src={img7} alt="" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.208728631115!2d5.4341108766142625!3d43.24704707860431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9b8554a46376f%3A0xd30d42af04d68e89!2sALOTRA%20-%20R%C3%A9sidence%20pour%20%C3%A9tudiants!5e0!3m2!1sfr!2sfr!4v1753167377501!5m2!1sfr!2sfr"
                width="400"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Sim'sBurger"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="HomeDroitLegal">
          <div className="HomeLegacity">
            <a href="../cgu" target="_blank" rel="noopener noreferrer">
              {" "}
              Mentions légales - CGU
            </a>
            <a href="../cgv" target="_blank" rel="noopener noreferrer">
              CGV
            </a>
            <a href="../protection" target="_blank" rel="noopener noreferrer">
              Politique de protection des données personnelles
            </a>
          </div>
          <p>© 2025 Sim'sBurger</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
