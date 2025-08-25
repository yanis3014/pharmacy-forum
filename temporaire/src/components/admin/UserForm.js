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
    profession: "", // <-- Champ ajouté à l'état initial
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {" "}
          {/* Ajout d'un petit padding */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Prénom"
              name="firstName"
              onChange={handleChange}
              autoFocus
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
              label="Adresse Email"
              name="email"
              type="email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="role-label">Rôle</InputLabel>
              <Select
                labelId="role-label"
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
          {/* CHAMP "PROFESSION" AJOUTÉ ICI */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="profession-label-create">Profession</InputLabel>
              <Select
                labelId="profession-label-create"
                name="profession"
                value={formData.profession}
                label="Profession"
                onChange={handleChange}
              >
                <MenuItem value="Etudiant">Étudiant</MenuItem>
                <MenuItem value="Pharmacien">Pharmacien</MenuItem>
                <MenuItem value="Enseignant">Enseignant</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Les champs conditionnels peuvent aussi être ajoutés ici si nécessaire */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
