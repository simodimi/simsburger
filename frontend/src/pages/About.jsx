import React, { useRef, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../styles/service.css";
import "../styles/shopping.css";
import logo from "../assets/logo/logo.png";
import bas from "../assets/icone/bas.png";
import haut from "../assets/icone/haut.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../pagePrivate/Utils";
const About = ({ setsmsUser }) => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [arrow, setarrow] = useState({
    arrow1: false,
    arrow2: true,
    arrow3: false,
    arrow4: false,
  });

  const handleClick = (id) => {
    setarrow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const [msgerror, setmsgerror] = useState("");
  const [formData, setFormData] = useState({
    id: new Date().toLocaleString(),
    email_service: "",
    messageService: "",
  });
  //exportation des informations

  const handlesubmit = async (e) => {
    e.preventDefault();
    setmsgerror("");
    //verification des champs vide
    if (!formData.email_service || !formData.messageService) {
      setmsgerror("Veuillez remplir tous les champs");
      return;
    }
    //verification de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_service)) {
      setmsgerror("Veuillez entrer une adresse email valide");
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/message",
        formData
      );
      if (response.status === 200) {
        toast.success(
          `${formData.email_service}, votre message a bien été envoyé`
        );
      }
      setmsgerror("");
      setFormData({ email_service: "", messageService: "" });
    } catch (error) {
      console.error("Erreur création message :", error);
    }
    /*   if (formData.email_service && formData.messageService) {
      toast.success("Votre message a bien été envoyé");
      //création message complet
      const newmessage = {
        id: Date.now(),
        email_service: formData.email_service,
        messageService: formData.messageService,
        date: new Date().toISOString(),
      };
      // Lire les anciens messages
      const existing = JSON.parse(localStorage.getItem("smsUser")) || [];

      // Ajouter le nouveau message
      const updated = [...existing, newmessage];

      // Réécrire le tableau complet dans localStorage
      localStorage.setItem("smsUser", JSON.stringify(updated));

      //  Mettre à jour ton state local si besoin
      setsmsUser(updated);
      setmsgerror("");
      setFormData({ email_service: "", messageService: "" });

      return;
    }*/
  };
  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                Une question, une suggestion ou simplement envie de nous dire
                bonjour ? Notre équipe est toujours disponible pour vous
                répondre.
              </p>
            </div>
          </div>
          <div className="ServiceOptions">
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Coordonnées principales</p>
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
                <div className="address">
                  <p>🏠 Adresse: 123 Rue de la Gastronomie, 75000 Paris</p>
                  <p>
                    📞 Téléphone:{" "}
                    <a href="tel:+33123456789">+33 1 23 45 67 89</a>{" "}
                  </p>
                  <p>
                    📧 Email:{" "}
                    <a href="mailto:simodimitri08@gmail.com">
                      simodimitri08@gmail.com
                    </a>
                  </p>
                  <p>🌟 Horaires: Lundi - Vendredi: 11h00 - 23h00</p>
                </div>
              </div>
            </div>
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Écrivez-nous directement</p>

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
                <form onSubmit={handlesubmit}>
                  <div className=" UserDetails">
                    <span id="textmessageService">{msgerror}</span>
                    <div className="AccountUserInformation">
                      <p>Email :</p>
                      <input
                        type="email"
                        name="email_service"
                        value={formData.email_service}
                        id=""
                        placeholder="Entrez votre mail"
                        onChange={handleTextChange}
                      />
                    </div>

                    <div className="AccountUserInformation">
                      <p>Message :</p>
                      <textarea
                        name="messageService"
                        id=""
                        value={formData.messageService}
                        spellCheck
                        onChange={handleTextChange}
                      ></textarea>
                    </div>
                    <Button className="nextbtn" type="submit">
                      Envoyer votre message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div className="ServiceOptionsContent">
              <div className="ServiceOption">
                <p>Localisation du restaurant 📍</p>
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
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.208728631115!2d5.4341108766142625!3d43.24704707860431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9b8554a46376f%3A0xd30d42af04d68e89!2sALOTRA%20-%20R%C3%A9sidence%20pour%20%C3%A9tudiants!5e0!3m2!1sfr!2sfr!4v1753167377501!5m2!1sfr!2sfr"
                  width="100%"
                  height="550"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Sim'sBurger"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
