// frontend/src/components/admin/UserForm.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const UserForm = ({ open, handleClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "participant",
    phone: "",
    profession: "",
    professionOther: "", // Ajouté pour le champ "Autre"
    grade: "",
    studentLevel: "",
    institution: "",
  });

  const roles = ["participant", "workshop_leader", "admin"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleCloseForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "participant",
      phone: "",
      profession: "",
      professionOther: "",
      grade: "",
      studentLevel: "",
      institution: "",
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseForm} fullWidth maxWidth="sm">
      <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Prénom"
              name="firstName"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nom"
              name="lastName"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Mot de passe (provisoire)"
              name="password"
              type="password"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Rôle</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Rôle"
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Numéro de Téléphone"
              name="phone"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Profession</InputLabel>
              <Select
                name="profession"
                value={formData.profession}
                label="Profession"
                onChange={handleChange}
              >
                <MenuItem value="Etudiant">Étudiant</MenuItem>
                <MenuItem value="Enseignant">Enseignant</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Champs conditionnels */}
          {formData.profession === "Autre" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Veuillez préciser"
                name="professionOther"
                onChange={handleChange}
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
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Établissement"
                  name="institution"
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Établissement"
                  name="institution"
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseForm}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
