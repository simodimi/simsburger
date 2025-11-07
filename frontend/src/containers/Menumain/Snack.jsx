import React, { useEffect, useState } from "react";
import { snacks } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import axios from "../../pagePrivate/Utils";
import { io } from "socket.io-client";
const Snack = () => {
  const [snackData, setSnackData] = useState([]);
  /* useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = snacks.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setSnackData(updated);
  }, []);*/
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
      setSnackData((prevData) =>
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
      console.error("❌ Erreur connexion Socket.io:", error);
    });

    return () => {
      newSocket.emit("leave_products");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadSnack = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product");
        const backendProducts = Array.isArray(response.data)
          ? response.data
          : [];
        // SOLUTION: Trouver d'abord toutes les correspondances
        const boissonsAvecStatut = snacks.map((p) => {
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
        setSnackData(boissonsAvecStatut);
      } catch (error) {
        console.error("Erreur:", error);
        // Fallback: tout activé
        const fallbackData = snacks.map((boisson) => ({
          id: boisson.id,
          text: boisson.text,
          photo: boisson.photo,
          disabled: false, // ← TOUT ACTIVÉ en fallback
          prix: boisson.prix,
          description: boisson.description,
        }));
        setSnackData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadSnack();
  }, []);

  if (loading) return <div>Chargement des snack...</div>;
  return (
    <div className="">
      <ScrollPage
        title="Nos Snacks"
        data={snackData}
        routePrefix="/carte/snack/"
      />
    </div>
  );
};

export default Snack;
