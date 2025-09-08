// frontend/src/components/Programme.js
import React from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CoffeeIcon from "@mui/icons-material/Coffee";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const programmeData = {
  jour1: [
    {
      time: "8h30 - 9h15",
      event: "Ouverture",
      details: "Par la Doyenne et Lamia Abed",
      icon: <EventIcon />,
    },
    {
      time: "9h30 - 10h30",
      event: "Ma thèse en 180 secondes",
      details: "5 thèses d'exercice et 5 thèses de 3e cycle",
      icon: <SchoolIcon />,
    },
    { time: "10h30 - 11h", event: "Pause café", icon: <CoffeeIcon /> },
    { time: "11h - 12h", event: "3 conférences", icon: <GroupIcon /> },
    {
      time: "14h - 18h",
      event: "Workshops",
      details: "Ateliers de 3h ou plus (dont un sur l'IA)",
      icon: <SchoolIcon />,
    },
    {
      time: "18h - 20h",
      event: "Table ronde",
      details: "Avec ATEP, INNOVAMED, etc.",
      icon: <GroupIcon />,
    },
  ],
  jour2: [
    {
      time: "9h - 11h",
      event: "Workshops",
      details: "Ateliers de 2h ou plus",
      icon: <SchoolIcon />,
    },
    {
      time: "11h - 12h",
      event: "Remise des trophées et attestations",
      icon: <EmojiEventsIcon />,
    },
  ],
};

const Programme = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Programme du 4ème Forum de la Recherche
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Vendredi */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, color: "secondary.main" }}>
          Vendredi 24 Octobre
        </Typography>
        <List>
          {programmeData.jour1.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                borderLeft: "4px solid",
                borderColor: "primary.light",
                mb: 1,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={`${item.time} - ${item.event}`}
                secondary={item.details}
              />
            </ListItem>
          ))}
        </List>

        {/* Samedi */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "secondary.main" }}>
          Samedi 25 Octobre
        </Typography>
        <List>
          {programmeData.jour2.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                borderLeft: "4px solid",
                borderColor: "primary.light",
                mb: 1,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={`${item.time} - ${item.event}`}
                secondary={item.details}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Programme;
