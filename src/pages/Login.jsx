import { useState } from "react";
import { TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });


  /**
   * Maneja el envío del formulario de login.
   * - Previene el comportamiento por defecto del formulario
   * - Valida campos obligatorios
   * - Aplica validación mínima de contraseña
   * - Ejecuta el login del contexto
   * - Muestra mensajes de éxito o error mediante Snackbar
   * @param {Event} e - Evento submit del formulario
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || email.trim() === "") {
      setSnack({ open: true, msg: "El correo es obligatorio", type: "error" });
      return;
    }

    if (!password || password.trim() === "") {
      setSnack({ open: true, msg: "La contraseña es obligatoria", type: "error" });
      return;
    }

    try {
      await login(email, password);
      setSnack({ open: true, msg: "Inicio de sesión exitoso", type: "success" });
      
    } catch (err) {
      setSnack({ open: true, msg: "Credenciales incorrectas", type: "error" });
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: 400,
        mx: "auto",
        mt: 15,
        p: 4,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Iniciar Sesión
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password.length > 0 && !/^(?=.*[^A-Za-z0-9]).{4,}$/.test(password)}
          helperText={
            password.length > 0 &&
            !/^(?=.*[^A-Za-z0-9]).{4,}$/.test(password)
              ? "Debe tener mínimo 4 caracteres y 1 caracter especial"
              : ""
          }
        />
        
        <Button
          variant="contained"
          fullWidth
          size="large"
          type="submit"
        >
          Entrar
        </Button>
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.type}>{snack.msg}</Alert>
      </Snackbar>
      </form>
    </Paper>
  );
}