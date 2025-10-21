import { sauce } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";

const Sauce = () => {
  const [sauceData, setSauceData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = sauce.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setSauceData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos sauces"
        data={sauceData}
        routePrefix="/carte/sauce/"
      />
    </div>
  );
};

export default Sauce;
