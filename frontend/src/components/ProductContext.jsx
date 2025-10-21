import React, { createContext, useEffect, useState } from "react";
export const ProductContext = createContext();
export const ProductProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  //ajouter les éléments au panier
  const addToCart = (p, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const sameId = item.id === p.id;

        // Cas sans personnalisation -> groupé
        if (!p.isCustom && !item.isCustom) {
          return sameId;
        }

        // Cas personnalisé -> comparer contenu exact des customItems
        if (p.isCustom && item.isCustom) {
          return (
            sameId &&
            JSON.stringify(item.customItems || []) ===
              JSON.stringify(p.customItems || [])
          );
        }

        // Cas mixte (un personnalisé, un pas) -> jamais groupé
        return false;
      });

      if (existingIndex !== -1) {
        // on incrémente seulement si c’est le même "type"
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        //ajouter un nouvel élément au panier
        setcount(count + 1);
        return [...prev, { ...p, quantity, id: Date.now() + Math.random() }]; //ajout d'un uid pour différencier les éléments même si identiques
      }
    });
  };

  const [count, setcount] = useState(0);
  //supprimer un elément du panier
  const removeFromCart = (ids) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== ids); //filtre l'élément à l'index spécifié
      if (newCart.length < prev.length) {
        setcount((prev) => Math.max(prev - 1, 0)); //évite que le compteur devienne négatif
      }
      return newCart;
    });
  };
  return (
    <ProductContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, count, setcount }}
    >
      {children}
    </ProductContext.Provider>
  );
};
