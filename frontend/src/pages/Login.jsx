import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import bas from "../assets/icone/bas.png";
import haut from "../assets/icone/haut.png";
import "../styles/login.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { toast } from "react-toastify";

const Login = ({
  usercommande,
  setusercommande,
  setcodereduction,
  pointsUtilises,
  setPointsUtilises,
  login2,
  usernamens,
}) => {
  const navigate = useNavigate();
  const handleback = () => navigate(-1);
  const [login, setlogin] = useState(false);
  const [login1, setlogin1] = useState(true);
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");
  const [arrow, setarrow] = useState(false);
  const [showtable, setshowtable] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [pointsCumules, setPointsCumules] = useState(
    JSON.parse(localStorage.getItem("pointsCumules")) || 0
  );
  useEffect(() => {
    if (login2) {
      setlogin(true);
      setlogin1(false);
    }
  }, [login2]);

  // Calcul des points disponibles (toujours à jour via les props)
  const pointsDisponibles = pointsCumules - pointsUtilises;
  // toggle de l’historique
  const handleClick = () => {
    setarrow((prev) => !prev);
    setshowtable((prev) => !prev);
  };

  // calcul du total global
  const totalGlobal = usercommande.reduce((sumCommande, commande) => {
    const totalCommande = commande.items.reduce(
      (sumItem, item) => sumItem + item.prix * item.quantity,
      0
    );
    return sumCommande + totalCommande;
  }, 0);

  // nouveaux points gagnés
  const nouveauxPoints = totalGlobal / 5;

  // mise à jour des points cumulés seulement si le total augmente
  useEffect(() => {
    if (nouveauxPoints > pointsCumules) {
      setPointsCumules(nouveauxPoints);
      localStorage.setItem("pointsCumules", JSON.stringify(nouveauxPoints));
    }
  }, [nouveauxPoints]);

  const handleClose = () => {
    setOpen10(false);
    setIndexToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (indexToDelete !== null) {
      const commandeASupprimer = usercommande[indexToDelete];
      if (commandeASupprimer.pointsUtilises) {
        setPointsUtilises((prev) =>
          Math.max(0, prev - commandeASupprimer.pointsUtilises)
        );
      }
      if (commandeASupprimer.pointsGagnes) {
        setPointsCumules((prev) =>
          Math.max(0, prev - commandeASupprimer.pointsGagnes)
        );
      }
      setusercommande((prev) => prev.filter((_, i) => i !== indexToDelete));
    }
    handleClose();
  };

  const handleClickdelete = (index) => {
    setIndexToDelete(index);
    setOpen10(true);
  };
  //code fidélité
  const [code, setCode] = useState(true);
  const [codeError, setCodeError] = useState("");
  const [valuecode, setvaluecode] = useState("");
  useEffect(() => {
    if (valuecode.length !== 5) {
      setCodeError("le code doit contenir 5 chiffres");
    } else {
      setCodeError("");
    }
  }, [valuecode]);
  const handleCode = () => {
    if (valuecode.length !== 5) {
      return;
    }

    setCodeError("code enregistré");
    setvaluecode(valuecode);
    setcodereduction(valuecode);
    console.log("Code de fidélité enregistré :", valuecode);
    setCode(false);
  };
  const handlechange = () => {
    setCode(true);
    setvaluecode("");
    setCodeError("");
  };
  const [datauser, setdatauser] = useState({
    mailuser: "",
    passworduser: "",
  });

  const handlechanges = (e) => {
    setdatauser({ ...datauser, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datauser.mailuser || !datauser.passworduser) {
      setmsgerror(true);
      setmsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (datauser.mailuser && datauser.passworduser) {
      setmsgerror(false);
      setmsgerrortext(false);
      setlogin(true);
      setlogin1(false);
      toast.success("Connexion reussie!");
      setdatauser({ mailuser: "", passworduser: "" });
      console.log("email:" + datauser.mailuser);
      console.log("password:" + datauser.passworduser);

      return;
    }
  };
  const handleLogout = () => {
    setlogin(false);
    setlogin1(true);
    toast.success("Deconnexion reussie");
  };
  return (
    <div className="shoppingService">
      <div className="Service">
        <Button className="retourbtn" onClick={handleback}>
          <p>Retour</p>
        </Button>

        <div className="shoppingfull">
          <div className="loginMain">
            <div className="LoginLogo">
              <img src={logo} alt="" />
              <p>
                <span>Sim'sburger</span>
              </p>
            </div>

            {/* --- SECTION LOGIN --- */}
            {login1 && (
              <div className="">
                {msgerror && <p id="loginError">{msgerrortext}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="ServiceInscription">
                    <div className="ServiceInscriptionTitle">
                      <p>Adresse email</p>
                      <input
                        type="email"
                        name="mailuser"
                        value={datauser.mailuser}
                        onChange={handlechanges}
                      />
                    </div>
                    <div className="ServiceInscriptionTitle">
                      <p>Mot de passe</p>
                      <input
                        type="password"
                        name="passworduser"
                        value={datauser.passworduser}
                        onChange={handlechanges}
                      />
                    </div>
                    <div className="btnLogin">
                      <Button type="submit" className="nextbtn">
                        Se connecter
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="loginFooter">
                  <p>
                    vous n'avez pas un compte ?{" "}
                    <Link to="/inscription" style={{ color: "#e31937" }}>
                      Inscrivez-vous
                    </Link>
                  </p>
                  <p>
                    mot de passe oublié ?{" "}
                    <Link to="/initialisation" style={{ color: "blue" }}>
                      Réinitialiser mot de passe
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* --- SECTION UTILISATEUR CONNECTÉ --- */}
            {login && (
              <div className="loginUser">
                <p>hello {usernamens}</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    margin: "10px 0",
                  }}
                >
                  <p>
                    🌟 Plus vous commandez, plus vous gagnez des points de
                    fidélité !
                  </p>
                  <p>1 bitSim's = 5 euros dépensés</p>
                  <p>
                    Points de fidélité cumulés :{" "}
                    <strong>{pointsCumules.toFixed(2)}</strong> bitSim's
                  </p>
                  <p>
                    Points de fidélité utilisés : {pointsUtilises.toFixed(2)}{" "}
                    bitSim's
                  </p>
                  <p>
                    Points de fidélité disponibles :{" "}
                    <strong>
                      {(pointsDisponibles > 0 ? pointsDisponibles : 0).toFixed(
                        2
                      )}
                    </strong>{" "}
                    bitSim's
                  </p>
                </div>

                <div className="ServiceInscriptionTitle">
                  <p>Créer votre code de fidélité</p>
                  {valuecode.length >= 1 && (
                    <p style={{ color: "red" }}>{codeError} </p>
                  )}
                  <input
                    type="number"
                    name=""
                    style={{ width: "270px" }}
                    placeholder="veuillez saisir 5 chiffres"
                    value={valuecode}
                    onChange={(e) => setvaluecode(e.target.value)}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  {valuecode.length === 5 && (
                    <Button
                      className="acceptbtn"
                      onClick={code ? handleCode : handlechange}
                    >
                      {code ? "Confirmer" : "Changer"}
                    </Button>
                  )}
                </div>

                {/* --- HISTORIQUE --- */}
                <div className="">
                  <div className="ServiceOption">
                    <p style={{ marginBottom: "10px" }}>
                      Historique des commandes
                    </p>
                    <div className="ServiceOptionIcons" onClick={handleClick}>
                      {arrow ? (
                        <img src={haut} alt="" />
                      ) : (
                        <img src={bas} alt="" />
                      )}
                    </div>
                  </div>

                  {showtable && (
                    <div className="">
                      {usercommande.length === 0 ? (
                        <p>Aucune commande enregistrée</p>
                      ) : (
                        <table>
                          <thead>
                            <tr style={{ backgroundColor: "#e31937" }}>
                              <th>Date</th>
                              <th>Nom</th>
                              <th>Quantité</th>
                              <th>Prix</th>
                              <th>N° commande</th>
                              <th>Points fidélité</th>
                              <th>Supprimer</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usercommande.map((commande, cIndex) =>
                              commande.items.map((item, iIndex) => (
                                <tr
                                  id="btnligne"
                                  key={`${commande.id}-${iIndex}`}
                                >
                                  <td>
                                    {new Date(commande.date).toLocaleString(
                                      "fr-FR",
                                      {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }
                                    )}
                                  </td>
                                  <td>
                                    {item.text}
                                    {item.isCustom && (
                                      <span
                                        style={{
                                          color: "blue",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        (personnalisé)
                                      </span>
                                    )}
                                  </td>
                                  <td>{item.quantity}</td>
                                  <td>
                                    {(item.prix * item.quantity).toFixed(2)} €
                                  </td>
                                  <td>{commande.id}</td>
                                  <td>
                                    {((item.prix * item.quantity) / 5).toFixed(
                                      2
                                    )}{" "}
                                    bitSim's
                                  </td>
                                  <td id="btnpaiement">
                                    <Button
                                      className="rejectbtn"
                                      onClick={() => handleClickdelete(cIndex)}
                                    >
                                      Supprimer
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>

                <p style={{ cursor: "pointer" }} onClick={handleLogout}>
                  Se déconnecter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DIALOG SUPPRESSION --- */}
      {open10 && (
        <Dialog open={open10} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger, ton kiff, ton Sim'sburger 🍔</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <p>Voulez-vous vraiment supprimer cette commande ?</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="DialogActions">
            <Button onClick={handleClose} className="rejectbtn">
              Annuler
            </Button>
            <Button autoFocus className="nextbtn" onClick={handleConfirmDelete}>
              Confirmer la suppression
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Login;
