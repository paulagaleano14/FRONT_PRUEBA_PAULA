import { useEffect, useState, useMemo } from "react";
import { getEmpresas, deleteEmpresa, editarEmpresa, crearEmpresa } from "../services/empresasApi";
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

import { ROLES } from "../js/const";
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

  /**
   * Obtiene todas las empresas desde la API y las asigna al DataGrid.
   * Cada empresa se marca con un ID = NIT para que DataGrid no falle.
   */
  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data.map((emp) => ({ id: emp.nit, ...emp })));
    } catch {
      setSnack({ open: true, msg: "Error cargando empresas", type: "error" });
    }
  };

  /**
   * Abre el modal de creación de empresa.
   * Reinicia los campos del formulario.
   */
  const abrirCrear = () => {
    setForm({ nit: "", nombre: "", direccion: "", telefono: "" });
    setIsEditing(false);
    setOpen(true);
  };

  /**
   * Abre el modal en modo edición y carga los datos de la empresa seleccionada.
   * @param {object} emp - Empresa seleccionada
   */
  const abrirEditar = (emp) => {
    setForm(emp);
    setIsEditing(true);
    setOpen(true);
  };

  /** Cierra el modal */
  const cerrarModal = () => setOpen(false);


  /**
   * Valida el formulario y ejecuta la creación o edición de la empresa.
   * Contempla:
   *  - Campos obligatorios
   *  - Campos numéricos (NIT, teléfono)
   *  - Longitud máxima de texto
   */
  const crearEditarEmpresa = async () => {
    try {
      // Validaciones básicas
      if (!form.nit || !form.nombre || !form.direccion || !form.telefono) {
        setSnack({ open: true, msg: "Todos los campos son obligatorios", type: "error" });
        return;
      }

      if (!/^\d+$/.test(form.nit)) {
        setSnack({ open: true, msg: "El NIT debe ser numérico", type: "error" });
        return;
      }

      if (!/^\d+$/.test(form.telefono)) {
        setSnack({ open: true, msg: "El teléfono debe ser numérico", type: "error" });
        return;
      }

      if (form.nombre.length > 50 || form.direccion.length > 50) {
        setSnack({
          open: true,
          msg: "Los campos de texto aceptan máximo 50 caracteres",
          type: "error",
        });
        return;
      }

      // Llamada API según modo
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

  /**
   * Elimina una empresa después de confirmar la acción con el usuario.
   * @param {string} nit - NIT de la empresa a eliminar
   */
  const eliminarEmpresa = async (nit) => {
    if (!(await alertConfirm("¿Seguro que deseas eliminar esta empresa?"))) return;

    try {
      await deleteEmpresa(nit);
      setSnack({ open: true, msg: "Empresa eliminada", type: "success" });
      cargarEmpresas();
    } catch {
      setSnack({ open: true, msg: "Error eliminando empresa", type: "error" });
    }
  };

  /**
   * Columnas del DataGrid.
   * Se memorizan con useMemo para evitar renders innecesarios.
   * Incluye acciones (editar/eliminar) solo para administradores.
   */
  const columns = useMemo(() => {
    const baseColumns = [
      { field: "nit", headerName: "NIT", flex: 1 },
      { field: "nombre", headerName: "Nombre", flex: 1.5 },
      { field: "direccion", headerName: "Dirección", flex: 2 },
      { field: "telefono", headerName: "Teléfono", flex: 1 },
    ];

    if (isAdmin) {
      baseColumns.push({
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
      });
    }

    return baseColumns;
  }, [isAdmin]);

  /**
   * Maneja los cambios del formulario con validación inmediata.
   * @param {string} key - nombre del campo
   * @param {string} value - nuevo valor
   */
  const handleChange = (key, value) => {
    // Campos numéricos
    if (["nit", "telefono"].includes(key)) {
      if (!/^\d*$/.test(value)) return;
    }

    // Máximo de caracteres
    if (["nombre", "direccion"].includes(key)) {
      if (value.length > 50) return;
    }

    setForm({ ...form, [key]: value });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" fontWeight={700} mb={3}>
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
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
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
          {["nit", "nombre", "direccion", "telefono"].map((key) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              error={
                (["nit", "telefono"].includes(key) && form[key] && !/^\d+$/.test(form[key])) ||
                (["nombre", "direccion"].includes(key) && form[key].length > 50)
              }
              helperText={
                ["nit", "telefono"].includes(key)
                  ? "Solo números"
                  : "Máximo 50 caracteres"
              }
            />
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button variant="contained" onClick={crearEditarEmpresa}>
            {isEditing ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

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
