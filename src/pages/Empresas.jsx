import { useEffect, useState } from "react";
import { getEmpresas, deleteEmpresa, editarEmpresa, crearEmpresa } from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ROLES } from '../js/const';
import { alertConfirm } from "../js/utils/alerts";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ nit: "", nombre: "", direccion: "", telefono: "" });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });
  const { user } = useAuth();
  
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      const rows = data.map(emp => ({
        id: emp.nit,
        ...emp
      }));

      setEmpresas(rows);
    } catch (err) {
      setSnack({ open: true, msg: "Error cargando empresas", type: "error" });
    }
  };

  const abrirCrear = () => {
    setForm({ nit: "", nombre: "", direccion: "", telefono: "" });
    setIsEditing(false);
    setOpen(true);
  };

  const abrirEditar = (emp) => {
    setForm(emp);
    setIsEditing(true);
    setOpen(true);
  };

  const cerrarModal = () => {
    setOpen(false);
  };

  const crearEditarEmpresa = async () => {
    try {
      if (isEditing) {
        await editarEmpresa(form.nit, form);
        setSnack({ open: true, msg: "Empresa actualizada", type: "success" });
      } else {
        await crearEmpresa(form);
        setSnack({ open: true, msg: "Empresa creada", type: "success" });
      }
      setOpen(false);
      cargarEmpresas();
    } catch (err) {
      setSnack({ open: true, msg: err.message, type: "error" });
    }
  };

  const eliminarEmpresa = async (nit) => {
    const confirmado = await alertConfirm("¿Seguro que deseas eliminar esta empresa?");
    if (!confirmado) return;


    try {
      await deleteEmpresa(nit);
      setSnack({ open: true, msg: "Empresa eliminada", type: "success" });
      cargarEmpresas();
    } catch (err) {
      setSnack({ open: true, msg: "Error eliminando empresa", type: "error" });
    }
  };

  const columns = [
    { field: "nit", headerName: "NIT", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "direccion", headerName: "Dirección", flex: 2 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },

    isAdmin
      ? {
          field: "acciones",
          headerName: "Acciones",
          sortable: false,
          filterable: false,
          width: 140,
          renderCell: (params) => (
            <>
              <IconButton color="warning" onClick={() => abrirEditar(params.row)}>
                <EditIcon />
              </IconButton>

              <IconButton color="error" onClick={() => eliminarEmpresa(params.row.nit)}>
                <DeleteIcon />
              </IconButton>
            </>
          ),
        }
      : {},
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Listado de Empresas
      </Typography>

      {isAdmin && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          onClick={abrirCrear}
        >
          Crear Empresa
        </Button>
      )}

      <DataGrid
        rows={empresas}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        sx={{
          background: "white",
          boxShadow: 3,
          borderRadius: 2,
        }}
      />

      <Dialog open={open} onClose={cerrarModal}>
        <DialogTitle>{isEditing ? "Editar Empresa" : "Crear Empresa"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="NIT"
            value={form.nit}
            disabled={isEditing}
            onChange={(e) => setForm({ ...form, nit: e.target.value })}
          />

          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <TextField
            label="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />

          <TextField
            label="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button variant="contained" onClick={crearEditarEmpresa}>
            {isEditing ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================
          ALERTAS
      ============================================================ */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.type}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
