import React, { useEffect, useRef, useState } from "react";
import fromage from "../../assets/composition/fromage2.png";
import "../../styles/adminkey.css";
import Button from "../../components/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import entre from "../../assets/logo/image.png";
import { toast } from "react-toastify";
import axios from "../../pagePrivate/Utils";

const Fournisseur = () => {
  const [viewfournisseurs, setViewfournisseurs] = useState(false);
  const [btnctrl, setBtnctrl] = useState(true);
  const [previewimage, setpreviewimage] = useState(null);

  //ajouter un tableau avec les fournisseurs
  const [addfournisseur, setaddfournisseur] = useState({
    id: "",
    nomentreprise: "",
    logoproduit: "",
    nomproduit: "",
    telephone: "",
    email: "",
    commentaire: "",
  });

  //charger les fournisseurs aux montages

  const getFournisseurs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fournisseur");

      setNewfournisseurs(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getFournisseurs();
  }, []);

  //creerun tableau des fournisseur
  const [newfournisseurs, setNewfournisseurs] = useState([]);
  const handleaddfournisseur = () => {
    setViewfournisseurs(true);
    setBtnctrl(false);
  };
  const handlesavefournisseur = async () => {
    if (
      !addfournisseur.nomentreprise ||
      !addfournisseur.nomproduit ||
      !addfournisseur.telephone ||
      !addfournisseur.email
    ) {
      toast.error(
        "Veuillez au moins remplir le nom de l'entreprise, le nom du produit et le numéro de téléphone."
      );

      return;
    }
    try {
      //CONSTRUIRE LE formdata
      const formData = new FormData();
      formData.append("nomentreprise", addfournisseur.nomentreprise);
      formData.append("nomproduit", addfournisseur.nomproduit);
      formData.append("telephone", addfournisseur.telephone);
      formData.append("email", addfournisseur.email);
      formData.append("commentaire", addfournisseur.commentaire);
      //ajouter les fichiers si ils existent
      if (addfournisseur.logoproduit instanceof File) {
        formData.append("logoproduit", addfournisseur.logoproduit);
      }
      //envoyer la requete au backend
      const response = await axios.post(
        "http://localhost:5000/fournisseur",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Fournisseur ${addfournisseur.nomentreprise} ajouté!`);
        await getFournisseurs();
        //setNewfournisseurs((prev) => [...prev, response.data]);
        setaddfournisseur({
          id: "",
          nomentreprise: "",
          logoproduit: "",
          nomproduit: "",
          telephone: "",
          email: "",
          commentaire: "",
        });
        setViewfournisseurs(false);
        setBtnctrl(true);

        //liste complete
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Une erreur s'est produite.");
      }
    }
  };
  const handlefournisseur = (e, field, value) => {
    setaddfournisseur((prev) => ({ ...prev, [field]: value }));
  };
  const picture = useRef(null);
  const handlephoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      //enregistrement du fichier dans addfournisseur pour le backend
      handlefournisseur(e, "logoproduit", file);
      setpreviewimage(URL.createObjectURL(file));
    }
  };
  //dialog
  const [open10, setOpen10] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const handleClose = () => {
    setOpen10(false);
    setSelectedFournisseur(null);
  };
  //supprimer un fournisseur
  const handledelete = (item) => {
    setOpen10(true);
    setSelectedFournisseur(item);
  };
  const handleClicknext1 = async () => {
    if (selectedFournisseur) {
      try {
        await axios.delete(
          `http://localhost:5000/fournisseur/${selectedFournisseur.id}`
        );
        await getFournisseurs(); // mise à jour des données
        toast.success(
          `Fournisseur ${selectedFournisseur.nomentreprise} supprimé!`
        );
      } catch (error) {
        console.error("Erreur suppression fournisseur:", error);
        toast.error("Erreur lors de la suppression du fournisseur.");
      } finally {
        // On ferme seulement après que tout soit terminé
        handleClose();
      }
    }
  };
  const handledrop = () => {
    setViewfournisseurs(false);
    setBtnctrl(true);
    setaddfournisseur({
      id: "",
      nomentreprise: "",
      logoproduit: "",
      nomproduit: "",
      telephone: "",
      email: "",
      commentaire: "",
    });
  };
  return (
    <div className="CartemainGeneral" style={{ position: "relative" }}>
      <h5>Fournisseurs</h5>

      {newfournisseurs.length === 0 && !viewfournisseurs ? (
        <div className="" style={{ textAlign: "center" }}>
          <p>Aucun fournisseur ajouté, cliquez sur le bouton ci-dessous.</p>
        </div>
      ) : (
        <div
          className="shoppingfull "
          style={{
            maxHeight: "fit-content",
            padding: "0px 20px",
          }}
        >
          <div
            className="shoppingcontent"
            style={{
              minHeight: "fit-content",
              scrollbarWidth: "none",
            }}
          >
            <table>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e31937",
                  }}
                >
                  <th>Nom de l'entreprise</th>
                  <th>Logo entreprise</th>
                  <th>Nom produit</th>
                  <th>téléphone</th>
                  <th>adresse mail</th>
                  <th>Action</th>
                  <th
                    style={{
                      width: "300px", // largeur fixe (tu ajustes selon ton besoin)
                    }}
                  >
                    Commentaires
                  </th>
                </tr>
              </thead>
              <tbody>
                {viewfournisseurs && (
                  <tr
                    style={{
                      height: "235px",
                    }}
                  >
                    <td>
                      <input
                        type="texte"
                        name=""
                        id=""
                        value={addfournisseur.nomentreprise}
                        onChange={(e) =>
                          handlefournisseur(e, "nomentreprise", e.target.value)
                        }
                        placeholder="nom entreprise"
                        style={{
                          width: "100%",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                    <td id="photoInventaires">
                      <input
                        type="file"
                        name=""
                        id=""
                        style={{ display: "none" }}
                        ref={picture}
                        accept="image/*"
                        onChange={handlephoto}
                      />
                      <span onClick={() => picture.current.click()}>
                        Selectionner une image
                      </span>
                      {previewimage && (
                        <img
                          src={previewimage}
                          alt=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        />
                      )}
                    </td>
                    <td>
                      <input
                        type="texte"
                        name=""
                        id=""
                        placeholder="nom produit"
                        value={addfournisseur.nomproduit}
                        onChange={(e) =>
                          handlefournisseur(e, "nomproduit", e.target.value)
                        }
                        style={{
                          width: "100%",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="tel"
                        value={addfournisseur.telephone}
                        placeholder="numéro téléphone"
                        onChange={(e) =>
                          handlefournisseur(e, "telephone", e.target.value)
                        }
                        style={{
                          width: "fit-content",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={addfournisseur.email}
                        placeholder="adresse mail"
                        onChange={(e) =>
                          handlefournisseur(e, "email", e.target.value)
                        }
                        style={{
                          width: "fit-content",
                          height: "50px",
                          textAlign: "center",
                          borderRadius: "10px",
                          border: "1px solid #e31937",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td id="actionProduct">
                      <Button className="retourbtn" onClick={handledrop}>
                        supprimer fournisseur
                      </Button>
                    </td>
                    <td
                      id="commentaireProduit"
                      style={{
                        height: "150px", // hauteur de la cellule
                        width: "300px", // largeur fixe (tu ajustes selon ton besoin)
                        verticalAlign: "top", // garde le contenu en haut
                      }}
                    >
                      <textarea
                        name=""
                        id="commentairesProduit"
                        placeholder="commentaires"
                        value={addfournisseur.commentaire}
                        onChange={(e) =>
                          handlefournisseur(e, "commentaire", e.target.value)
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          resize: "none",
                          border: "1px solid #e31937",
                          outline: "none",
                          cursor: "text",
                          scrollbarWidth: "thin",
                        }}
                      ></textarea>
                    </td>
                  </tr>
                )}
                {newfournisseurs.map((item) => (
                  <tr
                    style={{
                      height: "235px",
                    }}
                    key={item.id}
                  >
                    <td>{item.nomentreprise}</td>
                    <td id="photoInventaire">
                      <img src={item.logoproduit || entre} alt="" />
                    </td>
                    <td>{item.nomproduit}</td>

                    <td>{item.telephone}</td>
                    <td className="fournisseurscase">{item.email}</td>
                    <td id="actionProduct">
                      <Button
                        className="retourbtn"
                        onClick={() => handledelete(item)}
                      >
                        supprimer fournisseur
                      </Button>
                    </td>
                    <td
                      id="commentaireProduit"
                      style={{
                        height: "150px", // hauteur de la cellule
                        width: "300px", // largeur fixe (tu ajustes selon ton besoin)
                      }}
                    >
                      <textarea
                        value={item.commentaire}
                        style={{
                          width: "100%",
                          height: "calc(100% - 20px)",
                          resize: "none",
                          padding: "10px",
                          outline: "none",
                          cursor: "text",
                          border: "0px",
                          scrollbarWidth: "thin",
                          pointerEvents: "none",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="Alertesbtn">
        <Button className="retourbtn">
          {btnctrl ? (
            <span onClick={handleaddfournisseur}>Ajouter fournisseur</span>
          ) : (
            <span onClick={handlesavefournisseur}>Sauvegarder fournisseur</span>
          )}
        </Button>
      </div>
      {open10 && selectedFournisseur && (
        <Dialog open={open10} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText
              sx={{
                textAlign: "center !important",
                fontFamily: "Passions Conflict",
                fontSize: "60px",
              }}
            >
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText sx={{ textAlign: "center" }}>
              <img src={selectedFournisseur.logoproduit} alt="" />
              <p>
                voulez-vous vraiment supprimer le fournisseur
                <span style={{ fontWeight: "bold" }}>
                  {selectedFournisseur.nomentreprise}
                </span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={handleClose} className="rejectbtn">
              Annuler
            </Button>
            <Button autoFocus className="nextbtn" onClick={handleClicknext1}>
              confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Fournisseur;
