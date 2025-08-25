// frontend/src/pages/Home.js
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import forumBanner from "../forum-banner.jpg";

// Importez les nouveaux logos
import logo1 from "../logo1.jpg";
import logo2 from "../logo2.jpg";
import logo3 from "../logo3.jpg";
import logo4 from "../logo4.jpg";
import logo5 from "../logo5.jpg";

const Home = () => {
  // ... reste du code inchangé ...
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/workshops");
        setWorkshops(res.data);
      } catch (err) {
        setError("Could not fetch workshops.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const handleRegister = async (workshopId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/workshops/${workshopId}/register`,
        {},
        {
          headers: { "x-auth-token": token },
        }
      );
      alert("Inscription réussie !");
      window.location.reload();
    } catch (err) {
      alert(err.response.data.msg || "Erreur lors de l'inscription");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        {/* LOGOS AU-DESSUS DE LA BANNIÈRE */}
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

        {/* Bannière Hero avec correction du "4e" */}
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
            Forum de la Recherche {/* <-- CORRECTION DU "4e" */}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Faculté de Pharmacie de Monastir
          </Typography>
        </Box>

        {/* ... reste du contenu des ateliers inchangé ... */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 6 }}>
          Nos Ateliers
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Important :</strong> Votre inscription à un atelier n'est
          qu'une pré-réservation. Pour la valider définitivement, veuillez
          procéder au paiement sur place auprès du comité d'organisation. Les
          places sont limitées !
        </Alert>
        <Grid container spacing={3}>
          {workshops.map((workshop) => (
            <Grid item key={workshop._id} xs={12}>
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
                    src={workshop.imageUrl}
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
      </Box>
    </Fade>
  );
};

export default Home;
