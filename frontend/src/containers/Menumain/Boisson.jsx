import { boissons } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
import axios from "../../pagePrivate/Utils";
import { io } from "socket.io-client";

const Boisson = () => {
  const [boissonData, setBoissonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialiser la connexion Socket.io
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    // Rejoindre la room des produits
    newSocket.emit("join_products");

    // Écouter les mises à jour de produits en temps réel
    newSocket.on("product_updated", (data) => {
      setBoissonData((prevData) =>
        prevData.map((product) =>
          product.text === data.name
            ? {
                ...product,
                disabled: !data.active, // Inverser pour l'affichage
              }
            : product
        )
      );
    });

    // Gestion des erreurs
    newSocket.on("connect_error", (error) => {
      console.error("Erreur connexion Socket.io:", error);
    });

    return () => {
      newSocket.emit("leave_products");
      newSocket.disconnect();
    };
  }, []);
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
        //mis à jour toutes les 2secondes
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
