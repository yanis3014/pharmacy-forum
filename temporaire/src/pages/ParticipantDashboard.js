// frontend/src/pages/ParticipantDashboard.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Fade,
  Paper,
  Divider,
  Chip,
  Button, // Assurez-vous que Button est bien importé
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { QRCodeCanvas } from "qrcode.react";

const ParticipantDashboard = () => {
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.user.name);
      setUserId(decodedToken.user.id);
    }

    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/workshops/my-registrations",
          {
            headers: { "x-auth-token": token },
          }
        );
        setMyRegistrations(res.data);
      } catch (err) {
        setError("Erreur lors de la récupération de vos inscriptions.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [token]);

  // Fonction pour annuler une inscription
  const handleUnregister = async (workshopId) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir annuler votre inscription à cet atelier ?"
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:5000/api/workshops/${workshopId}/unregister`,
          {
            headers: { "x-auth-token": token },
          }
        );
        alert("Votre inscription a bien été annulée.");
        // Rafraîchir la page pour mettre à jour la liste
        window.location.reload();
      } catch (err) {
        alert(err.response?.data?.msg || "Erreur lors de l'annulation.");
      }
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Fade in={true} timeout={800}>
      <Box>
        {/* Section de Bienvenue */}
        <Paper
          elevation={2}
          sx={{ p: 4, mb: 4, bgcolor: "primary.main", color: "white" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ScienceIcon sx={{ fontSize: 60, mr: 3 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Bienvenue, {userName} !
              </Typography>
              <Typography variant="subtitle1">
                Voici le récapitulatif de vos inscriptions au 4ème Forum de la
                Recherche.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Section QR Code */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Mon QR Code d'Accès
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Présentez ce code à l'entrée de vos ateliers pour valider votre
            présence.
          </Typography>
          {userId && <QRCodeCanvas value={userId} size={150} />}
        </Paper>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Mes Inscriptions
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {myRegistrations.length === 0 ? (
          <Alert severity="info" variant="outlined">
            Vous n'êtes inscrit à aucun atelier pour le moment.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {myRegistrations.map((workshop) => {
              const myRegistration = workshop.registrations.find(
                (reg) => reg.user === userId
              );
              const status = myRegistration ? myRegistration.status : "N/A";

              let statusChip;
              if (status === "confirmed") {
                statusChip = (
                  <Chip
                    label="Inscription Confirmée"
                    color="success"
                    variant="outlined"
                  />
                );
              } else if (status === "waiting_list") {
                statusChip = (
                  <Chip
                    label="En Liste d'Attente"
                    color="warning"
                    variant="outlined"
                  />
                );
              } else {
                statusChip = (
                  <Chip
                    label="En attente de paiement"
                    color="info"
                    variant="outlined"
                  />
                );
              }

              return (
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: "primary.main", fontWeight: "bold" }}
                        >
                          {workshop.title}
                        </Typography>
                        {statusChip}
                      </Box>
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
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
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
                            label={`Capacité : ${workshop.capacity} places`}
                            variant="outlined"
                          />
                        </Box>
                        {/* Bouton d'annulation */}
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleUnregister(workshop._id)}
                        >
                          Annuler mon inscription
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default ParticipantDashboard;
