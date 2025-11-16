import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Prueba Paula
        </Typography>

        {user && (
          <>
            <Button color="inherit" component={Link} to="/empresas">
              Empresas
            </Button>

            <Button color="inherit" component={Link} to="/productos">
              Productos
            </Button>

            <Button color="inherit" onClick={logout}>
              Cerrar Sesión
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
