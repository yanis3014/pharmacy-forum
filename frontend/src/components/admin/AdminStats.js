// frontend/src/components/admin/AdminStats.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ScienceIcon from "@mui/icons-material/Science";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import axios from "axios";

const StatCard = ({ title, value, icon, color = "primary.main" }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
    }}
  >
    <Box>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Box>
    <Box sx={{ color }}>{icon}</Box>
  </Paper>
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { "x-auth-token": token },
        });
        setStats(res.data);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
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
  if (!stats)
    return <Alert severity="info">Aucune statistique à afficher.</Alert>;

  return (
    <Box>
      {/* Cartes principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Utilisateurs Vérifiés"
            value={stats.totalVerifiedUsers}
            icon={<PeopleIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ateliers"
            value={stats.totalWorkshops}
            icon={<ScienceIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Utilisateurs non-vérifiés"
            value={stats.totalUnverifiedUsers}
            icon={<HourglassEmptyIcon fontSize="large" />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Répartition par profession */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Répartition par Profession
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.usersByProfession.map((prof) => (
          <Grid item xs={12} sm={6} md={3} key={prof._id}>
            <StatCard
              title={prof._id}
              value={prof.count}
              icon={prof._id === "Etudiant" ? <SchoolIcon /> : <WorkIcon />}
              color="secondary.main"
            />
          </Grid>
        ))}
      </Grid>

      {/* Tableau des ateliers */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Inscriptions par Atelier
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Atelier</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Confirmés
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Pré-inscrits
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Liste d'attente
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Capacité
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.workshopDetails.map((ws) => (
              <TableRow
                key={ws.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {ws.name}
                </TableCell>
                <TableCell align="center">{ws.confirmed}</TableCell>
                <TableCell align="center">{ws.preRegistered}</TableCell>
                <TableCell align="center">{ws.waiting}</TableCell>
                <TableCell align="center">{ws.capacity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminStats;
