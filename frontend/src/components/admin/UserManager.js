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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../../api"; // CORRECT : Utilise l'instance centralisée
import UserForm from "./UserForm";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    profession: "",
    role: "",
    search: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      // CORRIGÉ : On passe les filtres dans l'option 'params' et on retire les headers
      const res = await api.get("/admin/users", { params: filters });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        // CORRIGÉ : Plus besoin de headers
        await api.delete(`/admin/users/${id}`);
        alert("Utilisateur supprimé avec succès.");
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.msg || "Erreur lors de la suppression.");
      }
    }
  };

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSave = () => {
    handleClose();
    fetchUsers();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Rechercher"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Profession</InputLabel>
          <Select
            name="profession"
            value={filters.profession}
            onChange={handleFilterChange}
            label="Profession"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="pharmacist">Pharmacien</MenuItem>
            <MenuItem value="student">Étudiant</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rôle</InputLabel>
          <Select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            label="Rôle"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="participant">Participant</MenuItem>
            <MenuItem value="workshop_leader">Animateur</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Créer un Utilisateur
      </Button>
      <UserForm
        open={open}
        handleClose={handleClose}
        onSave={handleSave}
        editingUser={editingUser}
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
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(user)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
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
    </Box>
  );
};

export default UserManager;
