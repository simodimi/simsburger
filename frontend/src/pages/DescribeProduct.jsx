import React, { useContext, useEffect, useRef, useState } from "react";
import bas from "../assets/icone/bas.png";
import haut from "../assets/icone/haut.png";
import Button from "../components/Button";
import "../styles/describeproduct.css";
import burger from "../assets/logo/dcbXXLbg.png";
import boisson from "../assets/logo/cherrybg.png";
import { useNavigate, useParams } from "react-router-dom";
import cercle from "../assets/logo/cercle.png";
import cerclev from "../assets/logo/cerclev.png";
import vrai from "../assets/icone/vrai.png";
import {
  allergene,
  boissons,
  bpc,
  dessert,
  salade,
  sauce,
  snacks,
  wrap,
  hambs,
  menu,
  additems,
  composition,
  nouveau,
} from "../containers/exportelt/Exportelt";
import Personnalisation from "../containers/Menumain/Personnalisation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { ProductContext } from "../components/ProductContext";
const DescribeProduct = () => {
  const articleRef = useRef(null);
  useEffect(() => {
    articleRef.current?.scrollIntoView({ behavior: "auto" }); //scroll en haut de la page
  }, []);
  const navigate = useNavigate();
  const [hide, sethide] = useState({
    allergene: false,
    nutrition: false,
    personnalisation: true,
  });
  //gestion des produits désactivés
  const savedStatus = JSON.parse(localStorage.getItem("productStatus")) || {};

  const boissonsFiltered = boissons.map((p) => ({
    ...p,
    disabled: !!savedStatus[p.id],
  }));

  const snacksFiltered = snacks.map((p) => ({
    ...p,
    disabled: !!savedStatus[p.id],
  }));

  const burgersFiltered = [...bpc, ...hambs, ...menu, ...wrap].map((p) => ({
    ...p,
    disabled: !!savedStatus[p.id],
  }));
  //filtrer les  boissons par type
  // filtrer selon menu
  const filterBoissonByMenu = (menuType) => {
    const list =
      menuType === "menuxxl"
        ? boissonsFiltered.filter((p) => p.type === "grand")
        : boissonsFiltered.filter((p) => p.type === "petit");
    return list;
  };

  const filterSnackByMenu = (menuType) => {
    if (menuType === "menuxxl") {
      return snacksFiltered.filter((p) => p.type === "grand");
    }
    if (menuType === "menuxl") {
      return snacksFiltered.filter((p) => p.type === "moyen");
    }
    return snacksFiltered.filter((p) => p.type === "petit");
  };
  const defaultBoisson = boissonsFiltered.find((b) => !b.disabled) || {
    photo: boissons[1],
    text: "Aucune boisson disponible",
    disabled: true,
  };

  const defaultSnack = snacksFiltered.find((s) => !s.disabled) || {
    photo: snacks[0],
    text: "Aucun snack disponible",
    disabled: true,
  };
  //selection des menus
  const [selectionMenu, setselectionMenu] = useState("menuxxl");
  const [selectionBurger, setselectionBurger] = useState("burger");
  const [checkboisson, setCheckboisson] = useState(boissons[1]);
  const [selectionSnack, setselectionSnack] = useState(snacks[0]);
  const [boissonsSelection, setboissonsSelection] = useState(
    filterBoissonByMenu(selectionMenu)
  );
  const [snacksSelection, setSnacksSelection] = useState(
    filterSnackByMenu(selectionMenu)
  );
  const [UserChoice, setUserChoice] = useState({
    choix1: true,
    choix2: false,
    choix3: false,
  });

  useEffect(() => {
    if (selectionMenu === "menuxxl" && selectionBurger === "burger") {
      setUserChoice({
        ...UserChoice,
        choix1: true,
        choix2: false,
        choix3: false,
      });
    }
    if (selectionMenu === "menuxxl" && selectionBurger === "boisson") {
      setUserChoice({
        ...UserChoice,
        choix1: false,
        choix2: true,
        choix3: false,
      });
    }
    if (selectionMenu === "menuxxl" && selectionBurger === "accompagnement") {
      setUserChoice({
        ...UserChoice,
        choix1: false,
        choix2: false,
        choix3: true,
      });
    }
    if (selectionMenu !== "menuxxl" && selectionBurger === "burger") {
      setUserChoice({
        ...UserChoice,
        choix1: true,
        choix2: false,
        choix3: false,
      });
    }
    if (selectionMenu !== "menuxxl" && selectionBurger === "boisson") {
      setUserChoice({
        ...UserChoice,
        choix1: false,
        choix2: true,
        choix3: false,
      });
    }
    if (selectionMenu === "menuxl" && selectionBurger === "accompagnement") {
      setUserChoice({
        ...UserChoice,
        choix1: false,
        choix2: false,
        choix3: true,
      });
    }
    if (selectionMenu === "menul" && selectionBurger === "accompagnement") {
      setUserChoice({
        ...UserChoice,
        choix1: false,
        choix2: false,
        choix3: true,
      });
    }
  }, [selectionMenu, selectionBurger]);

  useEffect(() => {
    if (selectionMenu === "menuxxl") {
      setImage1(snacksSelection[0].photo);
      setImage3(boissonsSelection[0].photo);
    }
    if (selectionMenu === "menuxl") {
      setImage1(snacksSelection[0].photo);
      setImage3(boissonsSelection[0].photo);
    }
    if (selectionMenu === "menul") {
      setImage1(snacksSelection[0].photo);
      setImage3(boissonsSelection[0].photo);
    }
  }, [selectionMenu]);

  const selectionMenux = (p) => {
    setselectionMenu(p);
    setboissonsSelection(filterBoissonByMenu(p));
    setCheckboisson(filterBoissonByMenu(p)[0] || defaultBoisson);
    setSnacksSelection(filterSnackByMenu(p));
    setselectionSnack(filterSnackByMenu(p)[0] || defaultSnack);
  };
  const selectionBurgerx = (p) => {
    setselectionBurger(p);
  };
  const handlechoiceboisson = (p) => {
    if (p.disabled) return; // Empêcher la sélection si l'élément est désactivé
    setCheckboisson(p);
    setImage3(p.photo);
  };
  const handlechoiceSnack = (p) => {
    if (p.disabled) return; // Empêcher la sélection si l'élément est désactivé
    setselectionSnack(p);
    setImage1(p.photo);
  };

  //image d'archive
  const [image1, setImage1] = useState(snacks[0]);
  const [image2, setImage2] = useState(burger);
  const [image3, setImage3] = useState(boisson);
  //navigation url
  const { categorie, text } = useParams(); // useparams pour recuperer l'url
  const allItems = {
    boisson: boissons, // categorie(pour url): nom de l'objet
    snack: snacks,
    sauce: sauce,
    dessert: dessert,
    salade: salade,
    wrap: wrap,
    bpc: bpc,
    hamburger: hambs,
    menu: menu,
    nouveau: nouveau,
  };

  const currentItems = allItems[categorie] || []; //categorie(pour url): nom de l'objet
  const product = currentItems.find((p) => p.text === text);
  const isboisson = categorie === "boisson"; //verifier si la page actuelle est boisson
  const isnack = categorie === "snack";
  const issauce = categorie === "sauce";
  const isdessert = categorie === "dessert";
  const issalade = categorie === "salade";
  const iswrap = categorie === "wrap";
  const isbpc = categorie === "bpc";
  const ishamburger = categorie === "hamburger";
  const ismenu = categorie === "menu";
  const isnouveau = categorie === "nouveau";
  //personnalisation
  const productComposition = composition[product.text] || {};

  const handleback = () => {
    const selectedElement = localStorage.getItem("selectedElement");
    navigate(-1, { state: { selectedElement: selectedElement } });
  };
  //boîte de dialogue
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //ajouter les choix au panier
  const { addToCart } = useContext(ProductContext);
  /*const addOptions = (p) => {
    addToCart(p);
  };*/
  const [items, setitems] = useState(
    additems.map((item) => ({ ...item, quantity: 0, minus: true, plux: false }))
  );

  const addOptions = (p) => {
    if (p.disabled) {
      return; // Empêcher l'ajout si le produit est désactivé
    }
    // ingrédients de base du burger (composition)
    const baseIngredients = Object.values(productComposition)
      .filter((val) => typeof val === "string")
      .map((val) => val.trim());

    // Ingrédients ajoutés (hors base)
    const customItems = items.filter(
      (item) =>
        item.wasModified && // S’assurer que l’utilisateur a modifié cet item
        !item.hidden &&
        item.quantity > (item.baseQuantity || 0)
    );

    const extraPrice = customItems.reduce((sum, item) => {
      const supplementQty = item.quantity - (item.baseQuantity || 0);
      return sum + item.prix * supplementQty;
    }, 0);

    //  Retraits : uniquement si un ingrédient de base (qui devait être à 1)
    // est passé à 0 → preuve que l’utilisateur l’a retiré.
    const removedItems = items.filter(
      (item) =>
        item.wasModified && // S’assurer que l’utilisateur a modifié cet item
        item.quantity === 0 &&
        !item.hidden &&
        baseIngredients.includes(item.text.trim())
    );

    // Burger est personnalisé seulement si ajouts OU retraits
    const isCustom = customItems.length > 0 || removedItems.length > 0;

    let finalPrice = (parseFloat(p.prix) || 0) + extraPrice;
    let menuData = null;

    // Gestion spéciale si c’est un menu
    if (ismenu) {
      finalPrice =
        (parseFloat(p.prix) || 0) +
        (selectionSnack?.prix || 0) +
        (checkboisson?.prix || 0) +
        extraPrice;

      menuData = {
        burger: { text: p.text, photo: p.photo, prix: p.prix },
        boisson: {
          text: checkboisson.text,
          photo: checkboisson.photo,
          prix: checkboisson.prix,
        },
        snack: {
          text: selectionSnack.text,
          photo: selectionSnack.photo,
          prix: selectionSnack.prix,
        },
      };
    }

    addToCart({
      ...p,
      isCustom,
      extraPrice,
      customItems: customItems.map((item) => ({
        text: item.text,
        prix: item.prix,
        quantity: item.quantity,
      })),
      removedItems: removedItems.map((item) => ({
        text: item.text,
      })),
      menu: menuData,
      //prix: finalPrice,
    });
    setOpen(true);
  };

  return (
    <div className="Article" ref={articleRef}>
      <Button
        className="retourbtn"
        onClick={() => {
          handleback();
        }}
      >
        <p>Retour</p>
      </Button>
      <div className="DescribeArticle">
        <div className="DescribeProduct">
          <div className="DescribeProductName">
            <h1>{product.text}</h1>
          </div>
          <div className="ProductDescription">
            <p>{product.description}</p>
          </div>
          {!isboisson && isnack && (
            <div className="ProductAllergens">
              <div className="AllergensTitle">
                <p>Allergènes</p>
                <div
                  className=""
                  onClick={() =>
                    sethide({ ...hide, allergene: !hide.allergene })
                  }
                >
                  {hide.allergene ? (
                    <img src={bas} alt="" />
                  ) : (
                    <img src={haut} alt="" />
                  )}
                </div>
              </div>
              <div
                className={`AllergensVariety ${hide.allergene ? "hide" : ""}`}
              >
                {product.allergenes.map((p) => {
                  const allerg = allergene[p];
                  return (
                    <div className="VarietyImage">
                      <p>{allerg.text}</p>
                      <img src={allerg.photo} alt="" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="ProductCalories">
            <div className="AllergensTitle">
              <p>Valeurs nutritionnelles</p>
              <div
                className=""
                onClick={() => sethide({ ...hide, nutrition: !hide.nutrition })}
              >
                {hide.nutrition ? (
                  <img src={bas} alt="" />
                ) : (
                  <img src={haut} alt="" />
                )}
              </div>
            </div>
            <div
              className={`AllergensVariety ${
                hide.nutrition ? "hide" : "nothide"
              }`}
            >
              <div className="VarietyImage">
                <span>{product.calories} kcal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ProductImage">
          <div className="ProductImageSlider">
            {!isboisson &&
            !isnack &&
            !issauce &&
            !isdessert &&
            !issalade &&
            !isbpc &&
            !ishamburger &&
            !isnouveau &&
            !iswrap ? (
              <div className="ImagePresentation">
                <img src={image1} alt="" id="img1" />
                <img src={product.photo} alt="" id="img2" />
                <img src={image3} alt="" id="img3" />
              </div>
            ) : (
              <div className="ImagePresentation">
                <img src={product.photo} alt={product.text} />
                {product?.disabled && (
                  <span className="indisponible">❌ Indisponible</span>
                )}
              </div>
            )}
          </div>
          <div className="ValidationProduct">
            <Button
              className={`nextbtn ${product?.disabled ? "disabled" : ""}`}
              disabled={product?.disabled}
              onClick={() => !product?.disabled && addOptions(product)}
            >
              {product?.disabled ? "Indisponible" : "valider votre choix"}
            </Button>
          </div>
        </div>
      </div>
      <div className="CompositionMenu">
        {!isboisson &&
          !isnack &&
          !issauce &&
          !isdessert &&
          !issalade &&
          !isbpc &&
          !ishamburger &&
          !isnouveau &&
          !iswrap && (
            <div className="CompositionMenuHeader">
              <div className="CompositionMenuBurgers">
                <p
                  onClick={() => selectionMenux("menul")}
                  className={
                    selectionMenu === "menul"
                      ? "menuactivechoice"
                      : "CompositionMenuBurgersx"
                  }
                >
                  Menu L
                </p>
                <p
                  onClick={() => selectionMenux("menuxl")}
                  className={
                    selectionMenu === "menuxl"
                      ? "menuactivechoice"
                      : "CompositionMenuBurgersx"
                  }
                >
                  Menu XL
                </p>
                <p
                  onClick={() => selectionMenux("menuxxl")}
                  className={
                    selectionMenu === "menuxxl"
                      ? "menuactivechoice"
                      : "CompositionMenuBurgersx"
                  }
                >
                  Menu XXL
                </p>
              </div>
              <div className="CompositionMenuBurger">
                <p
                  onClick={() => selectionBurgerx("burger")}
                  className={
                    selectionBurger === "burger"
                      ? "menuactivechoice"
                      : "CompositionMenuBurgersx"
                  }
                >
                  burgers
                </p>
                <p
                  onClick={() => selectionBurgerx("accompagnement")}
                  className={
                    selectionBurger === "accompagnement"
                      ? "menuactivechoice"
                      : "CompositionMenuBurgersx"
                  }
                >
                  les accompagnements
                </p>
                <p
                  onClick={() => selectionBurgerx("boisson")}
                  className={
                    selectionBurger === "boisson"
                      ? "menuactivechoice"
                      : "CompositionMenuBurgersx"
                  }
                >
                  les boissons
                </p>
              </div>
              <div className="CompositionImageburger">
                {UserChoice.choix1 && (
                  <div className="" style={{ paddingTop: "10px" }}>
                    <div className="" style={{ position: "relative" }}>
                      <span>{product.text}</span>
                      <img src={product.photo} alt="" />
                    </div>
                    <div className="CircleSelected">
                      <img src={cerclev} alt="" />
                    </div>
                  </div>
                )}
                {UserChoice.choix2 && (
                  <div className="Boissons">
                    {boissonsSelection.map((p) => (
                      <div className="BoissonsSelecting" key={p.id}>
                        <div
                          className="BoissonsSelected"
                          style={{ position: "relative" }}
                        >
                          <span>{p.text}</span>
                          <img
                            src={p.photo}
                            alt={p.alt}
                            onClick={() => handlechoiceboisson(p)}
                            style={{
                              opacity: p.disabled ? 0.5 : 1,
                              pointerEvents: p.disabled ? "none" : "auto",
                            }}
                          />
                          {p.disabled && (
                            <span className="indisponible">❌</span>
                          )}
                        </div>
                        <div className="CircleSelected">
                          {checkboisson?.id === p.id ? (
                            <img src={cerclev} alt="" />
                          ) : (
                            <img src={cercle} alt="" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {UserChoice.choix3 && (
                  <div className="Boissons">
                    {snacksSelection.map((p) => (
                      <div className="BoissonsSelecting" key={p.id}>
                        <div
                          className="BoissonsSelected"
                          style={{ position: "relative" }}
                        >
                          <span>{p.text}</span>
                          <img
                            src={p.photo}
                            alt={p.alt}
                            onClick={() => handlechoiceSnack(p)}
                            style={{
                              opacity: p.disabled ? 0.5 : 1,
                              pointerEvents: p.disabled ? "none" : "auto",
                            }}
                          />
                          {p.disabled && (
                            <span className="indisponible">❌</span>
                          )}
                        </div>
                        <div className="CircleSelected">
                          {selectionSnack?.id === p.id ? (
                            <img src={cerclev} alt="" />
                          ) : (
                            <img src={cercle} alt="" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        {(iswrap || isbpc || ishamburger || ismenu || isnouveau) &&
          !product.text.toLowerCase().includes("king fusion dubai") && (
            <div className="Personnalisation">
              <div className="PersonnalisationTitle">
                <p>Personnalisez vos burgers</p>
                <div
                  className=""
                  onClick={() =>
                    sethide({
                      ...hide,
                      personnalisation: !hide.personnalisation,
                    })
                  }
                >
                  {hide.personnalisation ? (
                    <img src={bas} alt="" />
                  ) : (
                    <img src={haut} alt="" />
                  )}
                </div>
              </div>
              <div
                className={`AllergensVarietyx ${
                  hide.personnalisation ? "hide" : ""
                }`}
              >
                <Personnalisation
                  composition={productComposition}
                  productText={product.text}
                  additems={additems}
                  items={items}
                  setitems={setitems}
                />
              </div>
            </div>
          )}
      </div>
      {!isboisson &&
        !isnack &&
        !issauce &&
        !isdessert &&
        composition[product.text] && (
          <div className="Ingredient">
            <div className="IngredientPart">
              <p>ingredients</p>
              <div className="Partition">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => {
                  const texte = composition[product.text][`texte${p}`]; // texte de l'ingredient
                  const image = composition[product.text][`image${p}`];
                  if (!texte || !image) return null;
                  return (
                    <div className="composition" key={p}>
                      <p>{texte}</p>
                      <img src={image} alt="" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {open && (
        <Dialog open={open} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText component="div" id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText component="div" id="messageConfirm">
              <img src={vrai} alt="" />
              <p> votre article a été ajouté au panier</p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => navigate(-1)} className="acceptbtn">
              Continuer les achats
            </Button>
            <Button
              onClick={() => navigate("/nouveauté")}
              autoFocus
              className="nextbtn"
            >
              Aller au paiement
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default DescribeProduct;
