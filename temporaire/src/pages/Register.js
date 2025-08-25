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
} from "@mui/material"; // <-- LIGNE CORRIGÉE
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    profession: "",
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
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.msg || "Une erreur est survenue");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, mb: 2 }}
          color="text.secondary"
        >
          N'oubliez pas de finaliser votre inscription en payant sur place.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prénom"
                name="firstName"
                onChange={onChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                name="lastName"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Adresse Email"
                name="email"
                type="email"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Numéro de Téléphone"
                name="phone"
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                {" "}
                {/* <-- 'fullWidth' est la clé */}
                <InputLabel id="profession-label">Profession</InputLabel>
                <Select
                  labelId="profession-label"
                  name="profession"
                  value={formData.profession}
                  label="Profession"
                  onChange={onChange}
                >
                  <MenuItem value="Etudiant">Étudiant</MenuItem>
                  <MenuItem value="Pharmacien">Pharmacien</MenuItem>
                  <MenuItem value="Enseignant">Enseignant</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
            {formData.profession === "Pharmacien" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Grade (ex: officine, biologiste...)"
                  name="grade"
                  onChange={onChange}
                />
              </Grid>
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
