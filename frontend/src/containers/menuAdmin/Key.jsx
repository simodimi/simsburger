import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import axios from "../../pagePrivate/Utils";
import "../../styles/adminkey.css";

const Key = () => {
  const [orders, setOrders] = useState([]);
  const [hourlyStats, setHourlyStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  useEffect(() => {
    const update = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orderitem");
        setOrders(response.data);
        computeStats(response.data);
      } catch (error) {
        console.error("une erreur est survenue", error);
      }
    };
    update();
  }, []);

  const computeStats = (data) => {
    const today = dayjs();
    const startOfWeek = today.startOf("week");
    const startOfMonth = today.startOf("month");

    // FONCTION POUR CONVERTIR EN NOMBRE
    const getRevenue = (item) => {
      const revenue =
        item.total_revenue || item.total || item.price * item.quantity;
      // Convertir en nombre
      return typeof revenue === "string"
        ? parseFloat(revenue)
        : Number(revenue);
    };

    // Stats par heure (11h-23h)
    const hoursRange = Array.from({ length: 13 }, (_, i) => 11 + i);
    const hourly = hoursRange.map((h) => {
      const ordersInHour = data.filter(
        (o) => dayjs(o.date).isSame(today, "day") && dayjs(o.date).hour() === h
      );

      const revenue = ordersInHour.reduce((sum, o) => sum + getRevenue(o), 0);

      return {
        hour: `${h}h`,
        revenue: parseFloat(revenue.toFixed(2)), // 🔥 FORMATER À 2 DÉCIMALES
        orders: ordersInHour.length,
      };
    });

    // Stats par jour de la semaine (Lun-Dim)
    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const weekly = daysOfWeek.map((d, idx) => {
      const ordersInDay = data.filter(
        (o) =>
          dayjs(o.date).isoWeek() === today.isoWeek() &&
          dayjs(o.date).day() === idx + 1
      );

      const revenue = ordersInDay.reduce((sum, o) => sum + getRevenue(o), 0);

      return {
        day: d,
        revenue: parseFloat(revenue.toFixed(2)), // 🔥 FORMATER À 2 DÉCIMALES
        orders: ordersInDay.length,
      };
    });

    // Stats par jour du mois
    const daysInMonth = today.daysInMonth();
    const monthly = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const ordersInDay = data.filter(
        (o) =>
          dayjs(o.date).month() === today.month() &&
          dayjs(o.date).date() === dayNum
      );

      const revenue = ordersInDay.reduce((sum, o) => sum + getRevenue(o), 0);

      return {
        day: dayNum,
        revenue: parseFloat(revenue.toFixed(2)), // 🔥 FORMATER À 2 DÉCIMALES
        orders: ordersInDay.length,
      };
    });

    // Répartition globale (PieCharts)
    const dailyOrders = data.filter((o) => dayjs(o.date).isSame(today, "day"));
    const weeklyOrders = data.filter((o) => dayjs(o.date).isAfter(startOfWeek));
    const monthlyOrders = data.filter((o) =>
      dayjs(o.date).isAfter(startOfMonth)
    );

    const todayRevenue = dailyOrders.reduce((sum, o) => sum + getRevenue(o), 0);
    const weekRevenue = weeklyOrders.reduce((sum, o) => sum + getRevenue(o), 0);
    const monthRevenue = monthlyOrders.reduce(
      (sum, o) => sum + getRevenue(o),
      0
    );

    console.log("💰 Revenus calculés:", {
      aujourdhui: parseFloat(todayRevenue.toFixed(2)),
      semaine: parseFloat(weekRevenue.toFixed(2)),
      mois: parseFloat(monthRevenue.toFixed(2)),
    });

    setHourlyStats(hourly);
    setWeeklyStats(weekly);
    setMonthlyStats(monthly);
    setRevenueSummary([
      {
        name: "Aujourd'hui",
        value: parseFloat(todayRevenue.toFixed(2)),
      },
      {
        name: "Cette semaine",
        value: parseFloat(weekRevenue.toFixed(2)),
      },
      {
        name: "Ce mois",
        value: parseFloat(monthRevenue.toFixed(2)),
      },
    ]);
    setOrdersSummary([
      { name: "Aujourd'hui", value: dailyOrders.length },
      { name: "Cette semaine", value: weeklyOrders.length },
      { name: "Ce mois", value: monthlyOrders.length },
    ]);
  };

  return (
    <div className="CartemainGeneral">
      <h5>Chiffres clés</h5>

      <div className="keypage">
        <div className="p-6 grid gap-8">
          {/* Chiffre d'affaires par heure */}
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">
              Chiffres d'affaires et Commandes par heure
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") return [`${value} €`, "Revenu (€)"];
                    if (name === "orders") return [value, "Commandes"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenu (€)" />
                <Bar dataKey="orders" fill="#82ca9d" name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chiffre d'affaires par jour de la semaine */}
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">
              Chiffres d'affaires et Commandes par jour de la semaine
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") return [`${value} €`, "Revenu (€)"];
                    if (name === "orders") return [value, "Commandes"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#FF8042" name="Revenu (€)" />
                <Bar dataKey="orders" fill="#00C49F" name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chiffre d'affaires par jour du mois */}
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">
              Chiffres d'affaires et Commandes par jour du mois
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") return [`${value} €`, "Revenu (€)"];
                    if (name === "orders") return [value, "Commandes"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenu (€)" />
                <Bar dataKey="orders" fill="#82ca9d" name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition globale (PieCharts) */}
          <div className="bg-white shadow-lg rounded-2xl p-4 grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4">
                Répartition du Chiffre d'affaires
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={revenueSummary}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={250}
                    label={({ name, value }) => `${name}: ${value} €`}
                  >
                    {revenueSummary.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} €`, "Revenu"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">
                Répartition des commandes
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={ordersSummary}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={250}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {ordersSummary.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Key;
