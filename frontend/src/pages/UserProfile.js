// frontend/src/pages/UserProfile.js
import React, { useState, useEffect } from "react";
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
  Paper,
} from "@mui/material";
import axios from "axios";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profession: "",
    professionOther: "",
    grade: "",
    studentLevel: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { "x-auth-token": token },
        });
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          profession: res.data.profession || "",
          professionOther: res.data.professionOther || "",
          grade: res.data.grade || "",
          studentLevel: res.data.studentLevel || "",
          institution: res.data.institution || "",
        });
      } catch (err) {
        setError("Erreur lors de la récupération de votre profil.");
      }
    };
    fetchProfile();
  }, [token]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: { "x-auth-token": token },
      });
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Une erreur est survenue lors de la mise à jour."
      );
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Mon Profil
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                label="Prénom"
                value={formData.firstName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                required
                fullWidth
                label="Nom"
                value={formData.lastName}
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
                value={formData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                required
                fullWidth
                label="Numéro de téléphone"
                type="tel"
                value={formData.phone}
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
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.profession === "Autre" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Veuillez préciser"
                  name="professionOther"
                  value={formData.professionOther}
                  onChange={onChange}
                />
              </Grid>
            )}
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
            {formData.profession === "Enseignant" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Grade"
                    name="grade"
                    value={formData.grade}
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Mettre à jour
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
