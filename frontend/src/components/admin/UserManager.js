// frontend/src/components/admin/UserManager.js
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import UserForm from "./UserForm";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const roles = ["participant", "workshop_leader", "admin"];
  const professions = ["Etudiant", "Pharmacien", "Enseignant", "Autre"];
  const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    profession: "",
    role: "",
    search: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { "x-auth-token": token },
        params: filters,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { "x-auth-token": token } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const handleOpenDetails = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/users/${userId}`,
        { headers: { "x-auth-token": token } }
      );
      setSelectedUser(res.data);
      setDetailsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch user details", err);
      alert("Erreur lors de la récupération des détails de l'utilisateur.");
    }
  };

  const handleDelete = async (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { "x-auth-token": token },
        });
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await axios.post("http://localhost:5000/api/admin/users", userData, {
        headers: { "x-auth-token": token },
      });
      setCreateUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur lors de la création");
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCreateUserModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Créer un Nouvel Utilisateur
      </Button>

      <UserForm
        open={isCreateUserModalOpen}
        handleClose={() => setCreateUserModalOpen(false)}
        onSave={handleCreateUser}
      />

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Profession</InputLabel>
              <Select
                name="profession"
                value={filters.profession}
                label="Profession"
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>Toutes</em>
                </MenuItem>
                {professions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                name="role"
                value={filters.role}
                label="Rôle"
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rechercher (Nom, Email...)"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tableau des utilisateurs */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.profession}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
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
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDetails(user._id)}
                    sx={{ mr: 1 }}
                  >
                    Détails
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(user._id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de détails de l'utilisateur */}
      {selectedUser && (
        <Dialog
          open={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Détails de l'Utilisateur</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedUser.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedUser.phone}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">
              <strong>Rôle :</strong> {selectedUser.role}
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
              <List>
                {selectedUser.registeredWorkshops.map((workshop) => (
                  <ListItem key={workshop._id}>
                    <ListItemText primary={workshop.title} />
                  </ListItem>
                ))}
              </List>
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
