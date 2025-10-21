import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Carte from "./pages/Carte";
import New from "./pages/New";
import Service from "./pages/Service";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./containers/topbar/Topbar";
import Cartemain from "./containers/Menumain/Cartemain";
import Main from "./containers/Menumain/Main";
import Hamburgers from "./containers/Menumain/Hamburgers";
import Wraps from "./containers/Menumain/Wraps";
import Snack from "./containers/Menumain/Snack";
import Salade from "./containers/Menumain/Salade";
import Boisson from "./containers/Menumain/Boisson";
import Dessert from "./containers/Menumain/Dessert";
import Sauce from "./containers/Menumain/Sauce";
import Bpc from "./containers/Menumain/Bpc";
import News from "./containers/Menumain/News";
import { MainList, MainListAdmin } from "./containers/exportelt/Exportelt";
import DescribeProduct from "./pages/DescribeProduct";
import { ProductProvider } from "./components/ProductContext";
import Notification from "./components/Notification";
import Init from "./components/Init";
import Connection from "./components/Connection";
import Parametre from "./pages/Parametre";
import "../src/components/i18n";
import LoginAdmin from "./pagePrivate/LoginAdmin";
import TopbarAdmin from "./pagePrivate/TopbarAdmin";
import Dashbord from "./pagePrivate/Dashbord";
import GestionMenu from "./pagePrivate/GestionMenu";
import GestionUser from "./pagePrivate/GestionUser";
import InitAdmin from "./pagePrivate/InitAdmin";
import InscriptionAdmin from "./pagePrivate/InscriptionAdmin";
import ParamAdmin from "./pagePrivate/ParamAdmin";
import Support from "./pagePrivate/Support";
import HomeAdmin from "./pagePrivate/HomeAdmin";
import Key from "./containers/menuAdmin/Key";
import Statistique from "./containers/menuAdmin/Statistique";
import Alert from "./containers/menuAdmin/Alert";
import Fournisseur from "./containers/menuAdmin/Fournisseur";
import Best from "./containers/menuAdmin/Best";
import Nofound from "./pages/Nofound";
import NofoundAdmin from "./pagePrivate/NofoundAdmin";
import Cgu from "./pages/Cgu";
import Cgv from "./pages/Cgv";
import Politique from "./pages/Politique";
import Liste from "./pagePrivate/Liste";

function App() {
  const [selectOpt, setselectOpt] = useState(MainList[0].id);
  const [selectOptAdmin, setselectOptAdmin] = useState(MainListAdmin[0].id);
  const [user, setUser] = useState(true);
  const [usercommande, setusercommande] = useState([]);
  const [codereduction, setcodereduction] = useState("");
  const [smsUser, setsmsUser] = useState([]);
  const [commandeuser, setCommandeUser] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  const choice = (p) => {
    setselectOpt(p);
  };
  const choiceAdmin = (p) => {
    setselectOptAdmin(p);
  };
  // dans App.jsx
  useEffect(() => {
    localStorage.setItem("usercommande", JSON.stringify(usercommande));
  }, [usercommande]);

  useEffect(() => {
    const saved = localStorage.getItem("usercommande");
    if (saved) setusercommande(JSON.parse(saved));
  }, []);
  //

  const [pointsCumules, setPointsCumules] = useState(
    JSON.parse(localStorage.getItem("pointsCumules")) || 0
  );
  const [pointsUtilises, setPointsUtilises] = useState(
    JSON.parse(localStorage.getItem("pointsUtilises")) || 0
  );

  // Charger les commandes depuis localStorage au démarrage
  useEffect(() => {
    const savedOrders = localStorage.getItem("allOrders");
    if (savedOrders) setAllOrders(JSON.parse(savedOrders));
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("allOrders", JSON.stringify(allOrders));
  }, [allOrders]);

  //page inscription-connexion
  const [login2, setlogin2] = useState(false);
  const [usernamens, setusernamens] = useState();

  const Adminlayout = () => {
    return (
      <>
        <TopbarAdmin />
        <Routes>
          <Route path="/" element={<LoginAdmin />} />
          <Route path="/home" element={<HomeAdmin />} />
          <Route
            path="/dashboard/*"
            element={
              <Dashbord
                selectOptAdmin={selectOptAdmin}
                setselectOptAdmin={setselectOptAdmin}
              />
            }
          >
            <Route path="chiffre" element={<Key />} />
            <Route path="statistique" element={<Statistique />} />
            <Route path="alert" element={<Alert />} />
            <Route path="fournisseur" element={<Fournisseur />} />
            <Route path="gestionuser" element={<GestionUser />} />
            <Route
              path="gestioncommande"
              element={<Liste data={allOrders} />}
            />
            <Route path="*" element={<NofoundAdmin />} />
          </Route>
          <Route path="/gestionmenu" element={<GestionMenu />} />
          <Route path="/initialisationadmin" element={<InitAdmin />} />
          <Route path="/inscriptionadmin" element={<InscriptionAdmin />} />
          <Route path="/paramadmin" element={<ParamAdmin />} />
          <Route path="*" element={<NofoundAdmin />} />
        </Routes>
      </>
    );
  };

  return (
    <>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            {/* espace user */}
            {user ? (
              <Route
                path="/*"
                element={
                  <>
                    <Topbar />
                    <Routes>
                      <Route path="/" element={<Home choice={choice} />} />
                      <Route
                        path="/nous rejoindre"
                        element={
                          <About smsUser={smsUser} setsmsUser={setsmsUser} />
                        }
                      />
                      <Route
                        path="/nouveauté"
                        element={
                          <New
                            setusercommande={setusercommande}
                            codereduction={codereduction}
                            pointsCumules={pointsCumules}
                            setPointsCumules={setPointsCumules}
                            pointsUtilises={pointsUtilises}
                            setPointsUtilises={setPointsUtilises}
                            setCommandeUser={setCommandeUser}
                            commandeuser={commandeuser}
                            setAllOrders={setAllOrders}
                          />
                        }
                      />
                      <Route
                        path="/carte/*"
                        element={
                          <Carte
                            selectOpt={selectOpt}
                            setselectOpt={setselectOpt}
                          />
                        }
                      >
                        <Route
                          path=""
                          element={<Cartemain setselectOpt={setselectOpt} />}
                        />
                        <Route path="nouveau" element={<News />} />
                        <Route path="menu" element={<Main />} />
                        <Route path="hamburger" element={<Hamburgers />} />
                        <Route path="wraps" element={<Wraps />} />
                        <Route path="salade" element={<Salade />} />
                        <Route path="snacks" element={<Snack />} />
                        <Route path="dessert" element={<Dessert />} />
                        <Route path="boisson" element={<Boisson />} />
                        <Route path="sauce" element={<Sauce />} />
                        <Route path="cheap" element={<Bpc />} />
                        <Route path="*" element={<Nofound />} />
                        <Route
                          path=":categorie/:text"
                          element={<DescribeProduct />}
                        />
                      </Route>
                      <Route path="/services" element={<Service />} />
                      <Route
                        path="/connecter"
                        element={
                          <Login
                            usercommande={usercommande}
                            setusercommande={setusercommande}
                            setcodereduction={setcodereduction}
                            pointsCumules={pointsCumules}
                            setPointsCumules={setPointsCumules}
                            pointsUtilises={pointsUtilises}
                            setPointsUtilises={setPointsUtilises}
                            login2={login2}
                            usernamens={usernamens}
                          />
                        }
                      />
                      <Route
                        path="/inscription"
                        element={
                          <Connection
                            setlogin2={setlogin2}
                            setusernamens={setusernamens}
                          />
                        }
                      />
                      <Route path="/initialisation" element={<Init />} />
                      <Route path="/parametre" element={<Parametre />} />

                      <Route path="*" element={<Nofound />} />
                    </Routes>
                  </>
                }
              />
            ) : (
              /*espaceAdmin*/
              <Route path="/admin/*" element={<Adminlayout />} />
            )}
            <Route path="/cgu" element={<Cgu />} />
            <Route path="/cgv" element={<Cgv />} />
            <Route path="/protection" element={<Politique />} />
          </Routes>
          <Notification />
        </BrowserRouter>
      </ProductProvider>
    </>
  );
}

export default App;
