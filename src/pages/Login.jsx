import { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { alertError, alertSuccess } from "../js/utils/alerts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || email.trim() === "") {
      alertError("El correo es obligatorio");
      return;
    }

    if (!password || password.trim() === "") {
      alertError("La contraseña es obligatoria");
      return;
    }

    try {
      await login(email, password);
      alertSuccess("Inicio de sesión exitoso");
    } catch (err) {
      alertError("Credenciales incorrectas");
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
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </Paper>
  );
}