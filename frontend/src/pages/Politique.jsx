import React from "react";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";

const Politique = () => {
  return (
    <div className="CguPlan">
      <div className="loginCgu">
        <div className="LoginLogo">
          <img src={logo} alt="" />
          <p>
            <span>Sim'sburger</span>
          </p>
        </div>
        <div className="CguContent">
          <h1>🔒 POLITIQUE DE PROTECTION DES DONNÉES PERSONNELLES</h1>
          POLITIQUE DE PROTECTION DES DONNÉES PERSONNELLES
          <p>
            {" "}
            1. Collecte des données Les informations recueillies via le site
            (formulaire, commande, inscription) sont nécessaires à la gestion
            des commandes, du programme fidélité et à la communication
            commerciale.{" "}
          </p>
          <p>
            2. Utilisation des données Les données sont utilisées uniquement par
            Sim’sburger et ses prestataires techniques pour : le traitement des
            commandes, la gestion du compte client, l’envoi d’offres
            promotionnelles (avec consentement).
          </p>
          <p>
            3. Conservation Les données sont conservées pendant 3 ans après la
            dernière interaction avec le client, sauf obligation légale
            contraire.
          </p>
          <p>
            4. Droits de l’utilisateur Conformément au RGPD, vous disposez d’un
            droit d’accès, de rectification, d’opposition et de suppression de
            vos données. Vous pouvez exercer ces droits à tout moment en
            écrivant à : donnees@simsburger.fr
          </p>
          <p>
            5. Cookies Le site utilise des cookies pour améliorer l’expérience
            utilisateur et mesurer la fréquentation. L’utilisateur peut les
            accepter ou les refuser à tout moment via son navigateur.
          </p>
          <p>
            6. Sécurité Sim’sburger met en œuvre toutes les mesures nécessaires
            pour garantir la sécurité et la confidentialité des données
            personnelles collectées.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Politique;
