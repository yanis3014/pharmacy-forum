// frontend/src/pages/WorkshopLeaderDashboard.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// Correction des imports pour jsPDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const WorkshopLeaderDashboard = () => {
  const [myWorkshops, setMyWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.user.name);
    }

    const fetchMyWorkshops = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/workshops/my-workshops",
          {
            headers: { "x-auth-token": token },
          }
        );
        setMyWorkshops(res.data);
      } catch (err) {
        setError("Erreur lors de la récupération de vos ateliers.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyWorkshops();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const generatePdf = (workshop) => {
    const doc = new jsPDF();
    const confirmedRegistrations = Array.isArray(workshop.registrations)
      ? workshop.registrations.filter((reg) => reg.status === "confirmed")
      : [];

    doc.setFontSize(20);
    doc.text("Liste de Présence", 14, 22);
    doc.setFontSize(12);
    doc.text(`Atelier: ${workshop.title}`, 14, 32);
    doc.text(`Date: ${formatDate(workshop.date)}`, 14, 40);
    doc.text(`Animateur: ${userName}`, 14, 48);

    const tableColumn = ["Prénom", "Nom", "Email", "Signature"];
    const tableRows = [];

    confirmedRegistrations.forEach((reg) => {
      const registrationData = [
        reg.user.firstName,
        reg.user.lastName,
        reg.user.email,
        "",
      ];
      tableRows.push(registrationData);
    });

    // Utilisation corrigée de autoTable
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 60 });

    const date = new Date().toISOString().slice(0, 10);
    doc.save(`liste-presence_${workshop.title.replace(/ /g, "_")}_${date}.pdf`);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord - Animateur
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Bienvenue, {userName} !
      </Typography>

      {myWorkshops.length === 0 ? (
        <Alert severity="info">
          Vous n'êtes responsable d'aucun atelier pour le moment.
        </Alert>
      ) : (
        myWorkshops.map((workshop) => (
          <Paper key={workshop._id} elevation={3} sx={{ mb: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {workshop.title}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Chip
                  icon={<PeopleIcon />}
                  label={`${
                    workshop.registrations?.length || 0
                  } Inscrits (Total)`}
                />
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => generatePdf(workshop)}
                  disabled={
                    !workshop.registrations ||
                    workshop.registrations.filter(
                      (reg) => reg.status === "confirmed"
                    ).length === 0
                  }
                >
                  Liste de Présence (PDF)
                </Button>
              </Box>
            </Box>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Voir la liste des inscrits</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {workshop.registrations?.length > 0 ? (
                  <ul>
                    {workshop.registrations.map((reg) => (
                      <li key={reg.user._id}>
                        {reg.user.firstName} {reg.user.lastName} (
                        {reg.user.email}) - Statut: {reg.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography>Aucun inscrit pour cet atelier.</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default WorkshopLeaderDashboard;
