import React, { useEffect, useState } from "react";
import { additems, composition } from "../exportelt/Exportelt";
import plus from "../../assets/icone/plus.png";
import moins from "../../assets/icone/moins.png";
import plusv from "../../assets/icone/plusv.png";
import moinsv from "../../assets/icone/moinsv.png";

const Personnalisation = ({
  composition,
  productText,
  additems,
  items,
  setitems,
}) => {
  const [localItems, setLocalItems] = useState(
    additems.map((item) => ({
      ...item,
      quantity: 0,
      minus: true,
      plux: false,
      wasModified: false,
      baseQuantity: 0,
    }))
  );

  const currentItems = items || localItems;
  const updateItems = setitems || setLocalItems;

  useEffect(() => {
    if (!composition) return; // évite les erreurs

    // --- Filtrage des catégories selon la composition ---
    const issauces = additems
      .filter((p) => p.type === "sauce")
      .filter((sauce) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === sauce.text
        )
      );

    const isTaille = composition.size;
    const isHamburgers = additems
      .filter((p) => p.type === "viande hamburger")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );

    const isFish = additems
      .filter((p) => p.type === "poisson")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );

    const isChicken = additems
      .filter((p) => p.type === "poulet")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );

    const isCrispy = additems
      .filter((p) => p.type === "proteine")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );

    const isVeggies = additems
      .filter((p) => p.type === "viande veggie")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );

    const isTenders = additems
      .filter((p) => p.type === "poulet veggie")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );

    const isBaconVeggie = additems
      .filter((p) => p.type === "veggie")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );
    const iswrapchevre = additems
      .filter((p) => p.type === "chèvre")
      .filter((item) =>
        Object.values(composition).some(
          (val) => typeof val === "string" && val === item.text
        )
      );
    // --- NOUVEAU : Identifier les produits à base de poulet et wraps ---
    const isChickenProduct =
      productText === "Steakhouse Chicken Béarnaise" ||
      productText === "Chicken Louisiane Steakhouse" ||
      productText === "Wrap crousty chèvre" ||
      productText === "Wrap chicken louisiane";

    // --- Création de la nouvelle liste ---
    /* const updatedItems = currentItems.map((it) => {
      const isComposition = Object.values(composition).some(
        (val) => typeof val === "string" && val === it.text
      );*/
    const updatedItems = currentItems.map((it) => {
      const isComposition = Object.values(composition).some(
        (val) => typeof val === "string" && val === it.text
      );

      // DÉTERMINER LA QUANTITÉ DE BASE
      let baseQty = 0;
      if (isComposition) {
        // Si l'ingrédient fait partie de la composition, base = 1
        baseQty = 1;
      } else {
        // Sinon, base = 0
        baseQty = 0;
      }

      const shouldHideSauce =
        it.type === "sauce" && !issauces.some((s) => s.id === it.id);
      const shouldHideTaille = it.taille && it.taille !== isTaille;
      const shouldHideHamburger =
        it.type === "viande hamburger" &&
        !isHamburgers.some((b) => b.id === it.id);
      const shouldHideFish =
        it.type === "poisson" && !isFish.some((f) => f.id === it.id);
      const shouldHideChicken =
        it.type === "poulet" && !isChicken.some((c) => c.id === it.id);
      const shouldHideCrispy =
        it.type === "proteine" && !isCrispy.some((cr) => cr.id === it.id);
      const shouldHideVeggie =
        it.type === "viande veggie" && !isVeggies.some((v) => v.id === it.id);
      const shouldHideTender =
        it.type === "poulet veggie" && !isTenders.some((t) => t.id === it.id);
      const shouldHideBaconVeggie =
        it.type === "veggie" && !isBaconVeggie.some((b) => b.id === it.id);
      const shouldHideWrapChevre =
        it.type === "chèvre" && !iswrapchevre.some((b) => b.id === it.id);
      // --- NOUVEAU : Cacher la viande whopper pour les produits à base de poulet et wraps ---
      const shouldHideWhopperForChicken =
        isChickenProduct && it.text === "viande whopper";
      const shouldHideVegetable =
        composition.type === "veggie" &&
        ([
          "viande hamburger",
          "viande whopper",
          "viande 150g",
          "poulet",
          "proteine",
        ].includes(it.type) ||
          (["bacon", "3 bacons"].includes(it.text) && it.type !== "veggie"));

      const shouldHideCantalt =
        composition.type === "cantal" &&
        (["viande whopper"].includes(it.type) || ["salade"].includes(it.text));
      const shouldHideCantalSpecific =
        composition.type !== "cantal" &&
        ["salade roquette", "viande 150g", "onion caramelisé"].includes(
          it.text
        );

      const shouldHideClassicalMeat =
        composition.type === "cantal" &&
        [
          "viande hamburger",
          "viande whopper",
          "viande 150g",
          "poulet",
        ].includes(it.type) &&
        !isComposition;

      return {
        ...it,
        quantity: isComposition ? 1 : 0,
        baseQuantity: baseQty,
        minus: !isComposition && baseQty === 0,
        plux: isComposition && 1 >= it.maxquantity,
        maxquantity: isComposition ? 2 : 1,
        hidden:
          shouldHideSauce ||
          shouldHideTaille ||
          shouldHideHamburger ||
          shouldHideFish ||
          shouldHideChicken ||
          shouldHideCrispy ||
          shouldHideVeggie ||
          shouldHideTender ||
          shouldHideBaconVeggie ||
          shouldHideVegetable ||
          shouldHideCantalt ||
          shouldHideCantalSpecific ||
          shouldHideWrapChevre ||
          shouldHideWhopperForChicken ||
          shouldHideClassicalMeat,
      };
    });

    // empêche la boucle infinie
    const hasChanged =
      JSON.stringify(currentItems) !== JSON.stringify(updatedItems);
    if (hasChanged) updateItems(updatedItems);
  }, [composition]); // pas de productText ici sinon boucle infinie

  // --- gestion + / -
  const handleminus = (id) => {
    updateItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Math.max(0, p.quantity - 1),
              plux: false,
              minus: p.quantity - 1 <= 0,
              wasModified: true,
            }
          : p
      )
    );
  };

  const handleplus = (id) => {
    updateItems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQuantity = Math.min(p.quantity + 1, p.maxquantity);
          // La logique importante : on ne facture que les suppléments au-delà de la quantité de base
          const isSupplement = newQuantity > (p.baseQuantity || 0);

          return {
            ...p,
            quantity: newQuantity,
            plux: newQuantity >= p.maxquantity,
            minus: false,
            wasModified: true,
            // Marquer si c'est un supplément (pour le calcul de prix)
            isSupplement: isSupplement,
          };
        }
        return p;
      })
    );
  };
  return (
    <div className="">
      <div
        className=""
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#e31937",
          width: "100%",
          padding: "20px 0px",
          gap: "10px",
        }}
      >
        {currentItems.map((p) => (
          <div
            className={p.hidden ? "hidden-item" : ""}
            key={p.id}
            style={{
              display: p.hidden ? "none" : "flex",
              gap: "10px",
              justifyContent: "space-between",
              padding: "0px 20px",
            }}
          >
            <div
              className=""
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div className="Adds">
                <img src={p.photo} alt="" />
              </div>
              <div className="prixingredient">
                <p>{p.text}</p>
                <span
                  className={`priceAfficher ${
                    p.quantity > 0 ? "activeprice" : "desactiveprice"
                  }`}
                >
                  {" "}
                  + {p.prix} €
                </span>
              </div>
            </div>
            <div className="Account">
              <div>
                {p.minus ? (
                  <img src={moins} alt="" onClick={() => handleminus(p.id)} />
                ) : (
                  <img
                    src={moinsv}
                    alt=""
                    onClick={() => handleminus(p.id)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
              <div>
                <span>{p.quantity}</span>
              </div>
              <div>
                {p.plux ? (
                  <img src={plus} alt="" onClick={() => handleplus(p.id)} />
                ) : (
                  <img
                    src={plusv}
                    alt=""
                    onClick={() => handleplus(p.id)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Personnalisation;
