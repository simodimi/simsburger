import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

const InitAdmin = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");
  //gestion renitialisation
  const steps = ["Adresse email", "consulter vos mails", "Mot de passe"];
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //premier bouton suivant
    if (activeStep === 0) {
      if (!dataform.adminemail) {
        setmsgerror(true);
        setmsgerrortext("Veuillez remplir tous les champs");
        toast.error("Veuillez remplir tous les champs");
        setActiveStep(0);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dataform.adminemail)) {
        setmsgerror(true);
        setmsgerrortext("adresse email non valide");
        toast.error("adresse email non valide");
        setActiveStep(0);
        return;
      }
    }
    if (activeStep === 1) {
      if (!dataform.numeroverificationmail) {
        setmsgerror(true);
        setmsgerrortext(
          "Veuillez remplir votre numero de verification reçu par mail"
        );
        toast.error("Veuillez remplir tous les champs");
        setActiveStep(1);
        return;
      }
      const numbertest = "123456";
      if (dataform.numeroverificationmail !== numbertest) {
        setmsgerror(true);
        setmsgerrortext("numero de verification non valide");
        toast.error("numero de verification non valide");
        setActiveStep(1);
        return;
      }
    }
    if (activeStep === 2) {
      if (!dataform.adminpassword || !dataform.adminpasswordconfirm) {
        setmsgerror(true);
        setmsgerrortext("Veuillez remplir tous les champs");
        toast.error("Veuillez remplir tous les champs");
        setActiveStep(2);
        return;
      }
      if (dataform.adminpassword !== dataform.adminpasswordconfirm) {
        setmsgerror(true);
        setmsgerrortext("Les mots de passes ne sont pas identiques");
        toast.error("Les mots de passes ne sont pas identiques");
        setActiveStep(2);
        return;
      }
      const regexpassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regexpassword.test(dataform.adminpassword)) {
        setmsgerror(true);
        setmsgerrortext(
          "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère special."
        );
        toast.error(
          "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère special."
        );
        setActiveStep(2);
        return;
      }
    }
    setmsgerror(false);
    setmsgerrortext("");
  };
  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
  };

  const [dataform, setdataform] = useState({
    adminemail: "",
    numeroverificationmail: "",
    adminpassword: "",
    adminpasswordconfirm: "",
  });
  const handleBack = () => {
    if (activeStep === 0) {
    }
    if (activeStep === 3) {
      //supprimer bouton retour
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleconnection = () => {
    navigate("/admin/");
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
            {/*reinitialisation */}

            <div className="">
              {msgerror && <p id="loginError">{msgerrortext}</p>}
              <Box sx={{ width: "100%" }}>
                <Stepper
                  activeStep={activeStep}
                  style={{ marginBottom: "20px", marginTop: "20px" }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      Vous pouvez vous connecter,cliquez sur suivant
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button className="nextbtn" onClick={handleconnection}>
                        Suivant
                      </Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {activeStep === 0 && (
                      <div className="ServiceInscriptionTitle">
                        <p>Adresse email</p>
                        <input
                          type="email"
                          placeholder="Entrez votre email"
                          name="adminemail"
                          value={dataform.adminemail}
                          onChange={handlechange}
                        />
                      </div>
                    )}
                    {activeStep === 1 && (
                      <div className="ServiceInscriptionTitle">
                        <p>
                          Entrer votre numéro de vérification de votre email
                        </p>
                        <input
                          type="text"
                          name="numeroverificationmail"
                          value={dataform.numeroverificationmail}
                          onChange={handlechange}
                        />
                      </div>
                    )}
                    {activeStep === 2 && (
                      <div className="">
                        <div className="ServiceInscriptionTitle">
                          <p>Entrer votre nouveau mot de passe</p>
                          <input
                            type="password"
                            name="adminpassword"
                            value={dataform.adminpassword}
                            onChange={handlechange}
                          />
                        </div>
                        <div
                          className="ServiceInscriptionTitle"
                          style={{ marginTop: "20px" }}
                        >
                          <p>Confirmer votre mot de passe</p>
                          <input
                            type="password"
                            name="adminpasswordconfirm"
                            value={dataform.adminpasswordconfirm}
                            onChange={handlechange}
                          />
                        </div>
                      </div>
                    )}
                    {activeStep === 3 && (
                      <Typography>Réinitialisation terminée.</Typography>
                    )}

                    {/* Boutons de navigation */}
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      {activeStep !== 3 && activeStep > 0 && (
                        <Button
                          className="nextbtn"
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Retour
                        </Button>
                      )}
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleNext} className="acceptbtn">
                        {activeStep === steps.length - 1
                          ? "Confirmer"
                          : "Suivant"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitAdmin;
