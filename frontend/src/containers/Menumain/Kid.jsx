import React from "react";
import kid1 from "../../assets/burger/menukidbg.png";
import kid2 from "../../assets/burger/kid2.png";
const Kid = () => {
  const menu = [
    {
      id: 1,
      photo: kid1,
      text: "Menu enfants",
      lien: "/carte/nouveau",
      type: "boeuf",
      bacon: "oui",
    },
    {
      id: 2,
      photo: kid2,
      text: "Menu enfants plus",
      lien: "/carte/nouveau",
      type: "boeuf",
      bacon: "oui",
    },
  ];
  return (
    <div className="CartemainGeneral">
      <h5>Nos burgers enfants</h5>

      <div className="PrincipalMain">
        {menu.map((p) => (
          <div className="PrincipalPlate" key={p.id}>
            <p>{p.text} </p>
            <img src={p.photo} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kid;
