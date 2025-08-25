// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";

//  THÈME DE COULEURS PROFESSIONNEL
const theme = createTheme({
  palette: {
    mode: "light", // On passe en mode clair
    primary: {
      main: "#0D47A1", // Un bleu marine profond pour les éléments principaux
    },
    secondary: {
      main: "#42A5F5", // Un bleu plus clair pour les accents
    },
    background: {
      default: "#F4F6F8", // Un gris très clair pour le fond général
      paper: "#FFFFFF", // Un blanc pur pour les cartes et surfaces
    },
    text: {
      primary: "#212121", // Noir doux pour le texte principal
      secondary: "#757575", // Gris pour le texte secondaire
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    // Amélioration du style des boutons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bords arrondis
          textTransform: "none", // Pas de majuscules
          fontWeight: "bold",
        },
      },
    },
    // Amélioration du style des cartes
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Bords plus arrondis pour les cartes
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />{" "}
            {/* <-- 2. AJOUTER LA NOUVELLE ROUTE */}
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
