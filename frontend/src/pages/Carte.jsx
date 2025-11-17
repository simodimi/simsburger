import React, { useEffect, useState } from "react";
import "../styles/carte.css";
import { MainList } from "../containers/exportelt/Exportelt";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Carte = ({ setselectOpt, selectOpt }) => {
  const location = useLocation(); //fournir l'url actuelle
  const navigate = useNavigate();

  const HandleOption = (p) => {
    setselectOpt(p);
  };
  //stockage de l'url
  useEffect(() => {
    if (
      location.pathname.startsWith("/carte") &&
      location.pathname !== "/carte"
      //on évite la page carte seule mais on prend les sous-routes
    ) {
      localStorage.setItem("geturl", location.pathname);
    }
  }, [location.pathname]);
  //rédirection vers la dernière url
  useEffect(() => {
    const last = localStorage.getItem("geturl");

    if (location.pathname === "/carte" && last && last !== "/carte") {
      navigate(last, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="CarteMain">
      <div className="CarteMainTitle">
        {MainList.map((p) => (
          <Link to={p.lien} key={p.id}>
            <div
              className={
                selectOpt === p.id
                  ? "CarteMainTitleListactive"
                  : "CarteMainTitleList"
              }
              onClick={() => HandleOption(p.id)}
            >
              <img src={p.photo} alt={p.descript} />
              <p>{p.text}</p>

              <div className="TopbarIcon">
                <img src={p.photo} alt={p.descript} />
                <p>{p.text}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="CarteMainContent">{<Outlet />}</div>
    </div>
  );
};

export default Carte;
