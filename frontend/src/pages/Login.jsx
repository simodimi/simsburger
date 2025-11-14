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
import { io } from "socket.io-client";
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

  const [socket, setSocket] = useState(null);
  //mis a jour à l'instant
  useEffect(() => {
    const newSocket = io("http://localhost:5000", { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("join_orders_room");

    // Quand une nouvelle commande arrive
    newSocket.on("new_orderitems", async (data) => {
      const newOrders = Array.isArray(data) ? data : [data];
      setUsercommande((prev) => [...newOrders, ...prev]);

      // 🔁 Met à jour les points en temps réel
      if (isAuthenticated) {
        try {
          const res = await axios.get("http://localhost:5000/user/points");
          setPointsCumules(parseFloat(res.data.pointscumules));
          setPointsUtilises(parseFloat(res.data.pointsutilises));
          setPointsDisponibles(
            parseFloat(res.data.pointscumules) -
              parseFloat(res.data.pointsutilises)
          );
        } catch (error) {
          console.error("Erreur lors de la mise à jour des points :", error);
        }
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Erreur connexion Socket.io:", error);
    });

    return () => {
      newSocket.emit("leave_orders_room");
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  // toggle de l'historique
  const handleClick = () => {
    setArrow((prev) => !prev);
    setShowtable((prev) => !prev);
  };
  /*const calculateItemTotal = (item) => {
    const basePrice = (item.price || item.prix || 0) * (item.quantity || 1);
    const supplements = item.extraPrice || 0;
    return basePrice + supplements;
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

  // calcul du total global
  const totalGlobal = usercommande.reduce((sumCommande, commande) => {
    const totalCommande = commande.items.reduce(
      (sumItem, item) => sumItem + calculateItemTotal(item),
      0
    );
    return sumCommande + totalCommande;
  }, 0);

  const handleClose = () => {
    setOpen10(false);
    setIndexToDelete(null);
  };

  /* const handleConfirmDelete = async () => {
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
        await axios.delete(`http://localhost:5000/orderitem/${id}`);
        setUsercommande((prev) => prev.filter((_, i) => i !== indexToDelete));
        toast.success("Commande supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de la commande", error);
        toast.error("Erreur lors de la suppression");
      }
    }
    handleClose();
  };*/
  const handleConfirmDelete = async () => {
    if (indexToDelete === null) return;
    const commandeASupprimer = usercommande[indexToDelete];
    console.log("ID de la commande à supprimer :", commandeASupprimer.id);

    try {
      const res = await axios.delete(
        `http://localhost:5000/orderitem/order/${commandeASupprimer.id}`
      );

      // Vérifie la réponse avant d'afficher quoi que ce soit
      if (res.status === 200 && res.data?.success) {
        // Supprimer la commande du state
        setUsercommande((prev) => prev.filter((_, i) => i !== indexToDelete));

        // Met à jour les points
        if (isAuthenticated) {
          const pts = await axios.get("http://localhost:5000/user/points");
          setPointsCumules(parseFloat(pts.data.pointscumules) || 0);
          setPointsUtilises(parseFloat(pts.data.pointsutilises) || 0);
          setPointsDisponibles(parseFloat(pts.data.pointsrestant) || 0);
        }

        toast.success(res.data.message || "Commande supprimée avec succès ✅");
      } else {
        console.error("❌ Échec de la suppression :", res.data);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
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

      // Redirection vers la page précédente avant la connexion
      //const previousPath = location.state?.prev || "/carte";
      // navigate(previousPath, { replace: true });
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

  useEffect(() => {
    if (!isAuthenticated) {
      setPointsCumules(0);
      setPointsUtilises(0);
      setPointsDisponibles(0);
      return;
    }

    const fetchPoints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/points", {
          withCredentials: true,
        });

        //S'assurer que les valeurs sont bien des nombres
        const cumules = parseFloat(res.data.pointscumules || 0);
        const utilises = parseFloat(res.data.pointsutilises || 0);
        const restant = cumules - utilises;

        setPointsCumules(cumules);
        setPointsUtilises(utilises);
        setPointsDisponibles(restant);
      } catch (err) {
        console.error("❌ Erreur récupération points:", err);
        console.error("📋 Détails de l'erreur:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
        // Réinitialiser en cas d'erreur
        setPointsCumules(0);
        setPointsUtilises(0);
        setPointsDisponibles(0);
      }
    };

    fetchPoints();
  }, [isAuthenticated]);
  //

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
                <p>Bonjour {user.nameuser || "Utilisateur"} !</p>

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
                            {usercommande.map((commande, cIndex) => (
                              <tr key={commande.id}>
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
                                  {/* Afficher tous les articles de la commande groupée */}
                                  {commande.items.map((item, iIndex) => (
                                    <div
                                      key={iIndex}
                                      style={{
                                        marginBottom: "10px",
                                        padding: "5px",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      <strong>
                                        {item.names || "Article sans nom"}
                                      </strong>
                                      {item.isCustom && (
                                        <span
                                          style={{
                                            color: "blue",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {" "}
                                          (personnalisé)
                                        </span>
                                      )}
                                      <div>Quantité: {item.quantity}</div>
                                      <div>
                                        Prix:{" "}
                                        {calculateItemTotal(item).toFixed(2)} €
                                      </div>

                                      {/* Détails de personnalisation */}
                                      {item.isCustom && (
                                        <div
                                          style={{
                                            fontSize: "0.8rem",
                                            marginTop: "5px",
                                          }}
                                        >
                                          {item.customItems &&
                                            item.customItems.length > 0 && (
                                              <div style={{ color: "green" }}>
                                                <strong>Ajouts :</strong>
                                                {item.customItems.map(
                                                  (ci, idx) =>
                                                    ci && (
                                                      <div key={idx}>
                                                        + {ci.text} (+
                                                        {(ci.prix || 0).toFixed(
                                                          2
                                                        )}{" "}
                                                        €)
                                                      </div>
                                                    )
                                                )}
                                              </div>
                                            )}
                                          {item.removedItems &&
                                            item.removedItems.length > 0 && (
                                              <div style={{ color: "red" }}>
                                                <strong>Retraits :</strong>
                                                {item.removedItems.map(
                                                  (ri, idx) =>
                                                    ri && (
                                                      <div key={idx}>
                                                        - {ri.text}
                                                      </div>
                                                    )
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </td>
                                <td>
                                  {commande.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                  )}
                                </td>
                                <td>
                                  {(() => {
                                    const total = commande.items.reduce(
                                      (sum, item) =>
                                        sum + (calculateItemTotal(item) || 0),
                                      0
                                    );

                                    return Number(total).toFixed(2);
                                  })()}{" "}
                                  €
                                </td>
                                <td>{commande.id}</td>
                                <td>
                                  {(() => {
                                    const total = commande.items.reduce(
                                      (sum, item) =>
                                        sum + (calculateItemTotal(item) || 0),
                                      0
                                    );

                                    const points = total / 5;

                                    return Number(points).toFixed(2);
                                  })()}{" "}
                                  bitSim's
                                </td>
                                {commande.type === "livraison" && (
                                  <td>
                                    {commande.items[0]?.adresse ||
                                      "Non spécifiée"}
                                  </td>
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
                            ))}
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
