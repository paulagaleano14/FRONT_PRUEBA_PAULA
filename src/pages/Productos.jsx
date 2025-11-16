import { useEffect, useState } from "react";
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

import {
  getProductos,
  crearProducto,
  deleteProducto,
  editarProducto,
} from "../services/productosApi";

import { useAuth } from "../context/AuthContext";
import { ROLES } from "../js/const";
import { alertConfirm } from "../js/utils/alerts";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    codigo: "",
    nombre: "",
    caracteristicas: "",
    empresaNIT: "",
    precios: { COP: 0, USD: 0, EUR: 0 }
  });

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      const rows = data.map((p) => ({
        id: p.id ?? crypto.randomUUID(),
        ...p,
      }));
      setProductos(rows);
    } catch (err) {
      setSnack({ open: true, msg: "Error cargando productos", type: "error" });
    }
  };

  const abrirCrear = () => {
    setForm({
      id: null,
      codigo: "",
      nombre: "",
      caracteristicas: "",
      empresaNIT: "",
      precios: { COP: 0, USD: 0, EUR: 0 },
    });
    setIsEditing(false);
    setOpen(true);
  };

  const abrirEditar = (row) => {
    setIsEditing(true);
    setForm({
      id: row.id,
      codigo: row.codigo,
      nombre: row.nombre,
      caracteristicas: row.caracteristicas,
      empresaNIT: row.empresaNIT,
      precios: {
        COP: row.precios.COP,
        USD: row.precios.USD,
        EUR: row.precios.EUR
      }
    });
    setOpen(true);
  };

  const crearEditarProducto = async () => {
    try {
      const payload = {
        codigo: form.codigo,
        nombre: form.nombre,
        caracteristicas: form.caracteristicas,
        empresaNIT: form.empresaNIT,
        precios: {
          COP: Number(form.precios.COP),
          USD: Number(form.precios.USD),
          EUR: Number(form.precios.EUR),
        },
      };

      if (isEditing) {
        await editarProducto(form.id, payload);
        setSnack({ open: true, msg: "Producto actualizado", type: "success" });
      } else {
        await crearProducto(payload);
        setSnack({ open: true, msg: "Producto creado", type: "success" });
      }

      setOpen(false);
      cargarProductos();
    } catch (err) {
      setSnack({ open: true, msg: err.message, type: "error" });
    }
  };

  const cerrarModal = () => {
    setOpen(false);
  };

  const eliminarProducto = async (id) => {
    const confirmado = await alertConfirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmado) return;

    try {
      await deleteProducto(id);
      setSnack({ open: true, msg: "Producto eliminado", type: "success" });
      cargarProductos();
    } catch (err) {
      setSnack({ open: true, msg: "Error eliminando producto", type: "error" });
    }
  };

  const columns = [
    { field: "codigo", headerName: "Código", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "caracteristicas", headerName: "Características", flex: 2 },
    {
      field: "precios",
      headerName: "Precios",
      flex: 2,
      renderCell: (params) => {
        const px = params.row.precios;
        return `COP: ${px?.COP} | USD: ${px?.USD} | EUR: ${px?.EUR}`;
      },
    },
    {
      field: "empresaNIT",
      headerName: "Empresa (NIT)",
      flex: 1,
    },

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

              <IconButton color="error" onClick={() => eliminarProducto(params.row.id)}>
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
        Listado de Productos
      </Typography>

      {isAdmin && (
        <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={abrirCrear}>
          Crear Producto
        </Button>
      )}

      <DataGrid
        rows={productos}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        sx={{ background: "white", boxShadow: 3, borderRadius: 2 }}
      />

      <Dialog open={open} onClose={cerrarModal}>
        <DialogTitle>{isEditing ? "Editar Producto" : "Crear Producto"}</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

          <TextField
            label="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          />

          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <TextField
            label="Características"
            value={form.caracteristicas}
            onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
          />

          <Typography fontWeight={600}>Precios</Typography>

          <TextField
            label="COP"
            type="number"
            value={form.precios.COP}
            onChange={(e) =>
              setForm({ ...form, precios: { ...form.precios, COP: e.target.value } })
            }
          />

          <TextField
            label="USD"
            type="number"
            value={form.precios.USD}
            onChange={(e) =>
              setForm({ ...form, precios: { ...form.precios, USD: e.target.value } })
            }
          />

          <TextField
            label="EUR"
            type="number"
            value={form.precios.EUR}
            onChange={(e) =>
              setForm({ ...form, precios: { ...form.precios, EUR: e.target.value } })
            }
          />

          <TextField
            label="Empresa (NIT)"
            value={form.empresaNIT}
            onChange={(e) => setForm({ ...form, empresaNIT: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button variant="contained" onClick={crearEditarProducto}>
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
