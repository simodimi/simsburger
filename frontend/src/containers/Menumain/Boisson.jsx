import { boissons } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
import axios from "../../pagePrivate/Utils";

const Boisson = () => {
  const [boissonData, setBoissonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBoissons = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product");
        const backendProducts = Array.isArray(response.data)
          ? response.data
          : [];
        // SOLUTION: Trouver d'abord toutes les correspondances
        const boissonsAvecStatut = boissons.map((frontendBoisson) => {
          // Chercher le produit backend correspondant
          const backendProduct = backendProducts.find(
            (bp) => bp.name === frontendBoisson.text
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
            id: frontendBoisson.id,
            text: frontendBoisson.text,
            photo: frontendBoisson.photo,
            disabled: !isActive, // Inverser pour 'disabled'
            prix: frontendBoisson.prix,
            description: frontendBoisson.description,
          };
        });
        setBoissonData(boissonsAvecStatut);
      } catch (error) {
        console.error("Erreur:", error);
        // Fallback: tout activé
        const fallbackData = boissons.map((boisson) => ({
          id: boisson.id,
          text: boisson.text,
          photo: boisson.photo,
          disabled: false, // ← TOUT ACTIVÉ en fallback
          prix: boisson.prix,
          description: boisson.description,
        }));
        setBoissonData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadBoissons();
  }, []);

  if (loading) return <div>Chargement des boissons...</div>;

  return (
    <div>
      <ScrollPage
        title="Nos Boissons"
        data={boissonData}
        routePrefix="/carte/boisson/"
      />
    </div>
  );
};

export default Boisson;
