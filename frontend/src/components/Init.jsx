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
import axios from "../pagePrivate/Utils";
import { toast } from "react-toastify";

const Init = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");
  //gestion renitialisation
  const steps = ["Adresse email", "consulter vos mails", "Mot de passe"];
  const [activeStep, setActiveStep] = React.useState(0);

  const [dataform, setdataform] = useState({
    mailuser: "",
    numeroverificationmail: "",
    passworduser: "",
    passwordconfirmuser: "",
  });
  const handleNext = async () => {
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //premier bouton suivant
    if (activeStep === 0) {
      if (!dataform.mailuser) {
        setmsgerror(true);
        setmsgerrortext("Veuillez remplir le champ email");
        toast.error("Veuillez remplir tous les champs");
        setActiveStep(0);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dataform.mailuser)) {
        setmsgerror(true);
        setmsgerrortext("adresse email non valide");
        toast.error("adresse email non valide");
        setActiveStep(0);
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/user/forgotpassword",
          { mailuser: dataform.mailuser }
        );
        if (response.status === 200) {
          setmsgerror(true);
          setmsgerrortext("");
          toast.success(response.data.message);
          setActiveStep((prev) => prev + 1);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          setmsgerrortext(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          console.error(
            "une erreur est survenue lors de la vérification de l'email",
            error
          );
        }
        setmsgerror(true);
      }
    }
    if (activeStep === 1) {
      if (!dataform.numeroverificationmail) {
        setmsgerror(true);
        setmsgerrortext(
          "Veuillez remplir votre numero de verification reçu par mail"
        );
        toast.error("Veuillez remplir le numero de verification");
        setActiveStep(1);
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/user/verifycode",
          {
            mailuser: dataform.mailuser,
            code: dataform.numeroverificationmail,
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          setActiveStep(2);
          setmsgerror(false);
          setmsgerrortext("");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Code invalide ou expiré");
        setmsgerror(true);
        setmsgerrortext(
          error.response?.data?.message || "Code invalide ou expiré"
        );
        setActiveStep(1);
      }
    }

    if (activeStep === 2) {
      if (!dataform.passworduser || !dataform.passwordconfirmuser) {
        setmsgerror(true);
        setmsgerrortext("Veuillez remplir tous les champs");
        toast.error("Veuillez remplir tous les champs");
        setActiveStep(2);
        return;
      }
      if (dataform.passworduser !== dataform.passwordconfirmuser) {
        setmsgerror(true);
        setmsgerrortext("Les mots de passes ne sont pas identiques");
        toast.error("Les mots de passes ne sont pas identiques");
        setActiveStep(2);
        return;
      }
      const regexpassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

      if (!regexpassword.test(dataform.passworduser)) {
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
      try {
        // Appel à ton backend pour mettre à jour le mot de passe
        const response = await axios.post(
          "http://localhost:5000/user/resetpassword",
          {
            mailuser: dataform.mailuser,
            passworduser: dataform.passworduser,
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          setActiveStep((prev) => prev + 1); // passe à l’étape suivante
          setmsgerror(false);
          setmsgerrortext("");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la mise à jour du mot de passe"
        );
        setmsgerror(true);
        setmsgerrortext(
          error.response?.data?.message ||
            "Erreur lors de la mise à jour du mot de passe"
        );
        setActiveStep(2);
      }
    }
  };
  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    if (activeStep === 0) {
    }
    if (activeStep === 3) {
      //supprimer bouton retour
    }
    setmsgerror(false);
    setmsgerrortext("");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleconnection = () => {
    navigate("/connecter");
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
                          name="mailuser"
                          value={dataform.mailuser}
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
                            name="passworduser"
                            value={dataform.passworduser}
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
                            name="passwordconfirmuser"
                            value={dataform.passwordconfirmuser}
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

export default Init;
