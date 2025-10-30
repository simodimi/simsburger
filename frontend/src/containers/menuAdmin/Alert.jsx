import React, { useState } from "react";
import "../../styles/adminkey.css";
import Button from "../../components/Button";
import { inventaire } from "../exportelt/Exportelt";
import { toast } from "react-toastify";
import axios from "../../pagePrivate/Utils";

const Alert = () => {
  const [data, setData] = useState(
    inventaire.map((item) => ({
      id: item.id,
      nomproduit: item.text,
      numserie: "00000",
      numstock: 1,
      dateperemption: "",
      perte: 0,
      commentaire: "",
    }))
  );

  const handleChange = (id, field, value) => {
    setData(
      //on parcourt le tableau data et on modifie l'objet qui a l'id correspondant
      (prev) =>
        prev.map(
          (item) =>
            item.id === id // si l'id correspond à celui de l'élément qu'on veut modifier
              ? { ...item, [field]: value } // on retourne une copie de l'élément avec la propriété modifiée en rmplaçant field par value
              : item // sinon on retourne l'élément tel quel
        )
    );
  };

  const handlesave = async () => {
    console.log("Inventaire enregistré :", data);
    //VERIFIONS SI au moins un des champs est vide
    const dataform = data.some(
      (item) =>
        !item.nomproduit || // ✅ Ajouter cette vérification
        !item.numserie ||
        item.numstock === undefined ||
        item.numstock === null ||
        !item.dateperemption ||
        item.perte === null ||
        item.perte === undefined
    );
    if (dataform) {
      toast.error(
        "Veuillez remplir au moins les champs Numéro de série, Quantité produit en stock, Date de péremption et Pertes."
      );
      console.error("error", dataform);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/inventaire`,
        data
      );
      if (response.status === 200) {
        toast.success("Inventaire enregistré!");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Une erreur s'est produite.");
        console.error(error);
      }
    }
    setData(
      inventaire.map((item) => ({
        id: item.id,
        numserie: "00000",
        numstock: 1,
        dateperemption: "",
        perte: 0,
        commentaire: "",
      }))
    );
  };

  return (
    <div className="CartemainGeneral">
      <h5>Inventaires</h5>
      <div className="historisques">
        <p style={{ paddingLeft: "20px" }}>
          Inventaire du {new Date().toLocaleString()}
        </p>
      </div>

      <div
        className="shoppingfull"
        style={{ maxHeight: "fit-content", padding: "0px 20px" }}
      >
        <div
          className="shoppingcontent"
          style={{ minHeight: "fit-content", scrollbarWidth: "none" }}
        >
          <table>
            <thead>
              <tr style={{ backgroundColor: "#e31937" }}>
                <th>Jour du mois</th>
                <th>Photo produit</th>
                <th>Nom produit</th>
                <th>Numéro de série</th>
                <th>Quantité produit en stock</th>
                <th>Date de péremption</th>
                <th>Pertes</th>
                <th>Action</th>
                <th style={{ width: "300px" }}>Commentaires</th>
              </tr>
            </thead>
            <tbody className="tbodyadmin">
              {inventaire.map((p) => {
                //on cherche l'objet dans data qui a le même id que l'élément courant de inventaire
                const item = data.find((d) => d.id === p.id);
                return (
                  <tr key={p.id} style={{ height: "235px" }}>
                    <td>{new Date().toLocaleDateString()}</td>
                    <td id="photoInventaire">
                      <img src={p.photo} alt={p.text} />
                    </td>
                    <td>{p.text}</td>
                    <td>
                      <input
                        type="text"
                        value={item.numserie}
                        style={{
                          width: "100%",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                          cursor: "pointer",
                          padding: "0px 10px",
                        }}
                        onChange={(e) =>
                          handleChange(p.id, "numserie", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.numstock}
                        min={0}
                        style={{
                          width: "50px",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                        }}
                        onChange={(e) =>
                          handleChange(p.id, "numstock", Number(e.target.value))
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        value={item.dateperemption}
                        style={{
                          width: "100%",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                          cursor: "pointer",
                        }}
                        onChange={(e) =>
                          handleChange(p.id, "dateperemption", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={item.perte}
                        min={0}
                        style={{
                          width: "50px",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                        }}
                        onChange={(e) =>
                          handleChange(p.id, "perte", Number(e.target.value))
                        }
                      />
                    </td>
                    <td
                      id="actionProduct"
                      style={{
                        backgroundColor:
                          item.numstock < 3
                            ? "red"
                            : item.numstock < 5
                            ? "yellow"
                            : "green",
                      }}
                    ></td>
                    <td style={{ width: "300px" }}>
                      <textarea
                        value={item.commentaire}
                        placeholder="Commentaires"
                        style={{
                          width: "100%",
                          height: "100%",
                          resize: "none",

                          outline: "none",
                          cursor: "text",
                          scrollbarWidth: "thin",
                        }}
                        onChange={(e) =>
                          handleChange(p.id, "commentaire", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="Alertesbtn">
          <Button className="retourbtn" onClick={handlesave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
