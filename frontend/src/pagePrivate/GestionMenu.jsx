import React, { useEffect, useState } from "react";
import "../styles/adminkey.css";
import Button from "../components/Button";
import {
  boissons,
  bpc,
  dessert,
  hambs,
  MainListAdmingrand,
  MainListAdminpetit,
  salade,
  sauce,
  snacks,
  wrap,
} from "../containers/exportelt/Exportelt";
import { toast } from "react-toastify";
import axios from "../pagePrivate/Utils";

const GestionMenu = () => {
  const [statut, setstatut] = useState({});
  const [loading, setLoading] = useState(true);
  const [filteredListpetit, setFilteredListpetit] = useState(bpc);
  const [filteredListgrand, setFilteredListgrand] = useState(hambs);
  const [boissonslist, setboissonslist] = useState(boissons);
  const dimi = [...snacks, ...sauce, ...salade, ...dessert, ...wrap];
  const [snackslist, setsnackslist] = useState(dimi);
  const [search, setsearch] = useState("");

  // Fonction pour initialiser la BDD - AJOUTER UN CATCH POUR ÉVITER LE BLOQUAGE
  const initProducts = async () => {
    try {
      const allProducts = [
        ...bpc,
        ...hambs,
        ...boissons,
        ...snacks,
        ...sauce,
        ...salade,
        ...dessert,
        ...wrap,
      ];

      const response = await axios.post(
        "http://localhost:5000/product/init",
        allProducts
      );

      if (response.status === 200) {
        toast.success("Produits initialisés en base !");
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
    }
  };

  // Récupération des statuts depuis le backend
  const loadProductStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/product");
      const statusData = response.data;
      const statusMap = statusData.reduce((acc, product) => {
        acc[product.productId] = product.active;
        return acc;
      }, {});
      setstatut(statusMap);
    } catch (error) {
      console.error("Erreur chargement statuts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialisation + chargement des statuts au démarrage
  useEffect(() => {
    const initAndLoad = async () => {
      await initProducts();
      await loadProductStatus();
    };
    initAndLoad();
  }, []);

  // Activation / désactivation d'un produit - CORRIGÉ
  const handleselect = async (id, text) => {
    try {
      const newStatus = !statut[id];

      // Mettre à jour l'état IMMÉDIATEMENT pour un feedback visuel rapide
      setstatut((prev) => ({ ...prev, [id]: newStatus }));

      const response = await axios.put(`http://localhost:5000/product/${id}`, {
        active: newStatus,
      });

      if (response.status === 200) {
        toast.success(`${text} ${newStatus ? "activé" : "désactivé"}`);
      }
    } catch (error) {
      console.error("Erreur de mise à jour de statut:", error);
      // REVERT en cas d'erreur
      setstatut((prev) => ({ ...prev, [id]: !newStatus }));
    }
  };

  if (loading) return <div>Chargement des produits...</div>;

  const handlesearch = (e) => {
    e.preventDefault();
    setsearch(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFilteredListpetit(
        MainListAdminpetit.filter((item) =>
          item.text.toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredListgrand(
        MainListAdmingrand.filter((item) =>
          item.text.toLowerCase().includes(search.toLowerCase())
        )
      );
      setboissonslist(
        boissons.filter((item) =>
          item.text.toLowerCase().includes(search.toLowerCase())
        )
      );
      setsnackslist(
        dimi.filter((item) =>
          item.text.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="CartemainGeneral">
      <div className="searchGestionProduct">
        <h5>Liste des burgers</h5>
        <div className="GestionSearch">
          <input
            type="search"
            name=""
            id=""
            value={search}
            onChange={handlesearch}
            onKeyDown={handleEnter}
            placeholder="ecrivez le nom du produit et taper sur Enter"
          />
        </div>
      </div>

      {/* PETITS BURGERS */}
      <div
        className="shoppingfull"
        style={{ maxHeight: "fit-content", padding: "0px 20px 50px 20px" }}
      >
        <div
          className="shoppingcontent"
          style={{ minHeight: "fit-content", scrollbarWidth: "none" }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr style={{ backgroundColor: "#e31937" }}>
                  <th>Nom du burger</th>
                  <th>Photo du burger</th>
                  <th>Type de burger</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyadmin">
                {filteredListpetit.length > 0 ? (
                  filteredListpetit.map((p) => (
                    <tr style={{ height: "150px" }} key={p.id}>
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td>{p.taille}</td>
                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "green" : "red",
                        }}
                      >
                        {statut[p.id] ? "Activé" : "Désactivé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statut[p.id] ? "Désactiver" : "Activer"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center", padding: "40px" }}>
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GRANDS BURGERS */}
      <div
        className="shoppingfull"
        style={{ maxHeight: "fit-content", padding: "0px 20px 50px 20px" }}
      >
        <div
          className="shoppingcontent"
          style={{ minHeight: "fit-content", scrollbarWidth: "none" }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr style={{ backgroundColor: "#e31937" }}>
                  <th>Nom du burger</th>
                  <th>Photo du burger</th>
                  <th>Type de burger</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyadmin">
                {filteredListgrand.length > 0 ? (
                  filteredListgrand.map((p) => (
                    <tr style={{ height: "150px" }} key={p.id}>
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td>{p.taille}</td>
                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "green" : "red",
                        }}
                      >
                        {statut[p.id] ? "Activé" : "Désactivé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statut[p.id] ? "Désactiver" : "Activer"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center", padding: "40px" }}>
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOISSONS */}
      <div
        className="shoppingfull"
        style={{ maxHeight: "fit-content", padding: "0px 20px 50px 20px" }}
      >
        <div
          className="shoppingcontent"
          style={{ minHeight: "fit-content", scrollbarWidth: "none" }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr style={{ backgroundColor: "#e31937" }}>
                  <th>Nom des sodas</th>
                  <th>Photo des sodas</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyadmin">
                {boissonslist.length > 0 ? (
                  boissonslist.map((p) => (
                    <tr style={{ height: "150px" }} key={p.id}>
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "green" : "red",
                        }}
                      >
                        {statut[p.id] ? "Activé" : "Désactivé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statut[p.id] ? "Désactiver" : "Activer"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center", padding: "40px" }}>
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SNACKS ET AUTRES */}
      <div
        className="shoppingfull"
        style={{ maxHeight: "fit-content", padding: "0px 20px 50px 20px" }}
      >
        <div
          className="shoppingcontent"
          style={{ minHeight: "fit-content", scrollbarWidth: "none" }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr style={{ backgroundColor: "#e31937" }}>
                  <th>Nom autre</th>
                  <th>Photo autre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyadmin">
                {snackslist.length > 0 ? (
                  snackslist.map((p) => (
                    <tr style={{ height: "150px" }} key={p.id}>
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "green" : "red",
                        }}
                      >
                        {statut[p.id] ? "Activé" : "Désactivé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statut[p.id] ? "Désactiver" : "Activer"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center", padding: "40px" }}>
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionMenu;
