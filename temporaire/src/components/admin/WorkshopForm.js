// frontend/src/components/admin/WorkshopForm.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const WorkshopForm = ({ open, handleClose, onSave, workshopData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capacity: "",
    leader: "",
  });
  const [leaders, setLeaders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setFormData(
      workshopData || { title: "", description: "", capacity: "", leader: "" }
    );
  }, [workshopData]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/users/role/workshop_leader",
          {
            headers: { "x-auth-token": token },
          }
        );
        setLeaders(res.data);
      } catch (err) {
        console.error("Failed to fetch workshop leaders");
      }
    };
    if (open) {
      fetchLeaders();
    }
  }, [open, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {workshopData ? "Modifier l'Atelier" : "Créer un Atelier"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="title"
          label="Titre"
          type="text"
          fullWidth
          variant="standard"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="standard"
          value={formData.description}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          name="imageUrl"
          label="URL de l'image descriptive"
          type="text"
          fullWidth
          variant="standard"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          name="date"
          label="Date de l'atelier"
          type="date" // Type de champ 'date'
          fullWidth
          variant="standard"
          value={formData.date ? formData.date.split("T")[0] : ""} // Formatage pour l'input
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          name="capacity"
          label="Capacité"
          type="number"
          fullWidth
          variant="standard"
          value={formData.capacity}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="leader-label">Chef d'Atelier</InputLabel>
          <Select
            labelId="leader-label"
            name="leader"
            value={formData.leader || ""}
            onChange={handleChange}
            label="Chef d'Atelier"
          >
            <MenuItem value="">
              <em>Non assigné</em>
            </MenuItem>
            {leaders.map((leader) => (
              <MenuItem key={leader._id} value={leader._id}>
                {leader.firstName} {leader.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit}>Sauvegarder</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkshopForm;
