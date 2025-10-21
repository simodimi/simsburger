import { dessert } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";

const Dessert = () => {
  const [dessertData, setDessertData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = dessert.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setDessertData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos Desserts"
        data={dessertData}
        routePrefix="/carte/dessert/"
      />
    </div>
  );
};

export default Dessert;
