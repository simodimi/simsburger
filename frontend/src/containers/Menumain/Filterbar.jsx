import React from "react";
import fish from "../../assets/burger/fish.png";
import boeuf from "../../assets/burger/boeuf.png";
import poulet from "../../assets/burger/poulet.png";
import vegetalien from "../../assets/burger/vegetal.png";
import bacon from "../../assets/burger/bacon.png";
import all from "../../assets/burger/all.png";
const filterOptions = [
  { id: 1, photo: all, text: "tout" },
  { id: 2, photo: boeuf, text: "boeuf" },
  { id: 3, photo: poulet, text: "poulet" },
  { id: 4, photo: fish, text: "poisson" },
  { id: 5, photo: vegetalien, text: "veggie" },
  { id: 6, photo: bacon, text: "sans bacon" },
];
const Filterbar = ({ data, setfilterdata }) => {
  const handlefilter = (filter) => {
    if (filter.text === "tout") {
      setfilterdata(data);
    } else if (filter.text === "sans bacon") {
      const filterData = data.filter((item) => item.bacon === "non");
      setfilterdata(filterData);
    } else {
      const filterData = data.filter((item) => item.type === filter.text);
      setfilterdata(filterData);
    }
  };
  return (
    <div className="FilterElt">
      {filterOptions.map((option) => {
        const isAlwaysVisible = option.text === "tout";
        const isType = data.some((item) => item.type === option.text);
        const isBacon =
          option.text === "sans bacon" &&
          data.some((item) => item.bacon === "non");
        if (isAlwaysVisible || isType || isBacon) {
          return (
            <div
              className="FilterEltAll"
              key={option.id}
              onClick={() => handlefilter(option)}
            >
              <img src={option.photo} alt={option.text} />
              <p>{option.text}</p>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Filterbar;
