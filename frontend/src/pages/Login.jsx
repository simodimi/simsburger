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
import { useAuth } from "./AuthContextUser";
import axios from "axios";
import { use } from "react";

const Login = () => {
  const navigate = useNavigate();
  const handleback = () => navigate(-1);
  const [login2, setlogin] = useState(false);
  const [login1, setlogin1] = useState(true);
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");
  const [arrow, setarrow] = useState(false);
  const [usercommande, setusercommande] = useState([]);
  const [showtable, setshowtable] = useState(false);
  const { login, logout, user, isAuthenticated } = useAuth();
  const [loading, setloading] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  const [pointsCumules, setPointsCumules] = useState(0);
  const [pointsUtilises, setPointsUtilises] = useState(0);
  const [pointsDisponibles, setPointsDisponibles] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/points", {
          withCredentials: true,
        });
        setPointsCumules(Number(res.data.pointscumules));
        setPointsUtilises(Number(res.data.pointsutilises));
        setPointsDisponibles(Number(res.data.pointsrestant));
      } catch (error) {
        console.error("Erreur lors de la récupération des points :", error);
      }
    };
    fetchPoints();
  }, []);
  //pointsDisponibles = pointsCumules - pointsUtilises;
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
  /*  useEffect(() => {
    if (nouveauxPoints > pointsCumules) {
      setPointsCumules(nouveauxPoints);
      localStorage.setItem("pointsCumules", JSON.stringify(nouveauxPoints));
    }
  }, [nouveauxPoints]);*/

  const handleClose = () => {
    setOpen10(false);
    setIndexToDelete(null);
  };

  // Suppression de la commande et dans le backend
  useEffect(() => {});
  const handleConfirmDelete = async () => {
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
      try {
        axios.delete(`http://localhost:5000/orderitem/${id}`);
        setusercommande((prev) => prev.filter((_, i) => i !== indexToDelete));
      } catch (error) {
        console.error("Erreur lors de la suppression de la commande", error);
      }
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
  const handleCode = async () => {
    if (valuecode.length !== 5) {
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/user/updatecode",
        {
          valuecode,
        },
        { withCredentials: true }
      );
      setCodeError("code enregistré");
      toast.success("code enregistré");
      setvaluecode(valuecode);
      setcodereduction(valuecode);
      setCode(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du code", error);
    }
  };
  const handlechange = async () => {
    try {
      await axios.post("http://localhost:5000/user/updatecode", {
        valuecode,
      });
      toast.success("code enregistré");
      setCode(true);
      setvaluecode("");
      setCodeError("");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du code", error);
    }
  };
  const [datauser, setdatauser] = useState({
    mailuser: "",
    passworduser: "",
  });

  const handlechanges = (e) => {
    setdatauser({ ...datauser, [e.target.name]: e.target.value });
  };
  const handleLogout = async () => {
    try {
      // Appel correct : POST + withCredentials
      await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );
      await logout();
      toast.info("Déconnexion réussie !");
      setlogin(false);
      setlogin1(true);
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      toast.error("Une erreur est survenue lors de la déconnexion");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!datauser.mailuser || !datauser.passworduser) {
      setmsgerror(true);
      setmsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setloading(true);
    try {
      await login(datauser.mailuser && datauser.passworduser);
      toast.success("Connexion réussie !");
      const from = location.state?.from?.pathname || "/carte";
      navigate(from, { replace: true });
      setmsgerror(false);
      setmsgerrortext(false);
      setlogin1(false);
      setlogin(true);
      setdatauser({ mailuser: "", passworduser: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion";
      setmsgerror(msg);
      toast.error(msg);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const update = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orderitem");
        // 🔥 REGROUPER LES ITEMS PAR COMMANDE COTÉ FRONTEND
        const commandesRegroupees = response.data.reduce((acc, item) => {
          const commandeId = item.order_id;
          if (!acc[commandeId]) {
            acc[commandeId] = {
              id: commandeId,
              date: item.createdAt || new Date(), // Utiliser createdAt comme date
              type: item.type, //stockage du type de commande
              items: [],
            };
          }
          acc[commandeId].items.push(item);
          return acc;
        }, {});

        const result = Object.values(commandesRegroupees);
        setusercommande(result);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    update();
    const interval = setInterval(update, 5000); // Mettre à jour toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);
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
                        {loading ? "Connexion en cours..." : "Se connecter"}
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
            {isAuthenticated && user && login2 && (
              <div className="loginUser">
                <p>hello {user.username}</p>
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
                    Points de fidélité cumulés :
                    <strong>{pointsCumules.toFixed(2)}</strong> bitSim's
                  </p>
                  <p>
                    Points de fidélité utilisés : {pointsUtilises.toFixed(2)}{" "}
                    bitSim's
                  </p>
                  <p>
                    Points de fidélité disponibles :
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
                    type="text"
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
                              {
                                (usercommande.type = "livraison" && (
                                  <th>Adresse de livraison</th>
                                ))
                              }
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
                                  {
                                    (usercommande.type = "livraison" && (
                                      <td>{item.adresse}</td>
                                    ))
                                  }
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
