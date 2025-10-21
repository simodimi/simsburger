import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
import { wrap } from "../exportelt/Exportelt";

const Wraps = () => {
  const [wrapData, setWrapData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = wrap.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setWrapData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos Wraps"
        data={wrapData}
        routePrefix="/carte/wrap/"
      />
    </div>
  );
};

export default Wraps;
