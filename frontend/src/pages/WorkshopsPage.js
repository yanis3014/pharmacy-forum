// frontend/src/pages/WorkshopsPage.js
import React from "react";
import { Box } from "@mui/material";
import Home from "./Home"; // Nous allons réutiliser le composant Home

const WorkshopsPage = () => {
  // Pour l'instant, nous allons simplement réutiliser le composant Home
  // qui affiche déjà la liste des ateliers.
  // Si tu souhaites une page différente, nous pourrons la modifier plus tard.
  return (
    <Box>
      <Home />
    </Box>
  );
};

export default WorkshopsPage;
