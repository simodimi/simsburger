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
import isoWeek from "dayjs/plugin/isoWeek"; // import plugin
dayjs.extend(isoWeek); // active le plugin
import "../../styles/adminkey.css";

const Key = () => {
  const [orders, setOrders] = useState([]);
  const [hourlyStats, setHourlyStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  /*  // Jeu de données simulé
  useEffect(() => {
    const fakeOrders = [
      // aujourd’hui
      {
        id: 1,
        date: dayjs().hour(11).minute(15).format("YYYY-MM-DD HH:mm"),
        total: 25,
      },
      {
        id: 2,
        date: dayjs().hour(12).minute(30).format("YYYY-MM-DD HH:mm"),
        total: 18,
      },
      {
        id: 3,
        date: dayjs().hour(13).minute(45).format("YYYY-MM-DD HH:mm"),
        total: 32,
      },
      {
        id: 4,
        date: dayjs().hour(18).minute(20).format("YYYY-MM-DD HH:mm"),
        total: 20,
      },
      {
        id: 5,
        date: dayjs().hour(20).minute(10).format("YYYY-MM-DD HH:mm"),
        total: 40,
      },

      // cette semaine
      {
        id: 6,
        date: dayjs().subtract(1, "day").hour(14).format("YYYY-MM-DD HH:mm"), //recule de 1 jour
        total: 15,
      },
      {
        id: 7,
        date: dayjs().subtract(2, "day").hour(19).format("YYYY-MM-DD HH:mm"), //recule de 2 jours
        total: 50,
      },
      {
        id: 8,
        date: dayjs().subtract(3, "day").hour(13).format("YYYY-MM-DD HH:mm"), //recule de 3 jours
        total: 22,
      },

      // ce mois
      {
        id: 9,
        date: dayjs().subtract(10, "day").hour(12).format("YYYY-MM-DD HH:mm"),
        total: 35,
      },
      {
        id: 10,
        date: dayjs().subtract(15, "day").hour(18).format("YYYY-MM-DD HH:mm"),
        total: 28,
      },
      {
        id: 11,
        date: dayjs().subtract(20, "day").hour(20).format("YYYY-MM-DD HH:mm"),
        total: 60,
      },
    ];

    setOrders(fakeOrders);
    computeStats(fakeOrders);
  }, []);*/
  // Charger les vraies commandes depuis localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("usercommande")) || [];
    // Aplatir pour extraire chaque produit commandé avec sa date et son prix
    const allOrders = savedOrders.flatMap((order) =>
      order.items.map((item) => ({
        id: order.id,
        burgerName: item.text,
        total: item.prix * item.quantity,
        date: order.date,
      }))
    );

    setOrders(allOrders);
    computeStats(allOrders);
  }, []);

  // Rafraîchir automatiquement en cas de changement localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders =
        JSON.parse(localStorage.getItem("usercommande")) || [];
      const allOrders = savedOrders.flatMap((order) =>
        order.items.map((item) => ({
          id: order.id,
          burgerName: item.text,
          total: item.prix * item.quantity,
          date: order.date,
        }))
      );

      setOrders(allOrders);
      computeStats(allOrders);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const computeStats = (data) => {
    const today = dayjs();
    const startOfWeek = today.startOf("week"); //LUNDI est le premier jour de la semaine
    const startOfMonth = today.startOf("month"); //PREMIER JOUR DU MOIS

    // Stats par heure (11h-23h)
    const hoursRange = Array.from({ length: 13 }, (_, i) => 11 + i); //creer un tableau de 13 elts ,pour chaque elt on met 11+i
    const hourly = hoursRange.map((h) => {
      const ordersInHour = data.filter(
        //ne gardes que les commandes correspondant à la condition
        //la commande est du même jour que today et l'heure correspond à h
        (o) => dayjs(o.date).isSame(today, "day") && dayjs(o.date).hour() === h
      );
      return {
        hour: `${h}h`,
        revenue: ordersInHour.reduce((sum, o) => sum + o.total, 0), //additionne le total de chaque commandepour cette heure
        orders: ordersInHour.length, // nombre de commandes pour cette heure
      };
    });

    // Stats par jour de la semaine (Lun-Dim)
    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const weekly = daysOfWeek.map((d, idx) => {
      const ordersInDay = data.filter(
        (o) =>
          //ne gardes que les commandes correspondant à la condition : la commande est de la semaine courante et le jour correspond au jour de la semaine
          dayjs(o.date).isoWeek() === today.isoWeek() &&
          dayjs(o.date).day() === idx + 1
      );
      return {
        day: d,
        revenue: ordersInDay.reduce((sum, o) => sum + o.total, 0),
        orders: ordersInDay.length,
      };
    });

    // Stats par jour du mois
    const daysInMonth = today.daysInMonth();
    const monthly = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1; // numéro du jour du mois
      const ordersInDay = data.filter(
        (o) =>
          //ne gardes que les commandes correspondant à la condition : la commande est du mois courant et le jour correspond au jour du mois
          dayjs(o.date).month() === today.month() &&
          dayjs(o.date).date() === dayNum
      );
      return {
        day: dayNum,
        revenue: ordersInDay.reduce((sum, o) => sum + o.total, 0),
        orders: ordersInDay.length,
      };
    });

    //Répartition globale (PieCharts)
    const dailyOrders = data.filter((o) => dayjs(o.date).isSame(today, "day"));
    const weeklyOrders = data.filter((o) => dayjs(o.date).isAfter(startOfWeek));
    const monthlyOrders = data.filter((o) =>
      dayjs(o.date).isAfter(startOfMonth)
    );

    setHourlyStats(hourly);
    setWeeklyStats(weekly);
    setMonthlyStats(monthly);
    setRevenueSummary([
      {
        name: "Aujourd’hui",
        value: dailyOrders.reduce((sum, o) => sum + o.total, 0),
      },
      {
        name: "Cette semaine",
        value: weeklyOrders.reduce((sum, o) => sum + o.total, 0),
      },
      {
        name: "Ce mois",
        value: monthlyOrders.reduce((sum, o) => sum + o.total, 0),
      },
    ]);
    setOrdersSummary([
      { name: "Aujourd’hui", value: dailyOrders.length },
      { name: "Cette semaine", value: weeklyOrders.length },
      { name: "Ce mois", value: monthlyOrders.length },
    ]);
  };

  return (
    <div className="CartemainGeneral">
      <h5>Chiffres clés</h5>

      <div className="keypage">
        <div className="p-6 grid gap-8">
          {/*Chiffre d'affaires par heure */}
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">
              Chiffres d'affaires et Commandes par heure
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
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
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#FF8042" name="Revenu (€)" />
                <Bar dataKey="orders" fill="#00C49F" name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/*Chiffre d'affaires par jour du mois */}
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">
              Chiffres d'affaires et Commandes par jour du mois
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
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
                Répartition du Chiffres d'affaires{" "}
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
                    label
                  >
                    {revenueSummary.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                    label
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
