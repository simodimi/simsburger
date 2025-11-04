import React, { useEffect, useState } from "react";
import logo from "../assets/logo/logo.png";
import "../styles/adminkey.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import bas from "../assets/icone/bas.png";
import haut from "../assets/icone/haut.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useAuth } from "./AuthContext";

const ParamAdmin = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [arrow, setarrow] = useState({ arrow1: false });
  const [langue, setLangue] = useState("Français");
  const [openLogout, setOpenLogout] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClick = (id) =>
    setarrow((prev) => ({ ...prev, [id]: !prev[id] }));
  const handlelangue = (value) => setLangue(value === "fr" ? "Français" : "");
  const handlelock1 = async () => {
    try {
      await axios.delete(`http://localhost:5000/admin/${admin.idadmin}`, {
        withCredentials: true,
      });
      await logout();
      navigate("/inscriptionadmin");
    } catch (error) {
      console.log(error);
    }
  };
  if (!admin) return <p>Chargement...</p>;

  return (
    <div className="shoppingService">
      <div className="Service">
        <Button className="retourbtn" onClick={() => navigate(-1)}>
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
              <h1>Informations</h1>
              <div className="parametreUser">
                <p>Nom : {admin.adminname}</p>
                <p>Email : {admin.adminemail}</p>
                <p>Poste : {admin.role}</p>
              </div>
            </div>

            <div className="parametreinfo">
              <h1>Langue</h1>
              <div className="parametreUser">
                <p>
                  Par défaut : <span>{langue}</span>
                </p>
                <div
                  className="ServiceOptionIcons"
                  onClick={() => handleClick("arrow1")}
                >
                  <img src={arrow.arrow1 ? haut : bas} alt="" />
                </div>
                {arrow.arrow1 && (
                  <div
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
                <p onClick={() => setOpenLogout(true)}>Se déconnecter</p>
                <p onClick={() => setOpenDelete(true)}>Supprimer le compte</p>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
          <DialogContent>
            <DialogContentText>
              <p>Voulez-vous vraiment vous déconnecter ?</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLogout(false)} className="rejectbtn">
              Annuler
            </Button>
            <Button
              onClick={() => {
                //
                navigate("/admin/");
                logout();
              }}
              className="nextbtn"
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogContent>
            <DialogContentText>
              <p>Voulez-vous vraiment supprimer le compte ?</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)} className="rejectbtn">
              Annuler
            </Button>
            <Button className="nextbtn" onClick={handlelock1}>
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ParamAdmin;
