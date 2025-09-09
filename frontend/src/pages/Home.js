// frontend/src/pages/Home.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Alert,
  Fade,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import api from "../api";
import { useNavigate } from "react-router-dom";
import forumBanner from "../forum-banner.jpg";
import logo1 from "../logo1.jpg";
import logo2 from "../logo2.jpg";
import logo3 from "../logo3.jpg";
import logo4 from "../logo4.jpg";
import logo5 from "../logo5.jpg";
// Importer l'affiche du forum que vous avez fournie
import forumAffiche from "../forum-banner.jpg";

const Home = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchWorkshops = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (dayFilter) {
        params.day = dayFilter;
      }
      const res = await api.get("/workshops", {
        params,
      });
      setWorkshops(res.data);
    } catch (err) {
      setError("Could not fetch workshops.");
    } finally {
      setLoading(false);
    }
  }, [dayFilter]);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleRegister = async (workshopId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(
        `/api/workshops/${workshopId}/register`,
        {},
        { headers: { "x-auth-token": token } }
      );
      alert("Inscription réussie !");
      fetchWorkshops();
    } catch (err) {
      alert(err.response.data.msg || "Erreur lors de l'inscription");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        {/* Logos */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Box component="img" src={logo5} sx={{ width: 60 }} />
          <Box component="img" src={logo4} sx={{ width: 60 }} />
          <Box component="img" src={logo1} sx={{ width: 60 }} />
          <Box component="img" src={logo2} sx={{ width: 60 }} />
          <Box component="img" src={logo3} sx={{ width: 60 }} />
        </Box>

        {/* Bannière mise à jour */}
        <Box
          sx={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${forumBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            4
            <Box component="sup" sx={{ fontSize: "0.7em" }}>
              e
            </Box>{" "}
            Forum de la Recherche
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Faculté de Pharmacie de Monastir
          </Typography>
          {/* === DATES AJOUTÉES ICI === */}
          <Typography variant="h6" sx={{ mt: 1, fontWeight: "normal" }}>
            Vendredi 24 & Samedi 25 Octobre
          </Typography>
          {/* ========================== */}
        </Box>

        {/* === AFFICHE DU FORUM AJOUTÉE ICI === */}
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Paper elevation={6} sx={{ maxWidth: "800px", width: "100%" }}>
            <img
              src={forumAffiche}
              alt="Affiche du 4ème Forum de la Recherche"
              style={{ width: "100%", display: "block" }}
            />
          </Paper>
        </Box>
        {/* ================================== */}

        <Typography variant="h4" component="h1" gutterBottom>
          Nos Ateliers
        </Typography>

        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button
            variant={dayFilter === "" ? "contained" : "outlined"}
            onClick={() => setDayFilter("")}
          >
            Tous les jours
          </Button>
          <Button
            variant={dayFilter === "24" ? "contained" : "outlined"}
            onClick={() => setDayFilter("24")}
          >
            Vendredi 24
          </Button>
          <Button
            variant={dayFilter === "25" ? "contained" : "outlined"}
            onClick={() => setDayFilter("25")}
          >
            Samedi 25
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {workshops.map((workshop) => (
              <Grid item key={workshop._id} xs={12} sm={12} md={6} lg={6}>
                <Paper
                  elevation={2}
                  sx={{
                    display: { xs: "block", md: "flex" },
                    p: 3,
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  {workshop.imageUrl && (
                    <Box
                      component="img"
                      sx={{
                        width: { xs: "100%", md: 250 },
                        height: 200,
                        objectFit: "cover",
                        mr: { xs: 0, md: 3 },
                        mb: { xs: 2, md: 0 },
                        borderRadius: 2,
                      }}
                      src={`http://localhost:5000${workshop.imageUrl}`}
                      alt={workshop.title}
                    />
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h4"
                      sx={{ color: "primary.main", fontWeight: "bold" }}
                    >
                      {workshop.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {workshop.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      {workshop.leader && (
                        <Chip
                          icon={<PersonIcon />}
                          label={`Animé par : ${workshop.leader.firstName} ${workshop.leader.lastName}`}
                          variant="outlined"
                          color="primary"
                        />
                      )}
                      <Chip
                        icon={<PeopleIcon />}
                        label={`Places confirmées : ${
                          workshop.registrations.filter(
                            (r) => r.status === "confirmed"
                          ).length
                        } / ${workshop.capacity}`}
                        variant="outlined"
                      />
                      {workshop.date && (
                        <Chip
                          icon={<EventIcon />}
                          label={formatDate(workshop.date)}
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleRegister(workshop._id)}
                        disabled={
                          workshop.registrations.filter(
                            (r) => r.status === "confirmed"
                          ).length >= workshop.capacity
                        }
                      >
                        {workshop.registrations.filter(
                          (r) => r.status === "confirmed"
                        ).length >= workshop.capacity
                          ? "Liste d'attente"
                          : "S'inscrire"}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default Home;
