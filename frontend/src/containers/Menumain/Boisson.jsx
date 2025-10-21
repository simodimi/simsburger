import { boissons } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";

const Boisson = () => {
  const [boissonData, setBoissonData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = boissons.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setBoissonData(updated);
  }, []);

  return (
    <div className="">
      <ScrollPage
        title="Nos Boissons"
        data={boissonData}
        routePrefix="/carte/boisson/"
      />
    </div>
  );
};

export default Boisson;
