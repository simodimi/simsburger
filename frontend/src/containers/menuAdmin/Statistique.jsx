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
dayjs.extend(isoWeek);

const Statistique = () => {
  const [orders, setOrders] = useState([]);
  const [hourlyTopBurgers, setHourlyTopBurgers] = useState([]);
  const [weeklyTopBurgers, setWeeklyTopBurgers] = useState([]);
  const [monthlyTopBurgers, setMonthlyTopBurgers] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("adminOrders")) || [];
    setOrders(savedOrders);
    computeStats(savedOrders);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedOrders =
        JSON.parse(localStorage.getItem("adminOrders")) || [];
      setOrders(updatedOrders);
      computeStats(updatedOrders);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const computeStats = (data) => {
    const today = dayjs();
    const startOfWeek = today.startOf("week");
    const startOfMonth = today.startOf("month");

    //BURGER LE PLUS CONSOMMÉ PAR HEURE
    const hoursRange = Array.from({ length: 13 }, (_, i) => 11 + i);
    const hourly = hoursRange.map((h) => {
      const ordersInHour = data.filter(
        (o) => dayjs(o.date).isSame(today, "day") && dayjs(o.date).hour() === h
      );

      if (ordersInHour.length === 0)
        return { hour: `${h}h`, burger: "-", count: 0, revenue: 0 };

      // Compter par burger
      const burgerCount = {};
      /* ordersInHour.forEach((o) => {
        if (!burgerCount[o.burgerId])
          burgerCount[o.burgerId] = { count: 0, revenue: 0 };
        burgerCount[o.burgerId].count += 1;
        burgerCount[o.burgerId].revenue += o.total;
      });*/

      ordersInHour.forEach((o) => {
        o.items.forEach((item) => {
          const name = item.name || "Inconnu";
          if (!burgerCount[name]) burgerCount[name] = { count: 0, revenue: 0 };
          burgerCount[name].count += item.quantity;
          burgerCount[name].revenue += item.price * item.quantity;
        });
      });

      // Trouver le max
      const topBurger = Object.entries(burgerCount).sort(
        (a, b) => b[1].count - a[1].count
      )[0];

      return {
        hour: `${h}h`,
        burger: topBurger ? topBurger[0] : "-",
        count: topBurger ? topBurger[1].count : 0,
        revenue: topBurger ? topBurger[1].revenue : 0,
      };
    });
    setHourlyTopBurgers(hourly);

    // TOP 5 BURGERS DE LA SEMAINE
    const weeklyOrders = data.filter((o) => dayjs(o.date).isAfter(startOfWeek));
    const weeklyCount = {};
    /* weeklyOrders.forEach((o) => {
      if (!weeklyCount[o.burgerId])
        weeklyCount[o.burgerId] = { count: 0, revenue: 0 };
      weeklyCount[o.burgerId].count += 1;
      weeklyCount[o.burgerId].revenue += o.total;
    });*/
    weeklyOrders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.name || "Inconnu";
        if (!weeklyCount[name]) weeklyCount[name] = { count: 0, revenue: 0 };
        weeklyCount[name].count += item.quantity;
        weeklyCount[name].revenue += item.price * item.quantity;
      });
    });
    const weeklyTop = Object.entries(weeklyCount)
      .map(([burger, val]) => ({ burger, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setWeeklyTopBurgers(weeklyTop);

    //TOP 5 BURGERS DU MOIS
    const monthlyOrders = data.filter((o) =>
      dayjs(o.date).isAfter(startOfMonth)
    );
    const monthlyCount = {};
    /*monthlyOrders.forEach((o) => {
      if (!monthlyCount[o.burgerId])
        monthlyCount[o.burgerId] = { count: 0, revenue: 0 };
      monthlyCount[o.burgerId].count += 1;
      monthlyCount[o.burgerId].revenue += o.total;
    });*/
    monthlyOrders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.name || "Inconnu";
        if (!monthlyCount[name]) monthlyCount[name] = { count: 0, revenue: 0 };
        monthlyCount[name].count += item.quantity;
        monthlyCount[name].revenue += item.price * item.quantity;
      });
    });
    const monthlyTop = Object.entries(monthlyCount)
      .map(([burger, val]) => ({ burger, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setMonthlyTopBurgers(monthlyTop);
  };

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
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF8042" name="Quantité vendue">
                {/* Afficher le nom du burger sur chaque barre */}
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
              <Tooltip />
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
              <Tooltip />
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
