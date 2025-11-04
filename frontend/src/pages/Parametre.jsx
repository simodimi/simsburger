import React, { useState } from "react";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import bas from "../assets/icone/bas.png";
import haut from "../assets/icone/haut.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useAuth } from "./AuthContextUser";
import axios from "axios";

const Parametre = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleback = () => {
    navigate(-1);
  };
  const [arrow, setarrow] = useState({
    arrow1: false,
  });

  const handleClick = (id) => {
    setarrow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [langue, setLangue] = useState("Français");
  const handlelangue = (value) => {
    setLangue(value === "fr" ? "Français" : "");
    setarrow({ arrow1: false });
  };
  const [open10, setOpen10] = useState(false);
  const [open11, setOpen11] = useState(false);
  const handleClose = () => {
    setOpen10(false);
  };
  const handleClose1 = () => {
    setOpen11(false);
  };
  const handlelock = () => {
    logout();
  };
  const handlelock1 = async () => {
    try {
      await axios.delete(`http://localhost:5000/user/${user.iduser}`, {
        withCredentials: true,
      });
      await logout();
      navigate("/inscription");
    } catch (error) {
      console.log(error);
    }
  };
  if (!user) return <p>Chargement...</p>;
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
          </div>
          <div className="parametreheader">
            <div className="parametreinfo">
              <h1>informations</h1>
              <div className="parametreUser">
                <p>nom: {user.nameuser}</p>
                <p>email: {user.mailuser}</p>
              </div>
            </div>
            <div className="parametreinfo">
              <h1>langue</h1>
              <div className="parametreUser">
                <p>
                  Par défaut :<span>{langue}</span>{" "}
                </p>
                <div
                  className=""
                  style={{ display: "flex", alignItems: "center", gap: "80px" }}
                >
                  <p>Choisir la Langue</p>
                  <div
                    className="ServiceOptionIcons"
                    onClick={() => handleClick("arrow1")}
                  >
                    {arrow.arrow1 ? (
                      <img src={haut} alt="" />
                    ) : (
                      <img src={bas} alt="" />
                    )}
                  </div>
                </div>
                {arrow.arrow1 && (
                  <div
                    className=""
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <p onClick={() => handlelangue("fr")}>Français</p>
                  </div>
                )}
              </div>
            </div>
            <div className="parametreinfo">
              <h1>Sécurité et confidentialité</h1>
              <div className="parametreUsers">
                <p onClick={() => setOpen10(true)}>Se déconnecter</p>
                <p onClick={() => setOpen11(true)}>supprimer le compte</p>
              </div>
            </div>
          </div>
        </div>
        {open10 && (
          <Dialog open={open10} onClose={handleClose} className="custom-dialog">
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
              </DialogContentText>
              <DialogContentText id="messageConfirm">
                <p> vous voulez vraiment vous déconnecter ?</p>
              </DialogContentText>
            </DialogContent>

            <DialogActions className="DialogActions">
              <Button onClick={() => handleClose()} className="rejectbtn">
                Annuler
              </Button>
              <Button autoFocus className="nextbtn" onClick={handlelock}>
                Confirmer
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {open11 && (
          <Dialog
            open={open11}
            onClose={handleClose1}
            className="custom-dialog"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
              </DialogContentText>
              <DialogContentText id="messageConfirm">
                <p> vous voulez vraiment supprimer le compte ?</p>
              </DialogContentText>
            </DialogContent>

            <DialogActions className="DialogActions">
              <Button onClick={() => handleClose1()} className="rejectbtn">
                Annuler
              </Button>
              <Button autoFocus className="nextbtn" onClick={handlelock1}>
                Confirmer
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Parametre;
