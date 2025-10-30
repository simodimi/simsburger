import { bpc } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
import axios from "../../pagePrivate/Utils";

const Bpc = () => {
  const [bpcData, setBpcData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnack = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product");
        const backendProducts = Array.isArray(response.data)
          ? response.data
          : [];
        // SOLUTION: Trouver d'abord toutes les correspondances
        const boissonsAvecStatut = bpc.map((p) => {
          // Chercher le produit backend correspondant
          const backendProduct = backendProducts.find(
            (bp) => bp.name === p.text
          );
          // Si le produit est trouvé en backend, utiliser son statut
          // Sinon, le considérer comme disponible (fallback)
          let isActive = true; // par défaut actif

          if (backendProduct) {
            // Gérer différents formats de 'active'
            if (
              backendProduct.active === 1 ||
              backendProduct.active === true ||
              backendProduct.active === "1"
            ) {
              isActive = true;
            } else if (
              backendProduct.active === 0 ||
              backendProduct.active === false ||
              backendProduct.active === "0"
            ) {
              isActive = false;
            }
          }

          return {
            id: p.id,
            text: p.text,
            photo: p.photo,
            disabled: !isActive, // Inverser pour 'disabled'
            prix: p.prix,
            description: p.description,
          };
        });
        setBpcData(boissonsAvecStatut);
      } catch (error) {
        console.error("Erreur:", error);
        // Fallback: tout activé
        const fallbackData = wrap.map((p) => ({
          id: p.id,
          text: p.text,
          photo: p.photo,
          disabled: false, // ← TOUT ACTIVÉ en fallback
          prix: p.prix,
          description: p.description,
        }));
        setBpcData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadSnack();
  }, []);

  if (loading) return <div>Chargement des bpc...</div>;
  return (
    <div className="">
      <ScrollPage
        title="Nos burgers pas chers"
        data={bpcData}
        routePrefix="/carte/bpc/"
      />
    </div>
  );
};

export default Bpc;
