import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "../../pagePrivate/Utils";
dayjs.extend(isoWeek);
import { io } from "socket.io-client";

const Statistique = () => {
  const [orders, setOrders] = useState([]);
  const [hourlyTopBurgers, setHourlyTopBurgers] = useState([]);
  const [weeklyTopBurgers, setWeeklyTopBurgers] = useState([]);
  const [monthlyTopBurgers, setMonthlyTopBurgers] = useState([]);
  const [socket, setSocket] = useState(null);

  // FONCTION POUR CONVERTIR EN NOMBRE
  const getRevenue = (item) => {
    const revenue =
      item.total_revenue || item.total || item.price * item.quantity;
    return typeof revenue === "string" ? parseFloat(revenue) : Number(revenue);
  };

  const computeStats = (data) => {
    const today = dayjs();
    const startOfWeek = today.startOf("week");
    const startOfMonth = today.startOf("month");

    // BURGER LE PLUS CONSOMMÉ PAR HEURE
    const hoursRange = Array.from({ length: 23 }, (_, i) => 0 + i);
    const hourly = hoursRange.map((h) => {
      const ordersInHour = data.filter(
        (o) => dayjs(o.date).isSame(today, "day") && dayjs(o.date).hour() === h
      );

      if (ordersInHour.length === 0)
        return { hour: `${h}h`, burger: "-", count: 0, revenue: 0 };

      // Compter par burger
      const burgerCount = {};

      ordersInHour.forEach((o) => {
        const name = o.names || "Inconnu";
        if (!burgerCount[name]) burgerCount[name] = { count: 0, revenue: 0 };
        burgerCount[name].count += o.quantity;
        burgerCount[name].revenue += getRevenue(o);
      });

      // Trouver le max
      const topBurger = Object.entries(burgerCount).sort(
        (a, b) => b[1].count - a[1].count
      )[0];

      return {
        hour: `${h}h`,
        burger: topBurger ? topBurger[0] : "-",
        count: topBurger ? topBurger[1].count : 0,
        revenue: parseFloat(topBurger ? topBurger[1].revenue.toFixed(2) : 0),
      };
    });
    setHourlyTopBurgers(hourly);

    // TOP 5 BURGERS DE LA SEMAINE
    const weeklyOrders = data.filter((o) => dayjs(o.date).isAfter(startOfWeek));
    const weeklyCount = {};
    weeklyOrders.forEach((o) => {
      const name = o.names || "Inconnu";
      if (!weeklyCount[name]) weeklyCount[name] = { count: 0, revenue: 0 };
      weeklyCount[name].count += o.quantity;
      weeklyCount[name].revenue += getRevenue(o);
    });
    const weeklyTop = Object.entries(weeklyCount)
      .map(([burger, val]) => ({ burger, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setWeeklyTopBurgers(weeklyTop);

    // TOP 5 BURGERS DU MOIS
    const monthlyOrders = data.filter((o) =>
      dayjs(o.date).isAfter(startOfMonth)
    );
    const monthlyCount = {};
    monthlyOrders.forEach((o) => {
      const name = o.names || "Inconnu";
      if (!monthlyCount[name]) monthlyCount[name] = { count: 0, revenue: 0 };
      monthlyCount[name].count += o.quantity;
      monthlyCount[name].revenue += getRevenue(o);
    });
    const monthlyTop = Object.entries(monthlyCount)
      .map(([burger, val]) => ({ burger, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setMonthlyTopBurgers(monthlyTop);
  };

  // CORRECTION : Mettre à jour les stats quand les commandes changent
  useEffect(() => {
    if (orders.length > 0) {
      computeStats(orders);
    }
  }, [orders]);

  //mis a jour à l'instant
  useEffect(() => {
    // Initialiser la connexion Socket.io
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    // Rejoindre la room des messages
    newSocket.emit("join_orders_room");

    // CORRECTION : Utiliser une fonction de mise à jour correcte
    newSocket.on("new_orderitems", (data) => {
      setOrders((prev) => {
        const newOrders = [data, ...prev];
        return newOrders;
      });
    });

    // Gestion des erreurs
    newSocket.on("connect_error", (error) => {
      console.error("❌ Erreur connexion Socket.io:", error);
    });

    return () => {
      newSocket.emit("leave_orders_room");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const update = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orderitem");
        setOrders(response.data);
      } catch (error) {
        console.error("une erreur est survenue", error);
      }
    };
    update();
  }, []);

  return (
    <div className="CartemainGeneral">
      <h5> Statistiques des ventes</h5>

      <div className="keypage">
        {/* Top burger par heure */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">
            Burger le plus consommé par heure (aujourd'hui)
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={hourlyTopBurgers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "revenue") return [`${value} €`, "Revenu (€)"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#FF8042" name="Quantité vendue">
                <LabelList dataKey="burger" position="top" />
              </Bar>
              <Bar dataKey="revenue" fill="#0088FE" name="Revenu (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 de la semaine */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">
            Top 5 Burgers - Cette semaine
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={weeklyTopBurgers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="burger" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "revenue") return [`${value} €`, "Revenu (€)"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" name="Quantité" />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenu (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 du mois */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">Top 5 Burgers - Ce mois</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={monthlyTopBurgers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="burger" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "revenue") return [`${value} €`, "Revenu (€)"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Quantité" />
              <Bar dataKey="revenue" fill="#FFBB28" name="Revenu (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistique;
