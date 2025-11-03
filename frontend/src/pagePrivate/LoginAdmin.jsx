// pages/LoginAdmin.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo/logo.png";
import { toast } from "react-toastify";
import "../styles/login.css";
import axios from "./Utils";
import { useAuth } from "./AuthContext";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, admin, isAuthenticated } = useAuth();

  const [dataform, setdataform] = useState({
    adminemail: "",
    adminpassword: "",
  });
  const [loading, setloading] = useState(false);
  const [msgerror, setmsgerror] = useState("");

  const handlechange = (e) => {
    setdataform({ ...dataform, [e.target.name]: e.target.value });
  };

  const handlebackhome = async () => {
    try {
      // Appel correct : POST + withCredentials
      await axios.post(
        "http://localhost:5000/admin/logout",
        {},
        { withCredentials: true }
      );
      await logout();
      toast.info("Déconnexion réussie !");
      navigate("/");
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      toast.error("Une erreur est survenue lors de la déconnexion");
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!dataform.adminemail || !dataform.adminpassword) {
      return toast.error("Veuillez remplir tous les champs");
    }
    setloading(true);
    try {
      await login(dataform.adminemail, dataform.adminpassword);
      toast.success("Connexion réussie !");
      const from = location.state?.from?.pathname || "/admin/dashboard/chiffre";
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion";
      setmsgerror(msg);
      toast.error(msg);
    } finally {
      setloading(false);
    }
  };

  if (isAuthenticated && admin) {
    return (
      <div className="shoppingfull">
        <div className="loginMain">
          <div className="LoginLogo">
            <img src={logo} alt="" />
            <p>
              <span>Sim'sburger</span>
            </p>
          </div>

          <div className="loginUser">
            <h1>Bienvenue {admin.adminname}</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                margin: "10px 0",
              }}
            >
              <p>🫡 Hello Manager {admin.adminemail}.</p>
              <p>Bienvenue sur votre espace de gestion.</p>
              <p>Rôle : {admin.role}</p>

              <Button className="nextbtn" onClick={handlebackhome}>
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shoppingService">
      <div className="Service">
        <div className="shoppingfull">
          <div className="loginMain">
            <div className="LoginLogo">
              <img src={logo} alt="Logo" />
              <p>
                <span>Sim'sburger</span>
              </p>
            </div>

            {msgerror && <p id="loginError">{msgerror}</p>}

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
                  <Button type="submit" className="nextbtn" disabled={loading}>
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="loginFooter">
              <p>
                Pas de compte ?{" "}
                <Link to="/admin/inscriptionadmin" style={{ color: "#e31937" }}>
                  Inscrivez-vous
                </Link>
              </p>
              <p>
                Mot de passe oublié ?{" "}
                <Link to="/admin/initialisationadmin" style={{ color: "blue" }}>
                  Réinitialiser
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
