// frontend/src/components/admin/RegistrationManager.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";

const RegistrationManager = ({ open, handleClose, workshop }) => {
  const [registrations, setRegistrations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Le modèle Workshop doit être populé pour avoir les détails de l'utilisateur
    // Pour l'instant, on suppose que l'ID de l'atelier contient déjà les inscriptions populées.
    // Une meilleure approche serait de faire un appel API pour récupérer les inscriptions d'un atelier.
    if (workshop) {
      setRegistrations(workshop.registrations);
    }
  }, [workshop]);

  const handleConfirm = async (userId) => {
    try {
      await axios.put(
        "http://localhost:5000/api/admin/registrations/confirm",
        { workshopId: workshop._id, userId },
        { headers: { "x-auth-token": token } }
      );
      handleClose(); // Fermer et rafraîchir la liste principale
      alert("Inscription confirmée !");
    } catch (err) {
      alert("Erreur lors de la confirmation.");
    }
  };

  const statusColor = (status) => {
    if (status === "confirmed") return "success";
    if (status === "waiting_list") return "warning";
    return "default";
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Gérer les Inscriptions pour : {workshop.title}</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((reg) => (
              <TableRow key={reg._id}>
                <TableCell>
                  {reg.user?.firstName} {reg.user?.lastName}
                </TableCell>
                <TableCell>{reg.user?.email}</TableCell>
                <TableCell>
                  <Chip label={reg.status} color={statusColor(reg.status)} />
                </TableCell>
                <TableCell>
                  {reg.status === "pre-registered" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleConfirm(reg.user._id)}
                    >
                      Confirmer Paiement
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationManager;
