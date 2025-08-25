// frontend/src/components/admin/AttendanceManager.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import QrScanner from "../QrScanner"; // Assurez-vous que le chemin est correct

const AttendanceManager = () => {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/workshops");
        setWorkshops(res.data);
      } catch (err) {
        setScanError("Erreur lors de la récupération des ateliers.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const handleScan = async (userId) => {
    if (!selectedWorkshop) {
      setScanError("Veuillez d'abord sélectionner un atelier !");
      return;
    }
    // Pour éviter de scanner la même personne plusieurs fois de suite
    if (scanResult.includes(userId)) return;

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/registrations/check-in",
        { workshopId: selectedWorkshop, userId },
        { headers: { "x-auth-token": token } }
      );
      setScanResult(res.data.msg);
      setScanError("");
    } catch (err) {
      setScanError(err.response?.data?.msg || "Erreur lors de la validation.");
      setScanResult("");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Contrôle des Présences
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Sélectionnez un atelier pour activer le scanner, puis présentez le QR
        code devant la caméra.
      </Alert>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sélectionner un Atelier</InputLabel>
        <Select
          value={selectedWorkshop}
          label="Sélectionner un Atelier"
          onChange={(e) => {
            setSelectedWorkshop(e.target.value);
            setScanResult(""); // Réinitialiser les messages
            setScanError("");
          }}
        >
          {workshops.map((ws) => (
            <MenuItem key={ws._id} value={ws._id}>
              {ws.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ width: "100%", maxWidth: "500px", margin: "auto", mt: 2 }}>
        {selectedWorkshop ? (
          <QrScanner onScan={handleScan} />
        ) : (
          <Alert severity="warning">
            Veuillez sélectionner un atelier pour activer le scanner.
          </Alert>
        )}
      </Box>

      {scanResult && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {scanResult}
        </Alert>
      )}
      {scanError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {scanError}
        </Alert>
      )}
    </Box>
  );
};

export default AttendanceManager;
