// frontend/src/pages/UserProfile.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import axios from "axios";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    profession: "",
    grade: "",
    studentLevel: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { "x-auth-token": token },
        });
        setFormData(res.data);
      } catch (err) {
        setError("Erreur lors de la récupération de votre profil.");
      }
    };
    fetchProfile();
  }, [token]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: { "x-auth-token": token },
      });
      setMessage("Profil mis à jour avec succès !");
      setError("");
    } catch (err) {
      setError(
        err.response.data.msg ||
          "Une erreur est survenue lors de la mise à jour."
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Mon Profil
        </Typography>
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Numéro de Téléphone"
                name="phone"
                value={formData.phone}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
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
                    value={formData.studentLevel}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Établissement"
                    name="institution"
                    value={formData.institution}
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
                  value={formData.grade}
                  onChange={onChange}
                />
              </Grid>
            )}
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Sauvegarder
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
