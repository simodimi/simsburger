import React, { useEffect, useState } from "react";
import "../../styles/carte.css";
import { useNavigate } from "react-router-dom";
import { carte, MainList } from "../exportelt/Exportelt";
const Cartemain = ({ setselectOpt }) => {
  const navigate = useNavigate();
  const handlenavigate = (p) => {
    //trouver l'élement correspondant et appliquer le css
    const mainItem = MainList.find((item) => item.lien === p.lien);
    if (mainItem) {
      setselectOpt(mainItem.id);
    }
    navigate(p.lien);
  };
  return (
    <div className="CartemainGeneral">
      <h5>Hello,notre carte</h5>
      <p id="CartemainGeneralText">
        Aucune excuse,faites-vous plaisir : il y'en a pour tous les goûts!
      </p>
      <div className="PrincipalMain">
        {carte.map((p) => (
          <div
            className="PrincipalPlate"
            key={p.id}
            onClick={() => handlenavigate(p)}
          >
            <p>{p.text} </p>
            <img src={p.photo} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cartemain;
