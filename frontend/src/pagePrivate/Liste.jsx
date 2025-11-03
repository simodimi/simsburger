import React, { useEffect, useState } from "react";
import "../styles/shopping.css";
import Button from "../components/Button";
import jsPDF from "jspdf";
import logo from "../assets/logo/logo.png";
import axios from "../pagePrivate/Utils";

const Liste = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const update = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orderitem");
        console.log("📥 Données reçues:", response.data); // 🔥 DEBUG

        // 🔥 REGROUPER LES ITEMS PAR COMMANDE COTÉ FRONTEND
        const commandesRegroupees = response.data.reduce((acc, item) => {
          const commandeId = item.order_id;

          if (!acc[commandeId]) {
            acc[commandeId] = {
              id: commandeId,
              date: item.createdAt || new Date(), // Utiliser createdAt comme date
              items: [],
            };
          }

          acc[commandeId].items.push(item);
          return acc;
        }, {});

        const result = Object.values(commandesRegroupees);
        console.log("🔄 Commandes regroupées:", result); // 🔥 DEBUG

        setFilteredData(result);
        setOrders(result);
      } catch (error) {
        console.error("❌ Erreur:", error);
      }
    };
    update();
    const interval = setInterval(update, 5000); // Mettre à jour toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = search.trim().toLowerCase();

      const result = orders.filter((commande) =>
        commande.id.toString().toLowerCase().includes(query)
      );

      setFilteredData(result);
    }
  };

  // 🔥 CORRIGER handleDownloadReceipt POUR LES NOUVELLES DONNÉES
  const handleDownloadReceipt = (commande) => {
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
      const prixItem = (item.price * item.quantity).toFixed(2);
      doc.text(`${item.names} x${item.quantity} — ${prixItem} €`, 20, y);
      y += 8;
      total += item.price * item.quantity;

      // Ajouts personnalisés
      if (item.isCustom && item.customItems) {
        // 🔥 CORRECTION : customItems est déjà un tableau d'objets
        item.customItems.forEach((customItem) => {
          const supplementQty = customItem.quantity || 1;
          doc.text(
            `   + ${customItem.text} — +${(
              customItem.prix * supplementQty
            ).toFixed(2)} €`,
            25,
            y
          );
          y += 6;
        });
      }

      // Retraits
      if (item.removedItems && item.removedItems.length > 0) {
        item.removedItems.forEach((ri) => {
          doc.text(`   - ${ri.text} (retiré)`, 25, y);
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

      {filteredData.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px" }}>
          Aucune commande trouvée
        </p>
      ) : (
        filteredData.map((commande) => (
          <div key={commande.id} style={{ padding: "20px" }}>
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
                <p>Date : {new Date(commande.date).toLocaleString("fr-FR")}</p>
                <Button
                  className="retourbtn"
                  onClick={() => handleDownloadReceipt(commande)}
                >
                  Télécharger
                </Button>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr style={{ backgroundColor: "#e31937" }}>
                    <th>Date</th>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Numéro de commande</th>
                    <th>Nature commande</th>
                  </tr>
                </thead>
                <tbody className="tbodyadmin">
                  {commande.items.map((item, iIndex) => (
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
                        {item.names}
                        {item.isCustom && (
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            (personnalisé)
                          </span>
                        )}
                        {item.isCustom && (
                          <div
                            style={{ fontSize: "0.85rem", marginTop: "5px" }}
                          >
                            {/* Ajouts */}
                            {item.customItems &&
                              item.customItems.length > 0 && (
                                <div style={{ color: "green" }}>
                                  <strong>Ajouts :</strong>
                                  {item.customItems.map((ci, idx) => (
                                    <div key={idx}>
                                      + {ci.text} (+{ci.prix.toFixed(2)} €)
                                    </div>
                                  ))}
                                </div>
                              )}
                            {/* Retraits */}
                            {item.removedItems &&
                              item.removedItems.length > 0 && (
                                <div style={{ color: "red" }}>
                                  <strong>Retraits :</strong>
                                  {item.removedItems.map((ri, idx) => (
                                    <div key={idx}>- {ri.text}</div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity).toFixed(2)} €</td>
                      <td>{commande.id}</td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Liste;
