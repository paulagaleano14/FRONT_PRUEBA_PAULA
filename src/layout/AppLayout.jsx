import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Prueba Técnica
          </Typography>

          <Button color="inherit" component={Link} to="/empresas">Empresas</Button>
          <Button color="inherit" component={Link} to="/productos">Productos</Button>
          <Button color="inherit" component={Link} to="/inventario">Inventario</Button>
          <Button color="secondary" variant="contained" onClick={logout} sx={{ ml: 2 }}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
