// frontend/src/components/admin/AdminStats.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Composant réutilisable pour une carte de statistique
const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center" }}>
    <Box
      sx={{
        p: 2,
        borderRadius: "50%",
        backgroundColor: color,
        color: "white",
        mr: 2,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Paper>
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // LE CODE MANQUANT A ÉTÉ AJOUTÉ DANS CE USEEFFECT
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { "x-auth-token": token },
        });
        setStats(res.data);
      } catch (err) {
        setError("Erreur lors de la récupération des statistiques.");
      } finally {
        setLoading(false); // <-- L'instruction pour arrêter le chargement
      }
    };
    fetchStats();
  }, [token]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  // Préparation des données pour le graphique
  const chartData = {
    labels: stats.workshopDetails.map((ws) => ws.name),
    datasets: [
      {
        label: "Inscriptions Confirmées",
        data: stats.workshopDetails.map((ws) => ws.confirmed),
        backgroundColor: "rgba(13, 71, 161, 0.7)",
      },
      {
        label: "En Liste d'Attente",
        data: stats.workshopDetails.map((ws) => ws.waiting),
        backgroundColor: "rgba(66, 165, 245, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Taux de Remplissage par Atelier" },
    },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={<PeopleAltIcon />}
            color="#0D47A1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ateliers"
            value={stats.totalWorkshops}
            icon={<EventIcon />}
            color="#1E88E5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inscrits Confirmés"
            value={stats.confirmedRegistrations}
            icon={<CheckCircleIcon />}
            color="#42A5F5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En Liste d'Attente"
            value={stats.waitingList}
            icon={<HourglassEmptyIcon />}
            color="#90CAF9"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Paper elevation={3} sx={{ p: 3 }}>
        <Bar options={chartOptions} data={chartData} />
      </Paper>
    </Box>
  );
};

export default AdminStats;
