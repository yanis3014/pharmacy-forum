// frontend/src/pages/PleaseVerify.js
import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const PleaseVerify = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
      <EmailIcon sx={{ fontSize: 60, color: "primary.main" }} />
      <Typography variant="h4" gutterBottom>
        Vérifiez votre boîte mail !
      </Typography>
      <Typography variant="body1">
        Un e-mail de vérification vous a été envoyé. Veuillez cliquer sur le
        lien qu'il contient pour activer votre compte.
      </Typography>
    </Paper>
  </Container>
);

export default PleaseVerify;
