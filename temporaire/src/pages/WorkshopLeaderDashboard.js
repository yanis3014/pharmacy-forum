// frontend/src/pages/WorkshopLeaderDashboard.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const WorkshopLeaderDashboard = () => {
  const [myWorkshops, setMyWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/workshops/my-workshops",
          {
            headers: { "x-auth-token": token },
          }
        );
        setMyWorkshops(res.data);
      } catch (err) {
        setError(err.response.data.msg || "Could not fetch your workshops.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, [token]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Espace Chef d'Atelier
      </Typography>
      {myWorkshops.length === 0 ? (
        <Alert severity="info">
          Vous n'avez pas encore d'ateliers assignés.
        </Alert>
      ) : (
        myWorkshops.map((workshop) => (
          <Box key={workshop._id} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {workshop.title}
            </Typography>
            <Typography variant="body1">
              Participants inscrits : {workshop.registrations.length}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workshop.registrations.map((registration) => (
                    <TableRow key={registration._id}>
                      <TableCell>
                        {registration.user?.firstName}{" "}
                        {registration.user?.lastName}
                      </TableCell>
                      <TableCell>{registration.user?.email}</TableCell>
                      <TableCell>{registration.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      )}
    </Box>
  );
};

export default WorkshopLeaderDashboard;
