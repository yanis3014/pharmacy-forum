// frontend/src/components/admin/WorkshopManager.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import WorkshopForm from "./WorkshopForm";
import RegistrationManager from "./RegistrationManager";

const WorkshopManager = () => {
  const [workshops, setWorkshops] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const token = localStorage.getItem("token");
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const handleOpenRegistrationManager = (workshop) => {
    setSelectedWorkshop(workshop);
    setRegistrationModalOpen(true);
  };

  const handleCloseRegistrationManager = () => {
    setRegistrationModalOpen(false);
    setSelectedWorkshop(null);
  };

  const fetchWorkshops = async () => {
    const res = await axios.get("http://localhost:5000/api/workshops");
    setWorkshops(res.data);
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleOpen = (workshop = null) => {
    setCurrentWorkshop(workshop);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (formData) => {
    const config = { headers: { "x-auth-token": token } };
    try {
      if (formData._id) {
        await axios.put(
          `http://localhost:5000/api/admin/workshops/${formData._id}`,
          formData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/admin/workshops",
          formData,
          config
        );
      }
      fetchWorkshops();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde de l'atelier");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet atelier ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/workshops/${id}`, {
          headers: { "x-auth-token": token },
        });
        fetchWorkshops();
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Créer un Nouvel Atelier
      </Button>
      <WorkshopForm
        open={open}
        handleClose={handleClose}
        onSave={handleSave}
        workshopData={currentWorkshop}
      />
      {selectedWorkshop && (
        <RegistrationManager
          open={registrationModalOpen}
          handleClose={handleCloseRegistrationManager}
          workshop={selectedWorkshop}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell>Chef d'Atelier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workshops.map((ws) => (
              <TableRow key={ws._id}>
                <TableCell>{ws.title}</TableCell>
                <TableCell>
                  {ws.registrations.length} / {ws.capacity}
                </TableCell>
                <TableCell>
                  {ws.leader
                    ? ws.leader.firstName + " " + ws.leader.lastName
                    : "Non assigné"}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(ws)} size="small">
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(ws._id)}
                    size="small"
                    color="error"
                  >
                    Supprimer
                  </Button>
                  <Button
                    onClick={() => handleOpenRegistrationManager(ws)}
                    size="small"
                    variant="outlined"
                  >
                    Inscriptions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WorkshopManager;
