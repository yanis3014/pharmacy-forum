// frontend/src/components/NotificationProvider.js
import React, {
  createContext,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

// Crée un composant d'alerte personnalisée pour le Snackbar
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const showNotification = (msg, sev = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Hook pour utiliser facilement les notifications dans n'importe quel composant
export const useNotification = () => useContext(NotificationContext);
