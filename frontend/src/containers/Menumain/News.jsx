import ScrollPage from "../../components/ScrollPage";
import React, { useEffect, useState } from "react";
import { nouveau } from "../exportelt/Exportelt";
const News = () => {
  const [newsData, setNewsData] = useState([]);
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};
    const updated = nouveau.map((item) => ({
      ...item,
      disabled: !!savedStatus[item.id],
    }));
    setNewsData(updated);
  }, []);
  return (
    <div className="">
      <ScrollPage
        title="Nos Nouveautés"
        data={newsData}
        routePrefix="/carte/nouveau/"
      />
    </div>
  );
};

export default News;
