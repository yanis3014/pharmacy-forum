// frontend/src/components/Navbar.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // === FONCTION DE DÉCONNEXION CORRIGÉE ===
  const handleLogout = () => {
    localStorage.removeItem("token");
    // On force un rechargement complet en redirigeant vers la racine.
    // C'est plus fiable que navigate() pour vider l'état de l'application.
    window.location.href = "/";
  };
  // =====================================

  const navLinks = !token
    ? [
        { label: "Programme", to: "/programme" },
        { label: "Voir les ateliers", to: "/workshops" },
        { label: "Inscription", to: "/register" },
        { label: "Connexion", to: "/login" },
      ]
    : [
        { label: "Programme", to: "/programme" },
        { label: "Voir les ateliers", to: "/workshops" },
        { label: "Tableau de bord", to: "/dashboard" },
        { label: "Déconnexion", action: handleLogout }, // On utilise 'action' pour la déconnexion
      ];

  return (
    <AppBar position="static">
      <Toolbar>
        <HealthAndSafetyIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Pharmacy Forum
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" aria-label="menu" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {navLinks.map((link) => (
                <MenuItem
                  key={link.label}
                  component={link.to ? Link : "li"} // Le composant est un Link seulement s'il y a une destination 'to'
                  to={link.to}
                  onClick={() => {
                    if (link.action) link.action();
                    handleClose();
                  }}
                >
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                color="inherit"
                component={link.to ? Link : "button"} // Le composant est un Link ou un simple bouton
                to={link.to}
                onClick={link.action}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
