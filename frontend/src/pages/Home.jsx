import React, { useEffect, useRef } from "react";
import chef from "../assets/logo/chef2.jpg";
import burger from "../assets/logo/logo.png";
import "../styles/home.css";
import veggie from "../assets/logo/veggie1.jpg";
import whopper from "../assets/burger/dwhopper.png";
import glace from "../assets//burger/mms.png";
import glace2 from "../assets//burger/lion.png";
import glace3 from "../assets/burger/kreamy.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { MainList } from "../containers/exportelt/Exportelt";

const Home = ({ choice }) => {
  const navigate = useNavigate();
  const handlenavigate = () => {
    navigate("/carte/nouveau");
    choice(MainList[1].id); //application du css sur l'id 1 de MainList.
  };
  const handlenavigates = () => {
    navigate("/carte/nouveau");
    choice(MainList[3].id);
  };
  const handlenavigat = () => {
    navigate("/carte/");
    choice(MainList[0].id);
  };
  const handlenavig = () => {
    navigate("/carte/nouveau");
    choice(MainList[1].id);
  };
  const handleselect = () => {
    navigate("/carte/hamburger/Veggie Chicken Louisiane");
    choice(MainList[3].id);
  };
  const handleselect2 = () => {
    navigate("/carte/hamburger/Double Whopper");
    choice(MainList[3].id);
  };

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    speed: 2000,
    arrows: false,
  };
  const images = [
    {
      id: 1,
      photo: glace,
      navigate: "/carte/dessert/king fusion m&ms",
      choice: MainList[7].id,
    },
    {
      id: 2,
      photo: glace2,
      navigate: "/carte/dessert/king fusion lion",
      choice: MainList[7].id,
    },
    {
      id: 3,
      photo: glace3,
      navigate: "/carte/dessert/king fusion kreamy",
      choice: MainList[7].id,
    },
  ];
  return (
    <div className="HomePlan">
      <div className="HomeLander">
        <img src={chef} alt="Chef" />
        <div className="HomeLanderText">
          <p>Ton burger.Ton kiff.Ton Sim'sburger</p>
          <div className="HomeLanderNews" onClick={handlenavigate}>
            <span>découvrir les nouveautés</span>
            <img src={burger} alt="Burger" />
          </div>
        </div>
      </div>
      <div className="HomePromotion">
        <p id="HomePromotionTitle">on casse les prix pour vous!</p>
        <div className="HomePromotionProduct">
          <div className="HomeProduct">
            <div className="HomeProductImg" onClick={handleselect}>
              <img
                src={veggie}
                alt="Veggie Burger"
                style={{ cursor: "pointer" }}
              />
            </div>
            <p>dégustez notre Veggie Burger</p>
          </div>
          <div className="HomeProduct">
            <div className="HomeProductImg">
              <Slider {...settings}>
                {images.map((p) => (
                  <div
                    className="HomeProductSliderItem"
                    key={p.id}
                    onClick={() => {
                      navigate(p.navigate);
                      choice(p.choice);
                    }}
                  >
                    <img src={p.photo} alt="" style={{ cursor: "pointer" }} />
                  </div>
                ))}
              </Slider>
            </div>
            <p>dégustez nos glaces </p>
          </div>
          <div className="HomeProduct">
            <div className="HomeProductImg">
              <img
                src={whopper}
                alt="Veggie Burger"
                style={{ cursor: "pointer" }}
                onClick={handleselect2}
              />
            </div>
            <p>dégustez notre Whopper</p>
          </div>
        </div>
      </div>
      <Footer
        handlenavigates={handlenavigates}
        handlenavigat={handlenavigat}
        handlenavig={handlenavig}
      />
    </div>
  );
};

export default Home;
