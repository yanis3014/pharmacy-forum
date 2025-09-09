// frontend/src/pages/Register.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    profession: "",
    professionOther: "",
    grade: "",
    studentLevel: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Un e-mail de vérification a été envoyé.");
      navigate("/please-verify");
    } catch (err) {
      setError(err.response?.data?.msg || "Une erreur est survenue");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* ... (champs de base inchangés) ... */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                label="Prénom"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                required
                fullWidth
                label="Nom"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="Adresse Email"
                type="email"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="Mot de passe"
                type="password"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                required
                fullWidth
                label="Téléphone"
                type="tel"
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Je suis</InputLabel>
                <Select
                  name="profession"
                  value={formData.profession}
                  label="Je suis"
                  onChange={onChange}
                >
                  <MenuItem value="Etudiant">Étudiant</MenuItem>
                  <MenuItem value="Enseignant">Enseignant</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>{" "}
                  {/* Option rajoutée */}
                </Select>
              </FormControl>
            </Grid>

            {/* === CHAMP "AUTRE" CONDITIONNEL === */}
            {formData.profession === "Autre" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Veuillez préciser votre profession"
                  name="professionOther"
                  onChange={onChange}
                />
              </Grid>
            )}

            {/* Champs conditionnels pour l'Étudiant */}
            {formData.profession === "Etudiant" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Niveau d'études"
                    name="studentLevel"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Établissement"
                    name="institution"
                    onChange={onChange}
                  />
                </Grid>
              </>
            )}

            {/* Champs conditionnels pour l'Enseignant */}
            {formData.profession === "Enseignant" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Grade"
                    name="grade"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Établissement"
                    name="institution"
                    onChange={onChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            S'inscrire
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
