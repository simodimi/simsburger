import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import { toast } from "react-toastify";
import "../styles/login.css";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [login, setlogin] = useState(false);
  const [login1, setlogin1] = useState(true);
  const [msgerror, setmsgerror] = useState(false);
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");
  const [dataform, setdataform] = useState({
    adminemail: "",
    adminpassword: "",
  });
  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    setmsgerror(false);
    setmsgerrortext(false);
    if (!dataform.adminemail || !dataform.adminpassword) {
      setmsgerror(true);
      setmsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (dataform.adminemail && dataform.adminpassword) {
      setmsgerror(false);
      setmsgerrortext(false);
      setlogin(true);
      setlogin1(false);
      toast.success("Connexion reussie!");
      setdataform({ adminemail: "", adminpassword: "" });
      console.log("email:" + dataform.adminemail);
      console.log("password:" + dataform.adminpassword);
      setmail(dataform.adminemail);
      return;
    }
  };

  const handlebackhome = () => {
    setlogin(false);
    setlogin1(true);
  };
  const [mail, setmail] = useState("");
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

            {/*connection */}
            {login1 && (
              <div className="">
                {msgerror && <p id="loginError">{msgerrortext}</p>}
                <form onSubmit={handlesubmit}>
                  <div className="ServiceInscription">
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
                    <div className="btnLogin">
                      <Button type="submit" className="nextbtn">
                        Se connecter
                      </Button>
                    </div>
                  </div>
                </form>
                <div className=" loginFooter">
                  <p>
                    vous n'avez pas un compte ?{" "}
                    <Link
                      to="/admin/inscriptionadmin"
                      style={{ color: "#e31937" }}
                    >
                      Inscrivez-vous
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
              </div>
            )}
            {login && (
              <div className="loginUser">
                <h1>hello dimitri</h1>
                <div
                  className=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    margin: "10px 0",
                  }}
                >
                  <p>🫡 Hello Manager {mail}.</p>

                  <Button className="nextbtn" onClick={handlebackhome}>
                    {" "}
                    se deconnecter
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
