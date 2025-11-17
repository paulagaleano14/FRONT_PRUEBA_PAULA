import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Forbbiden() {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 10
      }}
    >
      <Typography variant="h3" color="error" gutterBottom>
        🚫 403 - Acceso Denegado
      </Typography>

      <Typography variant="h6" gutterBottom>
        No tienes permisos para acceder a esta sección.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/empresas"
        sx={{ mt: 3 }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
}
