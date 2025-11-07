import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, user, isAuthenticated } = useAuth();

  const handleback = () => navigate(-1);
  const [msgerror, setMsgerror] = useState(false);
  const [msgerrortext, setMsgerrortext] = useState("erreur de connexion");
  const [arrow, setArrow] = useState(false);
  const [usercommande, setUsercommande] = useState([]);
  const [showtable, setShowtable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  const [pointsCumules, setPointsCumules] = useState(0);
  const [pointsUtilises, setPointsUtilises] = useState(0);
  const [pointsDisponibles, setPointsDisponibles] = useState(0);

  // Récupération des points seulement si l'utilisateur est connecté
  useEffect(() => {
    const fetchPoints = async () => {
      if (!isAuthenticated) return;

      try {
        const res = await axios.get("http://localhost:5000/user/points");
        setPointsCumules(Number(res.data.pointscumules));
        setPointsUtilises(Number(res.data.pointsutilises));
        setPointsDisponibles(Number(res.data.pointsrestant));
      } catch (error) {
        console.error("Erreur lors de la récupération des points :", error);
        // Si erreur 401, l'utilisateur n'est probablement pas connecté
        if (error.response?.status === 401) {
          console.log("Utilisateur non authentifié pour récupérer les points");
        }
      }
    };

    fetchPoints();
  }, [isAuthenticated]);

  // toggle de l'historique
  const handleClick = () => {
    setArrow((prev) => !prev);
    setShowtable((prev) => !prev);
  };

  // calcul du total global
  const totalGlobal = usercommande.reduce((sumCommande, commande) => {
    const totalCommande = commande.items.reduce(
      (sumItem, item) => sumItem + item.prix * item.quantity,
      0
    );
    return sumCommande + totalCommande;
  }, 0);

  const handleClose = () => {
    setOpen10(false);
    setIndexToDelete(null);
  };

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
        // Vous devez avoir l'ID de la commande pour la suppression
        // const id = commandeASupprimer.id;
        // await axios.delete(`http://localhost:5000/orderitem/${id}`);
        setUsercommande((prev) => prev.filter((_, i) => i !== indexToDelete));
        toast.success("Commande supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de la commande", error);
        toast.error("Erreur lors de la suppression");
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
  const [valuecode, setValuecode] = useState("");

  useEffect(() => {
    if (valuecode.length > 0 && valuecode.length !== 5) {
      setCodeError("Le code doit contenir 5 chiffres");
    } else {
      setCodeError("");
    }
  }, [valuecode]);

  const handleCode = async () => {
    if (valuecode.length !== 5) {
      toast.error("Le code doit contenir exactement 5 chiffres");
      return;
    }
    try {
      await axios.post("http://localhost:5000/user/updatecode", {
        valuecode,
      });
      setCodeError("Code enregistré avec succès");
      toast.success("Code enregistré avec succès");
      setCode(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du code", error);
      toast.error("Erreur lors de l'enregistrement du code");
    }
  };

  const handleChangeCode = async () => {
    try {
      await axios.post("http://localhost:5000/user/updatecode", {
        valuecode: "",
      });
      toast.success("Code réinitialisé");
      setCode(true);
      setValuecode("");
      setCodeError("");
    } catch (error) {
      console.error("Erreur lors de la modification du code", error);
      toast.error("Erreur lors de la modification du code");
    }
  };

  const [datauser, setDatauser] = useState({
    mailuser: "",
    passworduser: "",
  });

  const handlechanges = (e) => {
    setDatauser({ ...datauser, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!datauser.mailuser || !datauser.passworduser) {
      setMsgerror(true);
      setMsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await login(datauser.mailuser, datauser.passworduser);
      setMsgerror(false);
      setMsgerrortext("");
      setDatauser({ mailuser: "", passworduser: "" });

      // Redirection après connexion réussie
      const from = location.state?.from?.pathname || "/carte";
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion";
      setMsgerror(true);
      setMsgerrortext(msg);
    } finally {
      setLoading(false);
    }
  };

  // Récupération des commandes seulement si l'utilisateur est connecté
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await axios.get("http://localhost:5000/orderitem");
        const commandesRegroupees = response.data.reduce((acc, item) => {
          const commandeId = item.order_id;
          if (!acc[commandeId]) {
            acc[commandeId] = {
              id: commandeId,
              date: item.createdAt || new Date(),
              type: item.type,
              items: [],
            };
          }
          acc[commandeId].items.push(item);
          return acc;
        }, {});

        const result = Object.values(commandesRegroupees);
        setUsercommande(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

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
            {!isAuthenticated && (
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
                        required
                      />
                    </div>
                    <div className="ServiceInscriptionTitle">
                      <p>Mot de passe</p>
                      <input
                        type="password"
                        name="passworduser"
                        value={datauser.passworduser}
                        onChange={handlechanges}
                        required
                      />
                    </div>
                    <div className="btnLogin">
                      <Button
                        type="submit"
                        className="nextbtn"
                        disabled={loading}
                      >
                        {loading ? "Connexion en cours..." : "Se connecter"}
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="loginFooter">
                  <p>
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/inscription" style={{ color: "#e31937" }}>
                      Inscrivez-vous
                    </Link>
                  </p>
                  <p>
                    Mot de passe oublié ?{" "}
                    <Link to="/initialisation" style={{ color: "blue" }}>
                      Réinitialiser mot de passe
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* --- SECTION UTILISATEUR CONNECTÉ --- */}
            {isAuthenticated && user && (
              <div className="loginUser">
                <p>Bonjour {user.nameuser || user.username} !</p>

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

                {/* Code de fidélité */}
                <div className="ServiceInscriptionTitle">
                  <p>Créer votre code de fidélité</p>
                  {codeError && (
                    <p
                      style={{
                        color: codeError.includes("succès") ? "green" : "red",
                      }}
                    >
                      {codeError}
                    </p>
                  )}
                  <input
                    type="text"
                    style={{ width: "270px" }}
                    placeholder="Veuillez saisir 5 chiffres"
                    value={valuecode}
                    onChange={(e) => setValuecode(e.target.value)}
                    maxLength={5}
                    pattern="[0-9]*"
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  {valuecode.length === 5 && (
                    <Button
                      className="acceptbtn"
                      onClick={code ? handleCode : handleChangeCode}
                    >
                      {code ? "Confirmer" : "Changer"}
                    </Button>
                  )}
                </div>

                {/* --- HISTORIQUE DES COMMANDES --- */}
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
                              {usercommande.some(
                                (cmd) => cmd.type === "livraison"
                              ) && <th>Adresse de livraison</th>}
                              <th>Supprimer</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usercommande.map((commande, cIndex) =>
                              commande.items.map((item, iIndex) => (
                                <tr key={`${commande.id}-${iIndex}`}>
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
                                  {commande.type === "livraison" && (
                                    <td>{item.adresse || "Non spécifiée"}</td>
                                  )}
                                  <td>
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

                <Button
                  onClick={handleLogout}
                  className="rejectbtn"
                  style={{ marginTop: "20px" }}
                >
                  Se déconnecter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DIALOG SUPPRESSION --- */}
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
    </div>
  );
};

export default Login;
