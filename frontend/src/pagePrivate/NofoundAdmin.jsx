import React from "react";
import logo from "../assets/logo/logo.png";
import error from "../assets/logo/404.jpg";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const NofoundAdmin = () => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
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
          </div>
          <div className="parametreheader">
            <div className="parametreinfo">
              <div
                className="parametreUser"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={error} alt="" width={1000} height={550} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NofoundAdmin;
