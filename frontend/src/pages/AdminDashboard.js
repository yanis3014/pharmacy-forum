// frontend/src/pages/AdminDashboard.js
import React, { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import WorkshopManager from "../components/admin/WorkshopManager";
import UserManager from "../components/admin/UserManager";
import AdminStats from "../components/admin/AdminStats";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Panneau d'Administration
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Gérer les Ateliers" />
          <Tab label="Gérer les Utilisateurs" />
          <Tab label="Statistiques" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <WorkshopManager />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserManager />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminStats />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;
