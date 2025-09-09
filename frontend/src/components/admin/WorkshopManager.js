// frontend/src/components/admin/WorkshopManager.js
import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import api from "../../api"; // CORRECT : Importation de l'instance centralisée
import WorkshopForm from "./WorkshopForm";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const WorkshopManager = () => {
  const [workshops, setWorkshops] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [openRegistrationsModal, setOpenRegistrationsModal] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(null);

  const fetchWorkshops = useCallback(async () => {
    try {
      // CORRIGÉ : Plus besoin de headers, l'intercepteur s'en charge
      const res = await api.get("/workshops");
      setWorkshops(res.data);
    } catch (err) {
      console.error("Failed to fetch workshops", err);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleSave = async (formData, id) => {
    // CORRIGÉ : On utilise juste le chemin relatif, la base URL est dans api.js
    const url = id ? `/admin/workshops/${id}` : "/admin/workshops";
    const method = id ? "put" : "post";
    try {
      // CORRIGÉ : Plus de "localhost" et plus de headers manuels
      await api[method](url, formData, {
        // On garde juste ce header spécifique pour l'upload de fichiers
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`Atelier ${id ? "mis à jour" : "créé"} avec succès !`);
      setOpenCreateModal(false);
      setOpenEditModal(false);
      fetchWorkshops();
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          `Erreur lors de la ${id ? "mise à jour" : "création"}.`
      );
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet atelier ?")) {
      try {
        // CORRIGÉ : Plus de headers manuels
        await api.delete(`/admin/workshops/${id}`);
        alert("Atelier supprimé avec succès.");
        fetchWorkshops();
      } catch (err) {
        alert(err.response?.data?.msg || "Erreur lors de la suppression.");
      }
    }
  };

  const handleOpenEditModal = (workshop) => {
    setEditingWorkshop(workshop);
    setOpenEditModal(true);
  };

  const handleViewRegistrations = async (workshop) => {
    try {
      // CORRIGÉ : Plus de headers manuels
      const res = await api.get(`/workshops/${workshop._id}/registrations`);
      setCurrentWorkshop(workshop);
      setRegistrations(res.data);
      setOpenRegistrationsModal(true);
    } catch (err) {
      alert("Erreur lors de la récupération des inscrits.");
    }
  };

  const handleConfirmPayment = async (workshopId, userId) => {
    try {
      // CORRIGÉ : Plus de headers manuels
      await api.put("/admin/registrations/confirm", { workshopId, userId });
      alert("Paiement confirmé et e-mail envoyé !");
      // Rafraîchir la liste pour voir le changement de statut
      const res = await api.get(`/workshops/${workshopId}/registrations`);
      setRegistrations(res.data);
      fetchWorkshops();
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur lors de la confirmation.");
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateModal(true)}
        sx={{ mb: 2 }}
      >
        Créer un Nouvel Atelier
      </Button>
      <WorkshopForm
        open={openCreateModal}
        handleClose={() => setOpenCreateModal(false)}
        onSave={handleSave}
      />
      {editingWorkshop && (
        <WorkshopForm
          open={openEditModal}
          handleClose={() => setOpenEditModal(false)}
          editingWorkshop={editingWorkshop}
          onSave={handleSave}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell>Inscrits</TableCell>
              <TableCell>Leader</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workshops.map((workshop) => (
              <TableRow key={workshop._id}>
                <TableCell>{workshop.title}</TableCell>
                <TableCell>{workshop.capacity}</TableCell>
                <TableCell>{workshop.registrations?.length || 0}</TableCell>
                <TableCell>
                  {workshop.leader
                    ? `${workshop.leader.firstName} ${workshop.leader.lastName}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    sx={{ mr: 1 }}
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenEditModal(workshop)}
                  >
                    Modifier
                  </Button>
                  <Button
                    sx={{ mr: 1 }}
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={() => handleViewRegistrations(workshop)}
                  >
                    Voir Inscrits
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteWorkshop(workshop._id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openRegistrationsModal}
        onClose={() => setOpenRegistrationsModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          Inscrits à "{currentWorkshop?.title}"
        </DialogTitle>
        <DialogContent dividers>
          {registrations.length > 0 ? (
            <List>
              {registrations.map((reg, index) => (
                <Box key={reg._id}>
                  <ListItem
                    secondaryAction={
                      reg.status === "confirmed" ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Confirmé"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleConfirmPayment(
                              currentWorkshop._id,
                              reg.user._id
                            )
                          }
                        >
                          Confirmer
                        </Button>
                      )
                    }
                  >
                    <Avatar sx={{ mr: 2, bgcolor: "primary.light" }}>
                      <AccountCircleIcon />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{ fontWeight: "bold" }}
                        >
                          {reg.user.firstName} {reg.user.lastName}
                        </Typography>
                      }
                      secondary={reg.user.email}
                    />
                  </ListItem>
                  {index < registrations.length - 1 && (
                    <Divider component="li" sx={{ my: 1 }} />
                  )}
                </Box>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              Aucun inscrit pour le moment.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WorkshopManager;
