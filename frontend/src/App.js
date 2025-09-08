// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Programme from "./components/Programme";
import WorkshopsPage from "./pages/WorkshopsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import WorkshopLeaderDashboard from "./pages/WorkshopLeaderDashboard";
import PleaseVerify from "./pages/PleaseVerify";
import VerifyEmail from "./pages/VerifyEmail";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container component="main" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/programme" element={<Programme />} />
            <Route path="/workshops" element={<WorkshopsPage />} />

            {/* Dashboards Spécifiques */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/participant-dashboard"
              element={<ParticipantDashboard />}
            />
            <Route
              path="/leader-dashboard"
              element={<WorkshopLeaderDashboard />}
            />
            <Route path="/please-verify" element={<PleaseVerify />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
