// frontend/src/components/admin/WorkshopForm.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";

const WorkshopForm = ({ open, handleClose, onSave, editingWorkshop }) => {
  const [formData, setFormData] = useState({});
  const [leaders, setLeaders] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  // Initialisation du formulaire
  useEffect(() => {
    const initialData = {
      title: editingWorkshop?.title || "",
      description: editingWorkshop?.description || "",
      capacity: editingWorkshop?.capacity || 0,
      leader: editingWorkshop?.leader?._id || "",
      date: editingWorkshop?.date
        ? new Date(editingWorkshop.date).toISOString().slice(0, 16)
        : "",
      imageUrl: editingWorkshop?.imageUrl || "",
    };
    setFormData(initialData);
    setSelectedFile(null);
  }, [editingWorkshop, open]);

  // Récupération des leaders
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/users?role=workshop_leader",
          {
            headers: { "x-auth-token": token },
          }
        );
        setLeaders(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des leaders", err);
      }
    };
    if (open) {
      fetchLeaders();
    }
  }, [open, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    const data = new FormData();
    // Append all form data
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (selectedFile) data.append("image", selectedFile);

    onSave(data, editingWorkshop?._id);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingWorkshop ? "Modifier l'Atelier" : "Créer un Atelier"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              minRows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Capacité"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="date"
              label="Date et Heure"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* === SÉLECTEUR DE LEADER CORRIGÉ === */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Leader de l'atelier</InputLabel>
              <Select
                name="leader"
                value={formData.leader}
                label="Leader de l'atelier"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                {leaders.map((leader) => (
                  <MenuItem
                    key={leader._id}
                    value={leader._id}
                  >{`${leader.firstName} ${leader.lastName}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: dragActive ? "primary.main" : "grey.400",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <input
                type="file"
                name="image"
                onChange={(e) => handleFileChange(e.target.files[0])}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
              <Typography color="text.secondary">
                Glisser-déposer un fichier ou cliquer pour sélectionner
              </Typography>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fichier sélectionné : {selectedFile.name}
                </Typography>
              )}
              {!selectedFile && formData.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Image actuelle :</Typography>
                  <img
                    src={`http://localhost:5000${formData.imageUrl}`}
                    alt="Aperçu"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      marginTop: "8px",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingWorkshop ? "Modifier" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkshopForm;
