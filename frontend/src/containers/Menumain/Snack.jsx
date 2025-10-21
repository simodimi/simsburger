import React, { useEffect, useState } from "react";
import { snacks } from "../exportelt/Exportelt";
import ScrollPage from "../../components/ScrollPage";
const Snack = () => {
  const [snackData, setSnackData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = snacks.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setSnackData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos Snacks"
        data={snackData}
        routePrefix="/carte/snack/"
      />
    </div>
  );
};

export default Snack;
