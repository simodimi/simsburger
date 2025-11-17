import React, { useEffect } from "react";
import { MainListAdmin } from "../containers/exportelt/Exportelt";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Dashbord = ({ selectOptAdmin, setselectOptAdmin }) => {
  const location = useLocation(); //fournir l'url actuelle
  const navigate = useNavigate();
  const handleselect = (id) => {
    setselectOptAdmin(id);
  };
  //stockage de l 'url
  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/dashboard") &&
      location.pathname !== "/admin/dashboard"
    ) {
      localStorage.setItem("geturls", location.pathname);
    }
  }, [location.pathname]);
  //rédirection vers la derniere url
  useEffect(() => {
    const last = localStorage.getItem("geturls");
    if (
      location.pathname === "/admin/dashboard" &&
      last &&
      last !== "/admin/dashboard"
    ) {
      navigate(last, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="CarteMain">
      <div className="CarteMainTitle">
        {MainListAdmin.map((p) => (
          <Link to={p.lien} key={p.id}>
            <div
              className={
                selectOptAdmin === p.id
                  ? "CarteMainTitleListactive"
                  : "CarteMainTitleList"
              }
              onClick={() => handleselect(p.id)}
            >
              <img src={p.photo} />
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

export default Dashbord;
