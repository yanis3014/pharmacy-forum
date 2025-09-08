// frontend/src/pages/Dashboard.js
import React from "react";
import { jwtDecode } from "jwt-decode";
import { Box, Alert, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom"; // <-- IMPORTER LINK
import AdminDashboard from "./AdminDashboard";
import WorkshopLeaderDashboard from "./WorkshopLeaderDashboard";
import ParticipantDashboard from "./ParticipantDashboard";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Alert severity="error">
        Vous devez être connecté pour voir cette page.
      </Alert>
    );
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.user.role;

  // Condition pour afficher le bon tableau de bord
  let dashboardComponent;
  if (userRole === "admin") {
    dashboardComponent = <AdminDashboard />;
  } else if (userRole === "workshop_leader") {
    dashboardComponent = <WorkshopLeaderDashboard />;
  } else {
    dashboardComponent = <ParticipantDashboard />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button component={Link} to="/profile" variant="contained">
          Modifier mon profil
        </Button>
      </Box>
      {dashboardComponent}
    </Box>
  );
};

export default Dashboard;
