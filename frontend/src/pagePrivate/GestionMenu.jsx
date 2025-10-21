import React, { useEffect, useState } from "react";
import fromage from "../assets/composition/fromage2.png";
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

const GestionMenu = () => {
  const [statutmsg, setstatutmsg] = useState({}); //useState(false);
  const [statut, setstatut] = useState({}); //useState(false);
  //Récupération du localstorage au demarrage
  useEffect(() => {
    const save = JSON.parse(localStorage.getItem("productStatus")) || {};
    setstatut(save);
    setstatutmsg(save);
  }, []);

  //filtrage
  const [filteredListpetit, setFilteredListpetit] = useState(bpc);
  const [filteredListgrand, setFilteredListgrand] = useState(hambs);
  const [boissonslist, setboissonslist] = useState(boissons);
  const dimi = [...snacks, ...sauce, ...salade, ...dessert, ...wrap];
  const [snackslist, setsnackslist] = useState(dimi);
  // activation / désactivation
  const handleselect = (id, text) => {
    setstatut((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("productStatus", JSON.stringify(updated));
      toast.success(`${!updated[id] ? `${text} activé` : `${text} désactivé`}`);
      return updated;
    });
    setstatutmsg((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  /* const handleselect = (id, text) => {
    setstatut((prev) => ({ ...prev, [id]: !prev[id] }));
    setstatutmsg((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(`${statut[id] ? `${text} activé` : `${text} désactivé`}`);
  };*/
  const [search, setsearch] = useState("");
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
      <div
        className="shoppingfull "
        style={{
          maxHeight: "fit-content",
          padding: "0px 20px 50px 20px",
        }}
      >
        <div
          className="shoppingcontent"
          style={{
            minHeight: "fit-content",
            scrollbarWidth: "none",
          }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e31937",
                  }}
                >
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
                    <tr
                      style={{
                        height: "150px",
                      }}
                      key={p.id}
                    >
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td>{p.taille}</td>

                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "red" : "green",
                        }}
                      >
                        {statut[p.id] ? "Désactivé" : "Activé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statutmsg[p.id] ? "Activer" : "Désactiver"}
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
      <div
        className="shoppingfull "
        style={{
          maxHeight: "fit-content",
          padding: "0px 20px 50px 20px",
        }}
      >
        <div
          className="shoppingcontent"
          style={{
            minHeight: "fit-content",
            scrollbarWidth: "none",
          }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e31937",
                  }}
                >
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
                    <tr
                      style={{
                        height: "150px",
                      }}
                      key={p.id}
                    >
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td>{p.taille}</td>

                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "red" : "green",
                        }}
                      >
                        {statut[p.id] ? "Désactivé" : "Activé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statutmsg[p.id] ? "Activer" : "Désactiver"}
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
      <div
        className="shoppingfull "
        style={{
          maxHeight: "fit-content",
          padding: "0px 20px 50px 20px",
        }}
      >
        <div
          className="shoppingcontent"
          style={{
            minHeight: "fit-content",
            scrollbarWidth: "none",
          }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e31937",
                  }}
                >
                  <th>Nom des sodas</th>
                  <th>Photo des sodas</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyadmin">
                {boissonslist.length > 0 ? (
                  boissonslist.map((p) => (
                    <tr
                      style={{
                        height: "150px",
                      }}
                      key={p.id}
                    >
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td>{p.taille}</td>

                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "red" : "green",
                        }}
                      >
                        {statut[p.id] ? "Désactivé" : "Activé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statutmsg[p.id] ? "Activer" : "Désactiver"}
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
      <div
        className="shoppingfull "
        style={{
          maxHeight: "fit-content",
          padding: "0px 20px 50px 20px",
        }}
      >
        <div
          className="shoppingcontent"
          style={{
            minHeight: "fit-content",
            scrollbarWidth: "none",
          }}
        >
          <div className="table-container">
            <table>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e31937",
                  }}
                >
                  <th>Nom autre</th>
                  <th>Photo autre</th>

                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="tbodyadmin">
                {snackslist.length > 0 ? (
                  snackslist.map((p) => (
                    <tr
                      style={{
                        height: "150px",
                      }}
                      key={p.id}
                    >
                      <td>{p.text}</td>
                      <td id="photoInventaire">
                        <img src={p.photo} alt="" />
                      </td>
                      <td>{p.taille}</td>

                      <td
                        style={{
                          backgroundColor: statut[p.id] ? "red" : "green",
                        }}
                      >
                        {statut[p.id] ? "Désactivé" : "Activé"}
                      </td>
                      <td id="actionProducts">
                        <Button
                          className="retourbtn"
                          onClick={() => handleselect(p.id, p.text)}
                        >
                          {statutmsg[p.id] ? "Activer" : "Désactiver"}
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
