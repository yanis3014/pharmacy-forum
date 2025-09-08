// frontend/src/pages/VerifyEmail.js
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const token = new URLSearchParams(location.search).get("token");
      if (!token) {
        setError("Token manquant. Impossible de vérifier.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        setMessage(res.data.msg);
      } catch (err) {
        setError(err.response?.data?.msg || "Erreur lors de la vérification.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [location]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
        Aller à la page de connexion
      </Button>
    </Container>
  );
};

export default VerifyEmail;
