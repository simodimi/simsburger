import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import { toast } from "react-toastify";
import "../styles/login.css";
//import axios from "axios";
import axios from "./Utils";
import { useAuth } from "./AuthContext";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const { logout } = useAuth();
  const { login: loginAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  const [login, setlogin] = useState(location.state?.login || false);
  const [login1, setlogin1] = useState(location.state?.login1 ?? true);
  const [msgerror, setmsgerror] = useState(false);
  const [loading, setloading] = useState(false);
  const [adminData, setAdminData] = useState(location.state?.adminData || null); // Stocker les données du backend
  const [msgerrortext, setmsgerrortext] = useState("erreur de connexion");
  const [dataform, setdataform] = useState({
    adminemail: "",
    adminpassword: "",
  });

  useEffect(() => {
    // Si l'admin est déjà connecté, afficher la section "Bienvenue"
    if (isAuthenticated) {
      setlogin(true);
      setlogin1(false);
      const storedAdmin = localStorage.getItem("adminData");
      if (storedAdmin) {
        setAdminData(JSON.parse(storedAdmin));
      }
    } else {
      // Sinon, afficher le formulaire de connexion
      setlogin(false);
      setlogin1(true);
      setAdminData(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.state?.login === true) {
      setlogin(true);
      setlogin1(false);
      if (location.state?.adminData) {
        setAdminData(location.state.adminData);
      }
    }
  }, [location.state]);

  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    setmsgerror(false);
    setmsgerrortext(false);
    setloading(true);
    if (!dataform.adminemail || !dataform.adminpassword) {
      setmsgerror(true);
      setmsgerrortext("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      setloading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/login",
        dataform
      );

      if (response.status === 200) {
        toast.success("Connexion réussie!");
        loginAdmin(response.data, response.data.token);
        setAdminData(response.data);
        setlogin(true);
        setlogin1(false);
        setdataform({ adminemail: "", adminpassword: "" });
        // Redirection
        const from =
          location.state?.from?.pathname || "/admin/dashboard/chiffre";
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setmsgerrortext(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setmsgerrortext("Erreur de connexion");
        toast.error("Erreur de connexion");
      }
      setmsgerror(true);
    } finally {
      setloading(false);
    }
  };

  const handlebackhome = () => {
    logout();
    setlogin(false);
    setlogin1(true);
    setAdminData(null);
    toast.info("Deconnexion reussie");
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
                        disabled={loading}
                      />
                    </div>
                    <div className="ServiceInscriptionTitle">
                      <p>Mot de passe</p>
                      <input
                        type="password"
                        name="adminpassword"
                        value={dataform.adminpassword}
                        onChange={handlechange}
                        disabled={loading}
                      />
                    </div>
                    <div className="btnLogin">
                      <Button
                        type="submit"
                        className="nextbtn"
                        disabled={loading}
                      >
                        {loading ? "Connexion en cours..." : " Se connecter"}
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
            {login && adminData && (
              <div className="loginUser">
                <h1>Bienvenue {adminData.adminname}</h1>
                <div
                  className=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    margin: "10px 0",
                  }}
                >
                  <p>🫡 Hello Manager {adminData.adminemail}.</p>
                  <p>🫡 Bienvenue sur votre espace de gestion.</p>
                  <p>Rôle : {adminData.role}</p>

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
