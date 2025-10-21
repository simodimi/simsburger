import React from "react";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";
const Cgv = () => {
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
          <h1> 💳 CONDITIONS GÉNÉRALES DE VENTE (CGV)</h1>
          <>
            CONDITIONS GÉNÉRALES DE VENTE (CGV)
            <p>1. Objet Les présentes CGV</p>
            régissent les ventes effectuées sur le site simsburger.fr.
            <p>
              {" "}
              2. Produits Les produits proposés sont ceux décrits sur le site au
              moment de la commande. Les photos sont non contractuelles.
            </p>
            <p>
              {" "}
              3. Commande Toute commande implique l’acceptation des présentes
              CGV. Une fois la commande validée et payée, un email de
              confirmation est envoyé à l’adresse indiquée par le client.
            </p>
            <p>
              {" "}
              4. Prix et paiement Les prix sont indiqués en euros, toutes taxes
              comprises. Le paiement s’effectue en ligne par carte bancaire via
              une plateforme sécurisée. Sim’sburger se réserve le droit de
              modifier ses prix à tout moment, mais les produits seront facturés
              sur la base des tarifs en vigueur lors de la validation de la
              commande.{" "}
            </p>
            <p>
              {" "}
              5. Livraison / Retrait Livraison : dans la limite des zones
              couvertes par Sim’sburger. Retrait sur place : possible aux
              horaires d’ouverture du restaurant. Les délais sont indicatifs et
              peuvent varier selon l’affluence.
            </p>
            <p>
              {" "}
              6. Droit de rétractation Conformément à l’article L221-28 du Code
              de la consommation, le droit de rétractation ne s’applique pas aux
              denrées périssables. Toute commande validée et préparée ne peut
              être annulée ni remboursée.{" "}
            </p>
            <p>
              {" "}
              7. Service client Pour toute réclamation ou question, contactez :
              serviceclient@simsburger.fr
            </p>
          </>{" "}
        </div>
      </div>
    </div>
  );
};

export default Cgv;
