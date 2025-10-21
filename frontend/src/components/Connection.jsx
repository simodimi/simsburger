import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import "../styles/login.css";
import juste from "../assets/administrateur/true.png";
import faux from "../assets/administrateur/cancel.png";
import { toast } from "react-toastify";

const Connection = ({ setlogin2, setusernamens }) => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");

  const handleopenPage = () => {
    navigate("/connecter");
    if (setlogin2) {
      setlogin2(true);
    }
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
    nameuser: "",
    mailuser: "",
    passworduser: "",
    passwordconfirmuser: "",
  });
  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
    if (e.target.name === "passworduser") {
      passwordverification(e.target.value);
    }
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (
      !dataform.mailuser ||
      !dataform.nameuser ||
      !dataform.passworduser ||
      !dataform.passwordconfirmuser
    ) {
      setmsgerror(true);
      setmsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
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
    if (dataform.passwordconfirmuser !== dataform.passworduser) {
      setmsgerror(true);
      setmsgerrortext("Les mots de passes ne sont pas identiques");
      return;
    }
    if (
      dataform.mailuser &&
      dataform.nameuser &&
      dataform.passworduser === dataform.passwordconfirmuser
    ) {
      setmsgerror(false);
      setmsgerrortext(false);
      toast.success(`Vous êtes inscrit ${dataform.nameuser}`);
      handleopenPage();
      if (setusernamens) {
        setusernamens(dataform.nameuser);
      }
      return;
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
                      name="nameuser"
                      value={dataform.nameuser}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="ServiceInscriptionTitle">
                    <p>Adresse email</p>
                    <input
                      type="email"
                      name="mailuser"
                      value={dataform.mailuser}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="ServiceInscriptionTitle">
                    <p>Mot de passe</p>
                    <input
                      type="password"
                      name="passworduser"
                      value={dataform.passworduser}
                      onChange={handlechange}
                    />
                  </div>
                  <div className="ServiceInscriptionTitle">
                    <p>Confirmer le mot de passe</p>
                    <input
                      type="password"
                      name="passwordconfirmuser"
                      value={dataform.passwordconfirmuser}
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
                      S'inscrire
                    </Button>
                  </div>
                </div>
              </form>
              <div className=" loginFooter">
                <p>
                  vous avez déjà un compte ?{" "}
                  <Link to="/connecter" style={{ color: "#e31937" }}>
                    Se connecter
                  </Link>
                </p>
                <p>
                  mot de passe oublie?{" "}
                  <Link to="/initialisation" style={{ color: "blue" }}>
                    Reinitialiser mot de passe
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connection;
