// frontend/src/components/admin/UserManager.js
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import UserForm from "./UserForm";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const roles = ["participant", "workshop_leader", "admin"];
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { "x-auth-token": token },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role");
    }
  };
  const handleCreateUser = () => {
    setCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setCreateUserModalOpen(false);
  };
  const handleSaveNewUser = async (userData) => {
    const config = { headers: { "x-auth-token": token } };
    try {
      await axios.post(
        "http://localhost:5000/api/admin/users",
        userData,
        config
      );
      fetchUsers(); // Rafraîchir la liste après création
      handleCloseCreateUserModal();
    } catch (err) {
      console.error("Failed to create user");
      alert("Erreur lors de la création de l'utilisateur.");
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setSelectedUser(res.data);
      setOpen(true);
    } catch (err) {
      console.error("Failed to fetch user details");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };
  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { "x-auth-token": token },
        });
        fetchUsers(); // Rafraîchir la liste
      } catch (err) {
        console.error("Failed to delete user");
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleCreateUser} sx={{ mb: 2 }}>
        Créer un Utilisateur
      </Button>

      {/* Fenêtre modale pour la création d'utilisateur */}
      <UserForm
        open={createUserModalOpen}
        handleClose={handleCloseCreateUserModal}
        onSave={handleSaveNewUser}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel>Rôle</InputLabel>
                    <Select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewDetails(user._id)}
                    size="small"
                    variant="outlined"
                  >
                    Détails
                  </Button>
                  <Button
                    onClick={() => handleDelete(user._id)}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Fenêtre Modale pour les détails de l'utilisateur */}
      {selectedUser && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Détails de l'Utilisateur</DialogTitle>
          <DialogContent dividers>
            {" "}
            {/* Ajout de séparateurs pour un meilleur style */}
            <Typography variant="h6">
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Rôle : {selectedUser.role}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Informations Personnelles
            </Typography>
            <Typography variant="body2">
              <strong>Email :</strong> {selectedUser.email}
            </Typography>
            <Typography variant="body2">
              <strong>Téléphone :</strong> {selectedUser.phone}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Informations Professionnelles
            </Typography>
            <Typography variant="body2">
              <strong>Profession :</strong> {selectedUser.profession}
            </Typography>
            {selectedUser.profession === "Etudiant" && (
              <>
                <Typography variant="body2">
                  <strong>Niveau d'études :</strong> {selectedUser.studentLevel}
                </Typography>
                <Typography variant="body2">
                  <strong>Établissement :</strong> {selectedUser.institution}
                </Typography>
              </>
            )}
            {selectedUser.profession === "Pharmacien" && (
              <Typography variant="body2">
                <strong>Grade :</strong> {selectedUser.grade}
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Inscriptions aux Ateliers :
            </Typography>
            {selectedUser.registeredWorkshops &&
            selectedUser.registeredWorkshops.length > 0 ? (
              <ul>
                {selectedUser.registeredWorkshops.map((workshop) => (
                  <li key={workshop._id}>
                    <Typography variant="body2">{workshop.title}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucune inscription pour le moment.
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default UserManager;
