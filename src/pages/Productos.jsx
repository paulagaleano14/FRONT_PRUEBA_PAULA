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
import {validarProducto} from "../js/utils/commons";

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

  /**
   * Carga los productos desde la API y los inserta en la tabla.
   * - Obtiene la lista mediante getProductos()
   * - Asegura que cada producto tenga un ID válido (fallback a crypto.randomUUID)
   * - Actualiza el estado local con el listado formateado
   * - Si ocurre un error, notifica al usuario mediante Snackbar
  */
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

  /**
   * Abre el modal para crear un nuevo producto.
   * - Limpia el formulario
   * - Desactiva el modo edición
   * - Abre el dialog
  */
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

  /**
   * Abre el modal en modo edición.
   * @param {Object} row - Fila seleccionada del DataGrid
   * - Llena el formulario con la información del producto
   * - Activa el modo edición
   * - Abre el modal
  */
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

  /**
   * Valida el formulario y crea o edita un producto.
   * - Utiliza validarProducto() para validar campos
   * - Construye el payload con precios numéricos
   * - Si isEditing = true → actualiza
   * - Si isEditing = false → crea
   * - Muestra snackbar de éxito o error
   * - Recarga el listado de productos
  */
  const crearEditarProducto = async () => {
    try {
      const error = validarProducto(form);
      if (error) {
        setSnack({ open: true, msg: error, type: "error" });
        return;
      }

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

  /**
   * Cierra el diálogo de creación/edición de producto.
  */
  const cerrarModal = () => {
    setOpen(false);
  };

  /**
   * Elimina un producto después de confirmación.
   * @param {number|string} id - ID del producto a eliminar
   * - Solicita confirmación mediante alertConfirm()
   * - Realiza la eliminación mediante deleteProducto()
   * - Muestra mensaje de éxito o error
   * - Recarga el listado de productos
  */
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
