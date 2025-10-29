import React, { useContext, useEffect, useState } from "react";
import "../styles/shopping.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import caddie from "../assets/logo/caddie.png";
import logo from "../assets/logo/logo.png";
import { ProductContext } from "../components/ProductContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { jsPDF } from "jspdf";
import liv from "../assets/logo/liv.png";
import sleep from "../assets/icone/sleep.gif";
const New = ({
  setusercommande,
  codereduction,
  pointsCumules,
  pointsUtilises,
  setAllOrders,
}) => {
  const navigate = useNavigate();
  const handleback = () => {
    navigate(-1);
  };
  const [position, setPosition] = useState(null);
  const { cart, removeFromCart, setCart, setcount } =
    useContext(ProductContext);
  const [error, seterror] = useState(false);
  const [msgerror, setmsgerror] = useState("");
  // État LOCAL pour la réduction en cours
  const [pointsAReduire, setPointsAReduire] = useState(0);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(coords);

          // Distance & frais
          const distance = await getRouteDistance(RESTO_LOCATION, coords);
          const fee = calculateDeliveryFee(distance);
          setDeliveryFee(fee);

          // Géocodage inverse (OpenStreetMap)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
          );
          const data = await res.json();
          const a = data.address || {};
          setFormValues((prev) => ({
            ...prev,
            numerovoie: a.house_number || "",
            nomrue: a.road || "",
            complementinfo: a.suburb || "",
            ville: a.city || a.town || a.village || "",
          }));
          if (
            a.city?.toLowerCase() !== "marseille" &&
            a.town?.toLowerCase() !== "marseille" &&
            a.village?.toLowerCase() !== "marseille"
          ) {
            alert("Désolé, la livraison n'est disponible que pour Marseille.");
            return;
          }
        },
        (err) => {
          alert(
            "Impossible d'accéder à votre position. Vous pouvez entrer votre adresse manuellement."
          );
          console.error("Erreur géolocalisation:", err);
        }
      );
    } else {
      alert("La géolocalisation n’est pas supportée par votre navigateur.");
    }
  };
  const GEOAPIFY_KEY = "4e9eabed4c1b4a44af8cba6c9d6603e8";

  // 🗺️ Géocodage d’adresse (texte → coordonnées)
  async function geocodeAddress(address) {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      address
    )}&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Erreur de requête Geoapify");
    const data = await res.json();

    if (!data.features || data.features.length === 0)
      throw new Error("Adresse introuvable");

    const { lat, lon } = data.features[0].properties;
    return { lat, lng: lon };
  }
  //  Fonction utilitaire pour calculer le prix total d’un produit personnalisé
  const calculateItemTotal = (item) => {
    // CORRECTION : Utiliser le prix original + extraPrice si disponible
    let total = (item.prix || 0) * (item.quantity || 1);

    // Si extraPrice est déjà calculé, l'utiliser directement
    if (item.extraPrice !== undefined) {
      total += item.extraPrice;
      console.log("ExtraPrice déjà calculé:", item.extraPrice);
    }
    // Sinon, calculer les suppléments
    else if (item.isCustom && item.customItems?.length > 0) {
      item.customItems.forEach((customItem) => {
        const baseQty = customItem.baseQuantity || 0;
        const currentQty = customItem.quantity || 0;

        if (currentQty > baseQty) {
          const supplement = currentQty - baseQty;
          total += supplement * customItem.prix;
        }
      });
    }

    console.log("TOTAL FINAL:", total);
    return total;
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const soustotal = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  const pointsDisponibles = pointsCumules - (pointsUtilises || 0);
  //gestion de la réduction
  const handlereduction = (e) => {
    const code = e.target.value.trim();
    if (code.length === 0) {
      seterror(false);
      setmsgerror("");
      settotal(soustotal);
      setPointsAReduire(0);
      return;
    }
    if (code === codereduction) {
      seterror(true);
      setmsgerror("Code de réduction correcte");

      // Calcul des points disponibles
      const pointsMaxAReduire = Math.min(pointsDisponibles, soustotal);

      setPointsAReduire(pointsMaxAReduire);
      settotal(Math.max(0, soustotal - pointsMaxAReduire));
    } else {
      seterror(true);
      setmsgerror("Code de réduction invalide");
      setPointsAReduire(0);
      settotal(soustotal);
    }
  };

  const [total, settotal] = useState(soustotal);
  const [drive, setdrive] = useState(false);
  //ouvrir la section livraison
  const handleDrive = () => {
    if (isClosed) {
      setOpen5(true);
    } else {
      setdrive(!drive);
    }
  };
  //boîte de dialogue
  const [open10, setOpen10] = useState(false);
  const [open21, setOpen21] = useState(false);
  const [open31, setOpen31] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const handleClickOpen = () => {
    if (isClosed()) {
      setOpen5(true);
    } else {
      setOpen10(true);
      setdrive(false);
    }
  };
  const handleEmporter = () => {
    if (isClosed()) {
      setOpen5(true);
    } else {
      setOpen21(true);
      setdrive(false);
    }
  };
  //sauvegarde de la commande pour les statistiques
  const updateStats = (orderData) => {
    const existingOrders =
      JSON.parse(localStorage.getItem("adminOrders")) || [];
    const updatedOrders = [...existingOrders, orderData];
    localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
  };
  const handleClicknext1 = () => {
    setOpen1(true);
    const orderData = {
      id: orderId,
      //items: cart,
      date: new Date().toISOString(),

      total: total,
      items: cart.map((item) => ({
        name: item.text,
        quantity: item.quantity,
        price: item.prix,
        type: "sur place",
        isCustom: item.isCustom,
        removedItems: item.removedItems,
        customItems: item.customItems,
      })),
    };
    setAllOrders((prev) => [...prev, orderData]);
    setusercommande((prev) => [...prev, orderData]);
    updateStats(orderData);
  };
  const handleClicknext2 = () => {
    setOpen2(true);
    const orderData = {
      id: orderId,
      //items: cart,
      date: new Date().toISOString(),

      total: total,
      items: cart.map((item) => ({
        name: item.text,
        quantity: item.quantity,
        price: item.prix,
        type: "emporter",
        isCustom: item.isCustom,
        customItems: item.customItems,
        removedItems: item.removedItems,
      })),
    };
    setAllOrders((prev) => [...prev, orderData]);
    setusercommande((prev) => [...prev, orderData]);
    updateStats(orderData);
  };
  const handleClicknext3 = () => {
    setOpen3(true);
    const orderData = {
      id: orderId,
      //items: cart,
      date: new Date().toISOString(),
      livraison: {
        adresse: `${formValues.numerovoie} ${formValues.nomrue}, ${formValues.ville}`,
        telephone: formValues.phone,
      },
      total: total + deliveryFee,
      items: cart.map((item) => ({
        name: item.text,
        quantity: item.quantity,
        price: item.prix,
        type: "livraison",
        isCustom: item.isCustom,
        removedItems: item.removedItems,
        customItems: item.customItems,
      })),
    };
    setAllOrders((prev) => [...prev, orderData]);
    setusercommande((prev) => [...prev, orderData]);
    updateStats(orderData);
  };

  const handleClose = () => {
    setOpen1(false);
    setOpen2(false);
    setOpen10(false);
    setOpen21(false);
    setOpen31(false);
    setOpen3(false);
    setOpen5(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
    setOpen10(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
    setOpen21(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
    setOpen31(false);
  };
  const [orderId] = useState("A" + Math.floor(Math.random() * 1000));
  //telecharger le reçu
  const handleDownloadReceipt = () => {
    const doc = new jsPDF();

    // Logo
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 20, 10, 25, 25);

    // Numéro de commande et date
    const today = new Date().toLocaleString();
    const reduction = pointsAReduire;
    const finalTotal = total + deliveryFee;

    doc.setFontSize(18);
    doc.text("Sim'sBurger", 20, 20);

    doc.setFontSize(14);
    doc.text("Reçu de commande", 20, 30);
    doc.text(`Numéro de commande : ${orderId}`, 20, 40);
    doc.text(`Date : ${today}`, 20, 50);

    // Liste des articles
    doc.setFontSize(12);
    doc.text("Articles :", 20, 70);

    let y = 80;
    const pageHeight = doc.internal.pageSize.height;

    cart.forEach((item) => {
      // Utiliser directement le prix calculé qui inclut déjà les personnalisations
      const itemTotal = calculateItemTotal(item);

      const line = `${item.text} x${item.quantity} = ${itemTotal.toFixed(2)} €`;

      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, 20, y);
      y += 10;

      // Afficher les ingrédients personnalisés (information seulement)

      if (item.isCustom && item.customItems) {
        item.customItems.forEach((customItem) => {
          const baseQty = customItem.baseQuantity || 0;
          const currentQty = customItem.quantity || 0;
          const supplementQty = currentQty - baseQty;
          if (supplementQty > 0) {
            if (y > pageHeight - 30) {
              doc.addPage();
              y = 20;
            }
            // Afficher seulement les suppléments facturés
            doc.text(
              `   + ${customItem.text}:1 × ${customItem.prix.toFixed(2)} €`,
              25,
              y
            );
            y += 7;
          }
        });
      }

      // Afficher les ingrédients retirés (information seulement, sans impact prix)
      if (item.isCustom && item.removedItems && item.removedItems.length > 0) {
        item.removedItems.forEach((removedItem) => {
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(`   - ${removedItem.text} (retiré)`, 25, y);
          y += 7;
        });
      }
    });

    // Totaux
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    }

    doc.text(`Sous-total : ${soustotal.toFixed(2)} €`, 20, y + 10);
    doc.text(`Réduction : -${reduction.toFixed(2)} €`, 20, y + 20);
    if (drive) {
      doc.text(`Frais de livraison : ${deliveryFee.toFixed(2)} €`, 20, y + 30);
    }
    doc.text(
      `Total payé : ${finalTotal.toFixed(2)} €`,
      20,
      y + (drive ? 40 : 30)
    );

    doc.text("Merci pour votre commande !", 20, y + (drive ? 60 : 50));

    // Téléchargement du fichier
    doc.save(`recu_de_commande_${orderId}.pdf`);

    // Fermeture et reset
    setOpen1(false);
    setCart([]);
    setcount(0);
  };
  const [formValues, setFormValues] = useState({
    name: "",
    numerovoie: "",
    nomrue: "",
    complementinfo: "",
    ville: "",
    email: "",
    phone: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  //delivery
  // Coordonnées du restaurant
  const RESTO_LOCATION = { lat: 43.247486, lng: 5.436621 }; // Luminy, à ajuster si besoin

  // Formule de Haversine (distance en km)
  async function getRouteDistance(from, to) {
    const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lng}|${to.lat},${to.lng}&mode=drive&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Erreur API Geoapify Routing");
    const data = await res.json();

    const distanceMeters = data?.features?.[0]?.properties?.distance;
    if (!distanceMeters) throw new Error("Aucune route trouvée");

    return distanceMeters / 1000; // km
  }

  async function handleManualAddress(fullAddress, setDeliveryFee, setPosition) {
    if (!fullAddress || fullAddress.trim().length < 5) {
      alert("Merci d’entrer une adresse complète.");
      return;
    }

    try {
      //Géocodage
      const coords = await geocodeAddress(fullAddress);
      setPosition(coords);

      //Distance routière
      const distanceKm = await getRouteDistance(RESTO_LOCATION, coords);

      //Frais
      const fee = calculateDeliveryFee(distanceKm);
      setDeliveryFee(fee);

      //Affichage

      if (formValues.ville !== "marseille") {
        alert("ville non prise en charge, merci de choisir Marseille");
        return;
      }
      alert(
        `📍 Adresse trouvée !\nDistance : ${distanceKm.toFixed(
          2
        )} km\nFrais de livraison : ${fee.toFixed(2)} €`
      );
    } catch (err) {
      console.error("Erreur lors du calcul :", err);
      alert("Adresse non trouvée,veuillez cliquer sur activer ma localisation");
    }
  }
  const calculateDeliveryFee = (distanceKm) => {
    if (distanceKm <= 2) return 0;
    if (distanceKm <= 5) return 2.5;
    if (distanceKm <= 10) return 5;
    return 8 + (distanceKm - 10) * 0.5;
  };
  const handleCheckAddress = () => {
    const fullAddress = `${formValues.numerovoie} ${formValues.nomrue}, ${formValues.ville}`;
    handleManualAddress(fullAddress, setDeliveryFee, setPosition);
  };
  //livraison
  const [texterrorlivraison, settexterrorlivraison] = useState("");
  const [textlivraison, settextlivraison] = useState(false);
  const handleLivraison = async () => {
    if (
      !formValues.name ||
      !formValues.numerovoie ||
      !formValues.nomrue ||
      !formValues.ville ||
      !formValues.phone
    ) {
      settexterrorlivraison("Veuillez remplir tous les champs");
      settextlivraison(true);
      return;
    }
    if (formValues.ville.trim().toLowerCase() !== "marseille") {
      settextlivraison(true);
      settexterrorlivraison(
        "livraison non prise en charge, merci d'ecrire Marseille"
      );
      return;
    }
    // Construction de l'adresse complète
    const fullAddress = `${formValues.numerovoie} ${formValues.nomrue}, ${formValues.ville}`;

    try {
      // On tente de géocoder l’adresse via Geoapify
      const coords = await geocodeAddress(fullAddress);

      if (coords && coords.lat && coords.lng) {
        // Adresse trouvée
        setPosition(coords);
        settextlivraison(true);
        settexterrorlivraison("Adresse correcte !");
        setPosition(coords);

        //Distance routière
        const distanceKm = await getRouteDistance(RESTO_LOCATION, coords);

        //Frais
        const fee = calculateDeliveryFee(distanceKm);
        setDeliveryFee(fee);

        setOpen31(true);
      } else {
        // Aucune coordonnée trouvée
        settextlivraison(true);
        settexterrorlivraison("Adresse non trouvée, veuillez la vérifier.");
      }
    } catch (error) {
      console.error("Erreur vérification adresse :", error);
      settextlivraison(true);
      settexterrorlivraison("Adresse incorrecte ou introuvable.");
    }
  };
  //heure de non prise des commande
  const isClosed = () => {
    const currentHour = new Date().getHours();
    return currentHour < 11 || currentHour >= 23;
  };
  //mis à jour de l'heure
  const [timer, setTimer] = useState(
    new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );
  useEffect(() => {
    const timing = setInterval(() => {
      setTimer(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timing);
  }, []);

  return (
    <div className={`shoppingnews ${drive ? "widthshop" : ""}`}>
      <div className="shoppingnew">
        <Button
          className="retourbtn"
          onClick={() => {
            handleback();
          }}
        >
          <p>Retour</p>
        </Button>
        {cart.length === 0 && (
          <div className="shoppingempty">
            <p>panier vide, retourner vers la carte</p>
            <img src={caddie} alt="" />
          </div>
        )}
        {cart.length !== 0 && (
          <div className="shoppingfull">
            <div className="shoppingcontent">
              <table>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#e31937",
                    }}
                  >
                    <th>Article</th>
                    <th>Nom</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, id) => (
                    <tr id="btnligne" key={id}>
                      <td>
                        {item.menu ? (
                          <div className="ImagePresentations">
                            <img
                              id="img1"
                              src={item.menu.snack.photo}
                              alt={item.menu.snack.text}
                            />
                            <img
                              id="img2"
                              src={item.menu.burger.photo}
                              alt={item.menu.burger.text}
                            />
                            <img
                              id="img3"
                              src={item.menu.boisson.photo}
                              alt={item.menu.boisson.text}
                            />
                          </div>
                        ) : (
                          <img src={item.photo} alt={item.text} />
                        )}
                      </td>
                      <td>
                        {item.text}
                        {item.isCustom && (
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            (personnalisé)
                          </span>
                        )}
                        {item.isCustom && (
                          <div
                            style={{ fontSize: "0.85rem", marginTop: "5px" }}
                          >
                            {/* Ajouts */}
                            {item.customItems &&
                              item.customItems?.length > 0 && (
                                <div style={{ color: "green" }}>
                                  <strong>Ajouts :</strong>
                                  {item.customItems.map((ci, idx) => (
                                    <div key={idx}>
                                      + {ci.text}{" "}
                                      {/*ci.quantity > 1 ? `x${ci.quantity}` : ""*/}
                                      (+{ci.prix.toFixed(2)} €)
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Retraits */}
                            {item.removedItems &&
                              item.removedItems.length > 0 && (
                                <div style={{ color: "red" }}>
                                  <strong>Retraits :</strong>
                                  {item.removedItems.map((ri, idx) => (
                                    <div key={idx}>- {ri.text}</div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          min={1}
                          style={{
                            width: "50px",
                            height: "50px",
                            textAlign: "center",
                            borderRadius: "10px",
                            border: "1px solid #e31937",
                            outline: "none",
                          }}
                        />
                      </td>
                      <td>{calculateItemTotal(item).toFixed(2)} €</td>
                      <td id="btnpaiement">
                        <Button
                          className="rejectbtn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="shoppingAdresse">
              <div className="AdresseUser">
                <div className="AdresseTitle">
                  <img src={logo} alt="" />
                  <p>Sim'sBurger</p>
                </div>
                {error && (
                  <h4
                    id="errorText"
                    style={{
                      color:
                        msgerror === "code de réduction correcte"
                          ? "green"
                          : "red",
                    }}
                  >
                    {msgerror}
                  </h4>
                )}
                <div className="AccountUsers">
                  <div className="AccountUser">
                    <p>Sous-total :</p>
                    <p>{soustotal.toFixed(2)} €</p>
                  </div>
                  <div className="AccountUser">
                    <p>Réduction :</p>
                    <input
                      type="text"
                      name=""
                      placeholder="code pour utiliser vos points"
                      onChange={handlereduction}
                    />
                  </div>
                </div>
                <div className="AccountUser">
                  <p>total :</p>
                  <p>{total.toFixed(2)} €</p>
                </div>
                <div className="AccountContainer">
                  <Button className="rejectbtn" onClick={handleClickOpen}>
                    sur place
                  </Button>
                  <Button className="nextbtn" onClick={handleEmporter}>
                    {" "}
                    Emporter
                  </Button>
                  <Button className="nextbtn" onClick={handleDrive}>
                    {" "}
                    Livraison
                  </Button>
                </div>
                {drive && (
                  <div className="">
                    <div className="localisation">
                      <p>
                        choisir votre localisation ou entrer votre adresse
                        manuellement
                      </p>
                      <button onClick={getLocation}>
                        Activer ma localisation
                      </button>
                      <div
                        className=""
                        style={{
                          margin: "20px 0px",
                        }}
                      >
                        {position && (
                          <iframe
                            title="map"
                            width="100%"
                            height="300px"
                            src={`https://www.google.com/maps?q=${position.lat},${position.lng}&hl=fr&z=14&output=embed`}
                          ></iframe>
                        )}
                      </div>
                    </div>
                    <div className="btnprepayment">
                      <Button className="nextbtn" onClick={handleLivraison}>
                        paiement
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {drive && (
                <div className=" UserDetails">
                  {textlivraison && (
                    <p id="erreuradresse">{texterrorlivraison} </p>
                  )}
                  <form action="" onSubmit={handleSubmit}>
                    <div className="AccountUserInformation">
                      <p>Nom :</p>
                      <input
                        type="text"
                        name="name"
                        id=""
                        value={formValues.name}
                        placeholder="Entrez votre nom"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="AccountRue">
                      <div className="AccountRueNumber">
                        <p>Numéro de voie :</p>
                        <input
                          type="number"
                          name="numerovoie"
                          id=""
                          value={formValues.numerovoie}
                          placeholder="Numéro de rue"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="AccountRueName">
                        <p>Nom de la rue :</p>
                        <input
                          type="text"
                          name="nomrue"
                          value={formValues.nomrue}
                          id=""
                          onChange={handleInputChange}
                          placeholder="Entrez votre Nom de rue"
                        />
                      </div>
                    </div>
                    <div className="AccountUserInformation">
                      <p>Complément d'information :</p>
                      <input
                        type="text"
                        name="complementinfo"
                        id=""
                        onChange={handleInputChange}
                        value={formValues.complementinfo}
                        placeholder="Entrez votre Complément d'information"
                      />
                    </div>
                    <div className="AccountUserInf">
                      <div className="AccountUserInfs">
                        <p>Ville :</p>
                        <input
                          type="text"
                          name="ville"
                          value={formValues.ville}
                          id=""
                          onChange={handleInputChange}
                          placeholder="Entrez votre ville"
                        />
                      </div>
                      <div className="AccountUserInfs">
                        <p>Téléphone :</p>
                        <input
                          type="tel"
                          name="phone"
                          value={formValues.phone}
                          id=""
                          onChange={handleInputChange}
                          placeholder="Entrez votre Numéro de téléphone"
                        />
                      </div>
                    </div>
                    <div className="btnprepayment">
                      <Button className="nextbtn" onClick={handleCheckAddress}>
                        {" "}
                        Vérifier mon adresse
                      </Button>
                    </div>
                    <div className="Delivery">
                      <div className="DeliveryPrice">
                        <p>Frais de livraison :</p>
                        <p>{deliveryFee.toFixed(2)} €</p>
                      </div>
                      <div className="DeliveryPrice">
                        <p>Total :</p>
                        <p>{(total + deliveryFee).toFixed(2)} €</p>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {open10 && (
        <Dialog open={open10} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <p> veuillez vous rendre au guichet pour payer</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={caddie} alt="" />
              <p>
                {" "}
                Numéro de commande :{" "}
                <span style={{ fontWeight: "bold" }}>{orderId}</span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose()} className="rejectbtn">
              Annuler la commande
            </Button>
            <Button autoFocus className="nextbtn" onClick={handleClicknext1}>
              Valider la commande
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open1 && (
        <Dialog open={open1} onClose={handleClose1} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <p> veuillez vous rendre au guichet pour payer</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={caddie} alt="" />
              <p>
                {" "}
                Numéro de commande :{" "}
                <span style={{ fontWeight: "bold" }}>{orderId}</span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose1()} className="rejectbtn">
              Fermer
            </Button>
            <Button
              autoFocus
              className="nextbtn"
              onClick={() => {
                handleDownloadReceipt();
                handleClose1();
                navigate("/carte");
              }}
            >
              Télécharger le reçu
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/*emporter*/}
      {open21 && (
        <Dialog open={open21} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <p>
                {" "}
                veuillez vous rendre au guichet pour payer votre commande
                emporter
              </p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={caddie} alt="" />
              <p>
                {" "}
                Numéro de commande :{" "}
                <span style={{ fontWeight: "bold" }}>{orderId}</span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose()} className="rejectbtn">
              Annuler la commande
            </Button>
            <Button autoFocus className="nextbtn" onClick={handleClicknext2}>
              Valider la commande
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open2 && (
        <Dialog open={open2} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              veuillez vous rendre au guichet pour payer votre commande emporter
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={caddie} alt="" />
              <p>
                {" "}
                Numéro de commande :{" "}
                <span style={{ fontWeight: "bold" }}>{orderId}</span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose2()} className="rejectbtn">
              Fermer
            </Button>
            <Button
              autoFocus
              className="nextbtn"
              onClick={() => {
                handleDownloadReceipt();
                handleClose2();
                navigate("/carte");
              }}
            >
              Télécharger le reçu
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/*livraison*/}
      {open31 && (
        <Dialog open={open31} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <p>
                Livraison et paiement à domicile.
                <span>
                  Toutes commandes validés et non payés à la livraison pourront
                  faire l'objet d'une poursuite judiciaire.
                </span>
              </p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={liv} alt="" />
              <p>
                {" "}
                Numéro de commande :{" "}
                <span style={{ fontWeight: "bold" }}>{orderId}</span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose()} className="rejectbtn">
              Annuler la commande
            </Button>
            <Button autoFocus className="nextbtn" onClick={handleClicknext3}>
              Valider la commande
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open3 && (
        <Dialog open={open3} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              Commande validée,nous arrivons le plus rapidement possible.
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={caddie} alt="" />
              <p>
                {" "}
                Numéro de commande :{" "}
                <span style={{ fontWeight: "bold" }}>{orderId}</span>{" "}
              </p>
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={() => handleClose3()} className="rejectbtn">
              Fermer
            </Button>
            <Button
              autoFocus
              className="nextbtn"
              onClick={() => {
                handleDownloadReceipt();
                handleClose3();
                navigate("/carte");
              }}
            >
              Télécharger le reçu
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open4 && (
        <Dialog open={open4} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              Veuillez vous connecter afin de finaliser votre commande
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={handleClose} className="rejectbtn">
              ANNULER
            </Button>
            <Button
              autoFocus
              className="nextbtn"
              onClick={() => {
                navigate("/connecter");
              }}
            >
              SE CONNECTER
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open5 && (
        <Dialog open={open5} onClose={handleClose} className="custom-dialog">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Ton burger,Ton kiff,Ton Sim'sburger</p>
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              desolé,sims'burger à sommeil ,il se reveillera demain à 11h
            </DialogContentText>
            <DialogContentText id="messageConfirm" color="#e31937">
              {timer}
            </DialogContentText>
            <DialogContentText id="messageConfirm">
              <img src={sleep} alt="" width={200} />
            </DialogContentText>
          </DialogContent>

          <DialogActions className="DialogActions">
            <Button onClick={handleClose} className="rejectbtn">
              ANNULER
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default New;
