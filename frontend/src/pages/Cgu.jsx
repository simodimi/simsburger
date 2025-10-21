import React from "react";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";
const Cgu = () => {
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
          <h1> 📜 MENTIONS LÉGALES</h1>
          <p>
            MENTIONS LÉGALES Éditeur du site Le site Sim’sburger est édité par
            la société Sim’sburger SAS, au capital de 10 000 €, immatriculée au
            Registre du Commerce et des Sociétés de Paris sous le numéro 123 456
            789. Siège social : 25 Rue du Goût, 75010 Paris, France Email de
            contact :{" "}
            <a
              href="mailto:simodimitri08@gmail.com"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              {" "}
              simodimitri08@gmail.com
            </a>{" "}
            Directeur de la publication : M. Dimitri Simo Hébergement : OVH SAS,
            2 rue Kellermann, 59100 Roubaix, France Propriété intellectuelle
            L’ensemble des éléments du site (textes, images, logos, vidéos,
            graphismes, etc.) est protégé par le droit d’auteur et la propriété
            intellectuelle. Toute reproduction totale ou partielle sans
            autorisation écrite est interdite.
          </p>{" "}
          <h1> 📜 CONDITIONS GÉNÉRALES D’UTILISATION (CGU)</h1>
          <>
            {" "}
            CONDITIONS GÉNÉRALES D’UTILISATION (CGU)
            <p>
              {" "}
              1. Objet Les présentes CGU définissent les conditions d’accès et
              d’utilisation du site simsburger.fr. L’accès au site implique
              l’acceptation sans réserve des présentes conditions.
            </p>
            <p>
              2. Accès au service Le site permet à l’utilisateur de consulter le
              menu, de composer ses burgers, et de passer commande en ligne avec
              retrait en restaurant ou livraison à domicile. Sim’sburger se
              réserve le droit de suspendre temporairement l’accès pour
              maintenance ou mise à jour.
            </p>
            <p>
              {" "}
              3. Responsabilités L’utilisateur s’engage à ne pas utiliser le
              site de manière frauduleuse ou contraire à la loi. Sim’sburger
              décline toute responsabilité en cas d’interruption de service
              indépendante de sa volonté.{" "}
            </p>
            <p>
              4. Compte client La création d’un compte permet d’accéder à
              l’historique des commandes et au programme de fidélité.
              L’utilisateur est responsable de la confidentialité de ses
              identifiants.
            </p>
            <p>
              {" "}
              5. Modification des CGU Sim’sburger se réserve le droit de
              modifier les présentes CGU à tout moment. Les modifications seront
              applicables dès leur mise en ligne.
            </p>
          </>
        </div>
      </div>
    </div>
  );
};

export default Cgu;
