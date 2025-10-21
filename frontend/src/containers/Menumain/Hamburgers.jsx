import { hambs } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
const Hamburgers = () => {
  const [hamburgerData, setHamburgerData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = hambs.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setHamburgerData(updated);
  }, []);

  return (
    <div className="">
      <ScrollPage
        title="Nos burgers"
        data={hamburgerData}
        routePrefix="/carte/hamburger/"
      />
    </div>
  );
};

export default Hamburgers;
