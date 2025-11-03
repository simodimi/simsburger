import React, { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import "../styles/adminkey.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "../pagePrivate/Utils";

const GestionUser = () => {
  const [smsUser, setSmsUser] = useState([]);

  //  Charger au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("smsUser");
    if (saved) setSmsUser(JSON.parse(saved));
  }, []);
  const handleanswersms = (id) => {
    window.location.href = `mailto:${id}`;
  };
  const [open10, setOpen10] = useState(false);
  const [readSms, setReadSms] = useState(null);
  const handleClicknext1 = () => {
    if (readSms) {
      handleanswersms(readSms.email_service);
    }
  };
  const handleClose = () => {
    setOpen10(false);
    setReadSms(null);
  };
  const second = useRef(null);
  const handleClick = (p) => {
    setReadSms(p);
    setOpen10(true);
  };
  useEffect(() => {
    const updating = async () => {
      try {
        const response = await axios.get("http://localhost:5000/message");
        setSmsUser(response.data);
      } catch (error) {
        console.error("une erreur est survenue", error);
      }
    };
    updating();
    const intervalId = setInterval(updating, 5000);
    return () => clearInterval(intervalId);
  }, []);

  //FONCTION POUR REGROUPER LES MESSAGES PAR MOIS
  const groupSms = (sms) => {
    //trier les messages par date
    const sorted = [...sms].sort((a, b) => new Date(b.date) - new Date(a.date));
    //regrouper les messages par mois et annee
    return sorted.reduce((acc, msg) => {
      const d = new Date(msg.date);
      const mois = d.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
      if (!acc[mois]) {
        acc[mois] = [];
      }
      acc[mois].push(msg);
      return acc;
    }, {});
  };
  return (
    <div className="CartemainGeneral">
      <div className="searchGestionProduct">
        <h5>Liste des Messages des clients</h5>
      </div>
      <div
        className="shoppingfull "
        style={{
          maxHeight: "fit-content",
          padding: "0px 20px 50px 20px",
        }}
      >
        {Object.entries(groupSms(smsUser)).map(([mois, messages]) => (
          <div key={mois} style={{ marginBottom: "30px" }}>
            <h3
              style={{
                textTransform: "capitalize",
                fontWeight: "bold",
                color: "#e31937",
                marginBottom: "10px",
              }}
            >
              📅 {mois}
            </h3>
            {messages.map((item) => (
              <div
                className=" messageTitleUser"
                key={item.id}
                onClick={() => handleClick(item)}
              >
                <p style={{ textAlign: "justify", padding: "10px 0px" }}>
                  {item.email_service}
                  <span style={{ marginLeft: "50px" }}>
                    {new Date(item.date).toLocaleString()}{" "}
                  </span>
                </p>
                <p
                  className="messageuser"
                  style={{ textAlign: "justify", padding: "10px 0px" }}
                >
                  {item.messageService}
                </p>
                <Button
                  className="retourbtn"
                  onClick={(e) => {
                    e.stopPropagation(); //empêcher d'ouvrir le dialog
                    handleanswersms(item.email_service);
                  }}
                >
                  Répondre au message par mail
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
      {open10 && readSms && (
        <Dialog open={open10} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>

            <DialogContentText id="messageConfirm">
              <p>
                Message du client(e):
                <span style={{ fontWeight: "bold" }}>
                  {readSms.email_service}
                </span>{" "}
              </p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <p>{readSms.messageService}</p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose()} className="rejectbtn">
              Fermer
            </Button>
            <Button autoFocus className="nextbtn" onClick={handleClicknext1}>
              Répondre au mail du client
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default GestionUser;
