import React, { useEffect, useState } from "react";
import { salade } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";

const Salade = () => {
  const [saladeData, setSaladeData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = salade.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setSaladeData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos Salades"
        data={saladeData}
        routePrefix="/carte/salade/"
      />
    </div>
  );
};

export default Salade;
