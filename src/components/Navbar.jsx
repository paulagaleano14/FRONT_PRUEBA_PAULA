import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../js/const";

export default function Navbar() {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === ROLES.ADMIN;
  const isExterno = user?.role === ROLES.EXTERNO;

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Prueba Paula
        </Typography>

        {/* SOLO SI ESTÁ LOGUEADO */}
        {user && (
          <>
            {/* Visible para admin y externo */}
            <Button color="inherit" component={Link} to="/empresas">
              Empresas
            </Button>

            {/* Solo Admin */}
            {isAdmin && (
              <>
                <Button color="inherit" component={Link} to="/productos">
                  Productos
                </Button>

                <Button color="inherit" component={Link} to="/inventario">
                  Inventario
                </Button>
              </>
            )}

            <Button color="inherit" onClick={logout}>
              Cerrar Sesión
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
