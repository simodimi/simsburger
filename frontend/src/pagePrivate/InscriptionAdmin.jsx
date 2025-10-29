import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";
import spinner from "../assets/logo/spinner.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import juste from "../assets/administrateur/true.png";
import faux from "../assets/administrateur/cancel.png";
import { toast } from "react-toastify";
import axios from "axios";
const InscriptionAdmin = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("");
  const [loading, setloading] = useState(false);
  //boîte de dialogue
  const [open10, setOpen10] = useState(false);

  const handleClickOpen = (e) => {
    setOpen10(true);
  };

  const handleClose = () => {
    setOpen10(false);
  };
  const [verification, setverification] = useState({
    verify1: false,
    verify2: false,
    verify3: false,
    verify4: false,
    verify5: false,
  });
  const verif = [
    {
      id: 1,
      verif: "verify1",
      texte: "Le mot de passe doit contenir au moins 8 caractères.",
    },
    {
      id: 2,
      verif: "verify2",
      texte: "Le mot de passe doit contenir au moins une lettre majuscule.",
    },
    {
      id: 3,
      verif: "verify3",
      texte: "Le mot de passe doit contenir au moins une lettre minuscule.",
    },
    {
      id: 4,
      verif: "verify4",
      texte: "Le mot de passe doit contenir au moins un chiffre.",
    },
    {
      id: 5,
      verif: "verify5",
      texte: "Le mot de passe doit contenir au moins un caractère special.",
    },
  ];
  const [contrainte, setcontrainte] = useState(false);
  const [dataform, setdataform] = useState({
    adminname: "",
    adminemail: "",
    adminpassword: "",
    adminpasswordconfirm: "",
  });
  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
    if (e.target.name === "adminpassword") {
      passwordverification(e.target.value);
    }
  };
  // Fonction pour vérifier le statut de validation
  const checkAdminStatus = async (idadmin) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/status/${idadmin}`
      );
      return response.data.isactive;
    } catch (error) {
      console.error("Erreur vérification statut:", error);
      return false;
    }
  };

  // Polling pour vérifier la validation
  const startStatusPolling = (idadmin) => {
    const interval = setInterval(async () => {
      const isActive = await checkAdminStatus(idadmin);
      if (isActive) {
        clearInterval(interval);
        toast.success("Votre compte a été validé! Vous pouvez vous connecter.");
        handleClose();
        try {
          // 🔥 Récupération des infos complètes de l'admin validé
          const { data } = await axios.get(
            `http://localhost:5000/admin/${idadmin}`
          );
          // ✅ Redirection vers LoginAdmin avec les données
          navigate("/admin/", {
            state: {
              login: true,
              login1: false,
              adminData: data, // on passe les infos
            },
          });
        } catch (err) {
          console.error("Erreur récupération admin:", err);
          toast.error("Erreur lors de la récupération de vos données.");
        }
      }
    }, 5000); // Vérifier toutes les 5 secondes
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (
      !dataform.adminemail ||
      !dataform.adminname ||
      !dataform.adminpassword ||
      !dataform.adminpasswordconfirm
    ) {
      setmsgerror(true);
      setmsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      setloading(false);
      return;
    } // onClick={handleClickOpen}
    // Vérifier si les contraintes sont respectées
    if (!Object.values(verification).every(Boolean)) {
      //transformation de l'objet en tableau avec Object.values every permet de verifier si toutes les valeurs sont true
      setmsgerror(true);
      setmsgerrortext("Le mot de passe ne respecte pas toutes les règles");
      toast.error("Le mot de passe ne respecte pas toutes les règles");
      return;
    }
    if (dataform.adminpasswordconfirm !== dataform.adminpassword) {
      setmsgerror(true);
      setmsgerrortext("Les mots de passes ne sont pas identiques");
      setloading(false);
      return;
    }
    setloading(true);
    try {
      //envoi des données vers le backend
      const reponse = await axios.post(
        "http://localhost:5000/admin/inscription",
        dataform
      );
      if (reponse.status === 201) {
        toast.success(
          "Inscription reussie! attendre validation de l'administrateur"
        );
        const idadmin = reponse.data.idadmin; //storer l'id de l'admin
        handleClickOpen();
        //démarrrer le polling pour verifier la validation
        startStatusPolling(idadmin);
        setdataform({
          adminname: "",
          adminemail: "",
          adminpassword: "",
          adminpasswordconfirm: "",
        });
        setverification({
          verify1: false,
          verify2: false,
          verify3: false,
          verify4: false,
          verify5: false,
        });
        setcontrainte(false);
        setmsgerror(false);
        setmsgerrortext(false);
      }
    } catch (error) {
      //afficher les messages d'erreur du backend
      if (error.response?.data?.message) {
        setmsgerror(true);
        setmsgerrortext(error.response.data.message);
        toast.error(error.response.data.message);
        console.error("une erreur est survenue lors de l'inscription", error);
      } else {
        console.error("une erreur est survenue lors de l'inscription", error);
      }
    } finally {
      setloading(false);
    }
  };
  const passwordverification = (password) => {
    setcontrainte(true);
    setverification({
      verify1: password.length >= 8,
      verify2: /[A-Z]/.test(password),
      verify3: /[a-z]/.test(password),
      verify4: /[0-9]/.test(password),
      verify5: /[^A-Za-z0-9]/.test(password),
    });
  };
  return (
    <div className="shoppingService">
      <div className="Service">
        <Button
          className="retourbtn"
          onClick={() => {
            handleback();
          }}
        >
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

            {/*inscription */}

            <div className="">
              {msgerror && <p id="loginError">{msgerrortext}</p>}
              <form onSubmit={handlesubmit}>
                <div className="ServiceInscription">
                  <div className="ServiceInscriptionTitle">
                    <p>Nom</p>
                    <input
                      type="text"
                      name="adminname"
                      value={dataform.adminname}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="ServiceInscriptionTitle">
                    <p>Adresse email</p>
                    <input
                      type="email"
                      name="adminemail"
                      value={dataform.adminemail}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="ServiceInscriptionTitle">
                    <p>Mot de passe</p>
                    <input
                      type="password"
                      name="adminpassword"
                      value={dataform.adminpassword}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="ServiceInscriptionTitle">
                    <p>Confirmer le mot de passe</p>
                    <input
                      type="password"
                      name="adminpasswordconfirm"
                      value={dataform.adminpasswordconfirm}
                      onChange={handlechange}
                    />
                  </div>
                  {contrainte && (
                    <div className="verification">
                      {verif.map((item) => (
                        <div className="verificationItem" key={item.id}>
                          <div className="icon">
                            {/*prend dans l'objet verification la valeur qui correspond à la clé item.verif */}
                            {verification[item.verif] ? (
                              <img src={juste} alt="ok" />
                            ) : (
                              <img src={faux} alt="erreur" />
                            )}
                          </div>
                          <p>{item.texte}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="btnLogin">
                    <Button type="submit" className="nextbtn">
                      {loading ? "Envoi en cours..." : "S'inscrire"}
                    </Button>
                  </div>
                </div>
              </form>
              <div className=" loginFooter">
                <p>
                  vous avez déjà un compte ?{" "}
                  <Link to="/admin/" style={{ color: "#e31937" }}>
                    Se connecter
                  </Link>
                </p>
                <p>
                  mot de passe oublie?{" "}
                  <Link
                    to="/admin/initialisationadmin"
                    style={{ color: "blue" }}
                  >
                    Reinitialiser mot de passe
                  </Link>
                </p>
              </div>
              {open10 && (
                <Dialog
                  open={open10}
                  onClose={handleClose}
                  className="custom-dialog"
                >
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
                    </DialogContentText>
                    <DialogContentText id="messageConfirm">
                      <p>
                        {" "}
                        veuillez attendre que l'administrateur valide votre
                        inscription.
                      </p>
                    </DialogContentText>
                    <DialogContentText id="messageConfirm">
                      <p>En attente ...</p>
                    </DialogContentText>
                    <DialogActions className="DialogActions">
                      <div className="spinnerContainer">
                        <img id="spinner" src={spinner} alt="" />
                        <img id="logospinner" src={logo} alt="" />
                      </div>
                    </DialogActions>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionAdmin;
