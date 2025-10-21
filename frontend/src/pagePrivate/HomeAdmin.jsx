import React, { useEffect, useRef } from "react";
import chef from "../assets/logo/chef2.jpg";
import burger from "../assets/logo/logo.png";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
const HomeAdmin = () => {
  const navigate = useNavigate();
  const handlenavigate = () => {
    navigate("/admin/dashboard");
  };
  return (
    <div className="HomePlan">
      <div className="HomeLander">
        <img src={chef} alt="Chef" />
        <div className="HomeLanderText">
          <p>Ton burger.Ton kiff.Ton Sim'sburger</p>
          <div className="HomeLanderNews" onClick={handlenavigate}>
            <span>Bienvenue best Team Sim'sburger</span>
            <img src={burger} alt="Burger" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
