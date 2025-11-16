import { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getProductosPorEmpresa, crearProducto, deleteProducto } from "../services/productosApi";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { ROLES } from '../js/const';
import { alertError } from '../js/utils/alerts';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    caracteristicas: "",
    precios: { COP: 0, USD: 0, EUR: 0 },
    empresaNIT: "",
  });

  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    if (user?.empresaNIT) loadProductos(user.empresaNIT);
  }, [user]);

  const loadProductos = async (nit) => {
    try {
      const data = await getProductosPorEmpresa(nit);
      setProductos(data);
    } catch (e) {
      console.error("Error cargando productos:", e);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Eliminar producto",
      text: "¿Seguro que deseas eliminar este producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteProducto(id);
      loadProductos(form.empresaNIT);
    } catch (e) {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  const handleCreate = async () => {
    try {
      await crearProducto({
        ...form,
        precios: {
          COP: parseFloat(form.precios.COP),
          USD: parseFloat(form.precios.USD),
          EUR: parseFloat(form.precios.EUR),
        },
      });

      Swal.fire("Éxito", "Producto creado", "success");
      setOpen(false);
      loadProductos(form.empresaNIT);
    } catch (e) {
      setOpen(false);
      console.log(e);
      
      alertError(e.message)
    }
  };

  const columns = [
    { field: "codigo", headerName: "Código", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "caracteristicas", headerName: "Características", flex: 2 },
    {
      field: "precios",
      headerName: "Precios",
      flex: 2,
      renderCell: ({ row }) =>
        `COP: ${row.precios.COP} | USD: ${row.precios.USD} | EUR: ${row.precios.EUR}`,
    },
    isAdmin && {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <Button variant="outlined" color="warning" size="small">Editar</Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ ml: 1 }}
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </Button>
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Productos</Typography>

      {isAdmin && (
        <Button variant="contained" onClick={() => setOpen(true)}>
          ➕ Crear Producto
        </Button>
      )}

      <Box mt={3} style={{ height: 500 }}>
        <DataGrid rows={productos} columns={columns} pageSize={10} />
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          p: 4,
          backgroundColor: "white",
          width: 400,
          margin: "100px auto",
          borderRadius: 2,
        }}>
          <Typography variant="h6" gutterBottom>Crear Producto</Typography>

          <TextField
            label="Código"
            fullWidth
            margin="normal"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          />
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <TextField
            label="Características"
            fullWidth
            margin="normal"
            onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Precios:</Typography>
          <TextField
            label="COP"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) =>
              setForm({ ...form, precios: { ...form.precios, COP: e.target.value } })
            }
          />
          <TextField
            label="USD"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) =>
              setForm({ ...form, precios: { ...form.precios, USD: e.target.value } })
            }
          />
          <TextField
            label="EUR"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) =>
              setForm({ ...form, precios: { ...form.precios, EUR: e.target.value } })
            }
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCreate}
          >
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
