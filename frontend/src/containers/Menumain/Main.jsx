import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
import "../../styles/carte.css";
import { menu } from "../exportelt/Exportelt";

const Main = () => {
  const [mainData, setMainData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = menu.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setMainData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos menus"
        data={mainData}
        routePrefix="/carte/menu/"
      />
    </div>
  );
};

export default Main;
