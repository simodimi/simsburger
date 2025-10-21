import React, { useEffect, useState } from "react";
import "../styles/shopping.css";
import Button from "../components/Button";
import jsPDF from "jspdf";
import logo from "../assets/logo/logo.png";

const Liste = ({ data }) => {
  // S'assurer que data est toujours un tableau
  const orders = Array.isArray(data) ? data : [];
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(orders);

  //mettre à jour le tableau de filtrer quand data change
  useEffect(() => {
    setFilteredData(orders);
  }, [orders]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const query = search.trim().toLowerCase();

      // Filtrage : par numéro de commande (id)
      const result = orders.filter((commande) =>
        commande.id.toString().toLowerCase().includes(query)
      );

      setFilteredData(result);
    }
  };
  //telecharger les facture
  const handleDownloadReceipt = (commande) => {
    const doc = new jsPDF();

    // === HEADER ===
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 160, 10, 40, 25); // logo en haut à droite

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

    // === ARTICLES ===
    let y = 70;
    doc.setFontSize(12);
    doc.text("Articles :", 20, y);
    y += 10;

    let total = 0;

    commande.items.forEach((item) => {
      const prixItem = (item.price * item.quantity).toFixed(2);
      doc.text(`${item.name} x${item.quantity} — ${prixItem} €`, 20, y);
      y += 8;
      total += item.price * item.quantity;

      // ✅ Ajouts personnalisés
      if (item.isCustom && item.customItems) {
        item.customItems.forEach((customItem) => {
          doc.text(
            `   + ${customItem.text} x${customItem.quantity} — +${(
              customItem.prix * customItem.quantity
            ).toFixed(2)} €`,
            25,
            y
          );
          y += 6;
        });
      }

      // ✅ Retraits
      if (item.removedItems && item.removedItems.length > 0) {
        item.removedItems.forEach((ri) => {
          doc.text(`   - ${ri.text}`, 25, y);
          y += 6;
        });
      }

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // === INFOS LIVRAISON ===
    const isLivraison = commande.items.some((i) => i.type === "livraison");
    if (isLivraison) {
      const fraisLivraison = commande.deliveryFee || 0;
      const livraison = commande.livraison || {};

      y += 10;
      doc.setFontSize(13);
      doc.text("Informations de livraison :", 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(`Lieu du restaurant : Luminy, Marseille`, 20, y);
      y += 8;
      doc.text(
        `Destination client : ${livraison.adresse || "Adresse non indiquée"}`,
        20,
        y
      );
      y += 8;
      doc.text(
        `Téléphone client : ${livraison.telephone || "Non renseigné"}`,
        20,
        y
      );
      y += 8;
      doc.text(`Frais de livraison : ${fraisLivraison.toFixed(2)} €`, 20, y);
      total += fraisLivraison;
      y += 8;
    }

    // === TOTAL ===
    y += 10;
    doc.setFontSize(13);
    doc.text(`Total à payer : ${total.toFixed(2)} €`, 20, y);

    y += 20;
    doc.setFontSize(12);
    doc.text("Merci pour votre commande ! ", 20, y);

    // === TÉLÉCHARGEMENT ===
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
            placeholder="Écrivez le nom du produit et tapez sur Enter"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px" }}>
          Aucune commande trouvée
        </p>
      ) : (
        filteredData.map((commande) => (
          <div
            key={commande.id}
            style={{
              padding: "20px",
            }}
          >
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
                  {Array.isArray(commande.items) &&
                    commande.items.map((item, iIndex) => (
                      <tr id="btnligne" key={`${commande.id}-${iIndex}`}>
                        <td>
                          {new Date(commande.date).toLocaleString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>

                        <td>
                          {item.name}
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
                                item.customItems?.length > 0 && (
                                  <div style={{ color: "green" }}>
                                    <strong>Ajouts :</strong>
                                    {item.customItems.map((ci, idx) => (
                                      <div key={idx}>
                                        + {ci.text}{" "}
                                        {ci.quantity > 1
                                          ? `x${ci.quantity}`
                                          : ""}
                                        (+{(ci.price * ci.quantity).toFixed(2)}{" "}
                                        €)
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
