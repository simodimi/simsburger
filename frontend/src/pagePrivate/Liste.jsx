import React, { useEffect, useState } from "react";
import "../styles/shopping.css";
import Button from "../components/Button";
import jsPDF from "jspdf";
import logo from "../assets/logo/logo.png";
import axios from "../pagePrivate/Utils";
import { io } from "socket.io-client";

const Liste = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);
    newSocket.emit("join_orders_room");

    newSocket.on("new_orderitems", (data) => {
      setOrders((prev) => [data, ...prev]);
      setFilteredData((prev) => [data, ...prev]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Erreur connexion Socket.io:", error);
    });

    return () => {
      newSocket.emit("leave_orders_room");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const update = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orderitem");
        console.log("Données reçues:", response.data);

        //  Vérification que response.data existe
        if (!response.data || !Array.isArray(response.data)) {
          console.warn("Aucune donnée reçue ou format invalide");
          setFilteredData([]);
          setOrders([]);
          return;
        }
        const commandesRegroupees = response.data.reduce((acc, item) => {
          // Vérification que item existe
          if (!item) return acc;
          const commandeId = `${item.order_id}_${item.type}_${new Date(
            item.createdAt
          ).getTime()}`; //item.order_id;
          if (!acc[commandeId]) {
            acc[commandeId] = {
              id: item.order_id, //commandeId,
              uniqueId: commandeId, // Ajout d'un identifiant unique pour chaque commande regroupée
              date: item.createdAt, // || new Date(),
              type: item.type,
              items: [], // Toujours initialiser items comme tableau vide
            };
          }
          // Vérifier que acc[commandeId] existe avant de push
          if (acc[commandeId] && Array.isArray(acc[commandeId].items)) {
            acc[commandeId].items.push(item);
          }

          return acc;
        }, {});

        const result = Object.values(commandesRegroupees);
        console.log("Commandes regroupées:", result);

        setFilteredData(result);
        setOrders(result);
      } catch (error) {
        console.error("Erreur:", error);
        setFilteredData([]);
        setOrders([]);
      }
    };
    update();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = search.trim().toLowerCase();

      const result = orders.filter(
        (commande) =>
          commande &&
          commande.id &&
          commande.id.toString().toLowerCase().includes(query)
      );

      setFilteredData(result);
    }
  };

  // vérifications ajoutées dans handleDownloadReceipt
  const handleDownloadReceipt = (commande) => {
    if (!commande || !commande.items || !Array.isArray(commande.items)) {
      console.error("Commande invalide pour le PDF:", commande);
      return;
    }

    const doc = new jsPDF();

    // Logo - position identique à la première facture
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 20, 10, 25, 25);

    // En-tête identique à la première facture
    const today = new Date(commande.date).toLocaleString("fr-FR");

    doc.setFontSize(18);
    doc.text("Sim'sBurger", 20, 60);

    doc.setFontSize(14);
    doc.text("Reçu de commande", 20, 70);
    doc.text(`Numéro de commande : ${commande.id}`, 20, 80);
    doc.text(`Date : ${today}`, 20, 90);
    // Liste des articles - format identique
    doc.setFontSize(12);
    doc.text("Articles :", 20, 100);
    let y = 110;
    const pageHeight = doc.internal.pageSize.height;
    let soustotal = 0;
    let fraisLivraison = 0;
    commande.items.forEach((item) => {
      if (!item) return;
      // Calcul du prix total de l'article (identique à calculateItemTotal)
      const itemTotal = calculateItemTotal(item);
      soustotal += itemTotal;
      const line = `${item.names || "Article sans nom"} x${
        item.quantity || 1
      } = ${itemTotal.toFixed(2)} €`;
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 10;
      // Afficher les ingrédients personnalisés (identique au premier format)
      if (item.isCustom && item.customItems) {
        item.customItems.forEach((customItem) => {
          if (!customItem) return;
          const baseQty = customItem.baseQuantity || 0;
          const currentQty = customItem.quantity || 0;
          const supplementQty = currentQty - baseQty;
          if (supplementQty > 0) {
            if (y > pageHeight - 30) {
              doc.addPage();
              y = 20;
            }
            // Format identique : "   + [nom]:1 × [prix] €"
            doc.text(
              `   + ${customItem.text || "Suppl."}:1 × ${(
                customItem.prix ||
                customItem.price ||
                0
              ).toFixed(2)} €`,
              25,
              y
            );
            y += 7;
          }
        });
      }
      // Afficher les ingrédients retirés (identique au premier format)
      if (item.isCustom && item.removedItems && item.removedItems.length > 0) {
        item.removedItems.forEach((removedItem) => {
          if (!removedItem) return;

          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }
          // Format identique : "   - [nom] (retiré)"
          doc.text(`   - ${removedItem.text || "Ingr."} (retiré)`, 25, y);
          y += 7;
        });
      }
      // Récupérer les frais de livraison si c'est une livraison
      if (item.type === "livraison" && item.prixLivraison) {
        fraisLivraison = parseFloat(item.prixLivraison) || 0;
      }
    });
    // Totaux - format identique à la première facture
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    }
    // Sous-total
    doc.text(`Sous-total : ${soustotal.toFixed(2)} €`, 20, y + 10);
    // Réduction (si applicable dans votre système)
    // Vous pouvez adapter cette partie selon votre logique de réduction
    const reduction = 0;
    doc.text(`Réduction : -${reduction.toFixed(2)} €`, 20, y + 20);
    let currentY = y + 30;
    // Informations de livraison (si c'est une livraison)
    if (commande.type === "livraison") {
      const firstItem = commande.items[0];
      if (firstItem) {
        doc.text(
          `Numéro de téléphone : ${firstItem.telephone || "Non spécifié"}`,
          20,
          currentY
        );
        currentY += 10;

        doc.text(
          `Adresse de livraison : ${firstItem.adresse || "Non spécifiée"}`,
          20,
          currentY
        );
        currentY += 10;
      }
      doc.text(
        `Frais de livraison : ${fraisLivraison.toFixed(2)} €`,
        20,
        currentY
      );
      currentY += 10;
    }
    // Total payé
    const totalPaye = soustotal - reduction + fraisLivraison;
    doc.text(`Total payé : ${totalPaye.toFixed(2)} €`, 20, currentY);
    currentY += 10;
    //type de commande
    doc.text(`Type de commande : ${commande.type}`, 20, currentY);
    currentY += 20;
    // Message de remerciement
    doc.text("Merci pour votre commande !", 20, currentY);
    // Téléchargement avec le même nom de fichier
    doc.save(`recu_de_commande_${commande.id}.pdf`);
  };
  /* const handleDownloadReceipt = (commande) => {
    if (!commande || !commande.items || !Array.isArray(commande.items)) {
      console.error("Commande invalide pour le PDF:", commande);
      return;
    }

    const doc = new jsPDF();

    // Header
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 160, 10, 40, 25);

    doc.setFontSize(18);
    doc.text("Sim'sBurger", 20, 20);

    doc.setFontSize(14);
    doc.text("Facture de commande", 20, 30);
    doc.text(`Numéro : ${commande.id}`, 20, 40);
    doc.text(
      `Date : ${new Date(commande.date).toLocaleString("fr-FR")}`,
      20,
      50
    );

    // Articles
    let y = 70;
    doc.setFontSize(12);
    doc.text("Articles :", 20, y);
    y += 10;

    let total = 0;

    commande.items.forEach((item) => {
      //Vérifier que item existe
      if (!item) return;

      const prixItem = ((item.price || 0) * (item.quantity || 0)).toFixed(2);
      doc.text(
        `${item.names || "Article sans nom"} x${
          item.quantity || 0
        } — ${prixItem} €`,
        20,
        y
      );
      y += 8;
      total += (item.price || 0) * (item.quantity || 0);

      // Ajouts personnalisés
      if (
        item.isCustom &&
        item.customItems &&
        Array.isArray(item.customItems)
      ) {
        item.customItems.forEach((customItem) => {
          if (!customItem) return;
          const supplementQty = customItem.quantity || 1;
          doc.text(
            `   + ${customItem.text || "Suppl."} — +${(
              (customItem.prix || 0) * supplementQty
            ).toFixed(2)} €`,
            25,
            y
          );
          y += 6;
        });
      }

      // Retraits
      if (item.removedItems && Array.isArray(item.removedItems)) {
        item.removedItems.forEach((ri) => {
          if (!ri) return;
          doc.text(`   - ${ri.text || "Ingr."} (retiré)`, 25, y);
          y += 6;
        });
      }

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Total
    y += 10;
    doc.setFontSize(13);
    doc.text(`Total à payer : ${total.toFixed(2)} €`, 20, y);
    y += 20;
    doc.text("Merci pour votre commande !", 20, y);

    doc.save(`facture-${commande.id}.pdf`);
  };*/
  const calculateItemTotal = (item) => {
    // Utiliser la même logique que dans New.jsx
    let total = (item.prix || item.price || 0) * (item.quantity || 1);

    // Si extraPrice est disponible, l'utiliser directement
    if (item.extraPrice !== undefined && item.extraPrice !== null) {
      total += parseFloat(item.extraPrice);
    }
    // Sinon, recalculer à partir des customItems
    else if (item.isCustom && item.customItems?.length > 0) {
      item.customItems.forEach((customItem) => {
        const baseQty = customItem.baseQuantity || 0;
        const currentQty = customItem.quantity || 0;
        if (currentQty > baseQty) {
          const supplement = currentQty - baseQty;
          total += supplement * (customItem.prix || customItem.price || 0);
        }
      });
    }
    return total;
  };
  return (
    <div className="CartemainGeneral">
      <div className="searchGestionProduct">
        <h5>Liste des commandes</h5>
        <div className="GestionSearch">
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            onKeyDown={handleEnter}
            placeholder="Rechercher par numéro de commande (tapez Enter)"
          />
        </div>
      </div>

      {!filteredData || filteredData.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px" }}>
          Aucune commande trouvée
        </p>
      ) : (
        filteredData.map((commande) => {
          //Vérifier que commande et commande.items existent
          if (!commande || !commande.items || !Array.isArray(commande.items)) {
            console.warn(" Commande invalide:", commande);
            return null; // Ne pas rendre cette commande
          }

          return (
            <div key={commande.uniqueId} style={{ padding: "20px" }}>
              <div
                className="shoppingfull"
                style={{
                  maxHeight: "fit-content",
                  padding: "0px 20px 50px 20px",
                  position: "relative",
                }}
              >
                <div className="headercommand">
                  <p>Numéro de commande : {commande.id}</p>
                  <p>
                    Date : {new Date(commande.date).toLocaleString("fr-FR")}
                  </p>
                  <Button
                    className="retourbtn"
                    onClick={() => handleDownloadReceipt(commande)}
                  >
                    Télécharger
                  </Button>
                </div>
              </div>
              <div className="table-container">
                <table className="tableadmin">
                  <thead>
                    <tr style={{ backgroundColor: "#e31937" }}>
                      <th>Date</th>
                      <th>Article</th>
                      <th>Quantité</th>
                      <th>Prix</th>
                      <th>Numéro de commande</th>
                      <th>Nature commande</th>
                      {/* Ajouts conditionnels */}
                      {commande.type === "livraison" && <th>prix livraison</th>}
                      {commande.type === "livraison" && <th>Adresse</th>}
                      {commande.type === "livraison" && <th>Téléphone</th>}
                    </tr>
                  </thead>
                  <tbody className="tbodyadmin">
                    {commande.items.map((item, iIndex) => {
                      if (!item) return null;

                      return (
                        <tr id="btnligne" key={`${commande.id}-${iIndex}`}>
                          <td>
                            {new Date(commande.date).toLocaleString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            {item.names || "Article sans nom"}
                            {item.isCustom && (
                              <span
                                style={{ color: "blue", fontWeight: "bold" }}
                              >
                                (personnalisé)
                              </span>
                            )}
                            {item.isCustom && (
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  marginTop: "5px",
                                }}
                              >
                                {/* Ajouts */}
                                {item.customItems &&
                                  item.customItems.length > 0 && (
                                    <div style={{ color: "green" }}>
                                      <strong>Ajouts :</strong>
                                      {item.customItems.map(
                                        (ci, idx) =>
                                          ci && (
                                            <div key={idx}>
                                              + {ci.text} (+
                                              {(ci.prix || 0).toFixed(2)} €)
                                            </div>
                                          )
                                      )}
                                    </div>
                                  )}
                                {/* Retraits */}
                                {item.removedItems &&
                                  item.removedItems.length > 0 && (
                                    <div style={{ color: "red" }}>
                                      <strong>Retraits :</strong>
                                      {item.removedItems.map(
                                        (ri, idx) =>
                                          ri && <div key={idx}>- {ri.text}</div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            )}
                          </td>
                          <td>{item.quantity || 0}</td>
                          <td>{calculateItemTotal(item).toFixed(2)} €</td>
                          <td>{commande.id}</td>
                          <td>{item.type}</td>
                          {/* Ajouts conditionnels avec valeurs sécurisées */}
                          {commande.type === "livraison" && (
                            <td>
                              {parseFloat(item.prixLivraison || 0).toFixed(2)} €
                            </td>
                          )}
                          {commande.type === "livraison" && (
                            <td>{item.adresse || "Non spécifiée"}</td>
                          )}
                          {commande.type === "livraison" && (
                            <td>{item.telephone || "Non spécifié"}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Liste;
