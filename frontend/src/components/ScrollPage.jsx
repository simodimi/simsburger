import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filterbar from "../containers/Menumain/Filterbar"; // votre composant de filtre
import "../styles/carte.css";

const ScrollPage = ({ title, data, routePrefix }) => {
  const navigate = useNavigate();
  const elementRefs = useRef({});
  //const [items, setItems] = useState(data); // éléments affichés (après filtre)
  const [items, setItems] = useState([]);
  /* //filtrer les produits desactivés en les retirant de la liste
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const filtered = data.filter((item) => !savedStatus[item.id]); // garde les activés
    setItems(filtered);
  }, [data]);*/
  //cacher par indisponible
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = data.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setItems(updated);
  }, [data]);
  // navigation et sauvegarde de l'élément sélectionné
  const handleNavigate = (item) => {
    if (item.disabled) return; // blocage de la navigation si désactivé
    //stockage de la valeur item.id sous la clé selectedElement
    localStorage.setItem("selectedElement", item.id);
    navigate(`${routePrefix}${item.text}`);
  };

  // scroll vers l'élément sélectionné
  useEffect(() => {
    const selectedElement = localStorage.getItem("selectedElement");
    //elementRefs.current[selectedElement] existe dans le DOM
    if (selectedElement && elementRefs.current[selectedElement]) {
      //scroll vers l'élément
      elementRefs.current[selectedElement].scrollIntoView({
        behavior: "smooth",
        block: "center", //centrer l'élément dans la vue
      });
      localStorage.removeItem("selectedElement");
    }
  }, [items]);
  //on vérifie qu'il y'a des éléments à filtrer
  const itemsfilter = data.length > 0;
  const eltsNoFilter = [
    "nos boissons",
    "nos desserts",
    "nos snacks",
    "nos sauces",
  ];
  // Affichage du composant de filtre uniquement si le titre n'est pas dans eltsNoFilter
  const showfiltre = itemsfilter && !eltsNoFilter.includes(title.toLowerCase());
  return (
    <div className="CartemainGeneral">
      <h5>{title}</h5>
      {showfiltre && (
        <div className="">
          <p id="CartemainGeneralText">Allez-y plus rapidement en filtrant</p>

          {/* Filtre (optionnel) */}
          {Filterbar && <Filterbar data={data} setfilterdata={setItems} />}
        </div>
      )}
      <div className="PrincipalMain">
        {items.length > 0 ? (
          items.map((item) => (
            /*  <div
              className="PrincipalPlate"
              key={item.id}
              ref={(el) => (elementRefs.current[item.id] = el)}
              onClick={() => handleNavigate(item)}
            >
              <p>{item.text}</p>
              <img src={item.photo} alt={item.text} />
            </div>*/
            <div
              className={`PrincipalPlate ${item.disabled ? "disabled" : ""}`}
              key={item.id}
              ref={(el) => (elementRefs.current[item.id] = el)}
              onClick={() => handleNavigate(item)}
            >
              <p>{item.text}</p>
              <img src={item.photo} alt={item.text} />
              {item.disabled && (
                <span className="indisponible">❌ Indisponible</span>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            Aucun produit disponible pour le moment
          </p>
        )}
      </div>
    </div>
  );
};

export default ScrollPage;
