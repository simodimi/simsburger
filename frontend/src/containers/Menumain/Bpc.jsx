import { bpc } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";

const Bpc = () => {
  const [bpcData, setBpcData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = bpc.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setBpcData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos burgers pas chers"
        data={bpcData}
        routePrefix="/carte/bpc/"
      />
    </div>
  );
};

export default Bpc;
