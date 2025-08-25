// src/components/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <HealthAndSafetyIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}
        >
          Forum Pharmacie Monastir
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            {" "}
            {/* <-- BOUTON AJOUTÉ */}
            Voir les Ateliers
          </Button>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Tableau de Bord
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Connexion
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Inscription
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
