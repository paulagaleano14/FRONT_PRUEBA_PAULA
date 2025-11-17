import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { getEmpresas } from "../services/empresasApi";
import {
  getInventarioPorEmpresa,
  descargarPDF,
  enviarPDFEmail,
} from "../services/inventarioApi";

import { alertSuccess, alertError } from "../js/utils/alerts";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../js/const";

export default function Inventario() {
  const [empresas, setEmpresas] = useState([]);
  const [nitSeleccionado, setNitSeleccionado] = useState("");
  const [inventario, setInventario] = useState([]);
  const [emailModal, setEmailModal] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");

  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    cargarEmpresas();
  }, []);

  /**
   * Carga las empresas desde la API.
   * Si ocurre un error muestra alerta.
   */
  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (err) {
      alertError("Error cargando empresas");
    }
  };

  /**
   * Carga el inventario de una empresa específica.
   * @param {string} nit - NIT seleccionado del dropdown
   */
  const cargarInventario = async (nit) => {
    setNitSeleccionado(nit);

    // Si no se selecciona empresa, limpiar tabla
    if (!nit) {
      setInventario([]);
      return;
    }

    try {
      const data = await getInventarioPorEmpresa(nit);
      setInventario(data);
    } catch (err) {
      alertError("Error cargando inventario");
    }
  };

  /**
   * Genera un PDF del inventario y lo descarga.
   */
  const handlePDF = async () => {
    try {
      const blob = await descargarPDF(nitSeleccionado);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `inventario_${nitSeleccionado}.pdf`;
      a.click();

      alertSuccess("PDF descargado");
    } catch {
      alertError("No se pudo descargar el PDF");
    }
  };

  /**
   * Envía el PDF de inventario por correo.
   */
  const enviarEmail = async () => {
    try {
      if (!emailDestino || emailDestino.trim() === "") {
        setEmailModal(false);
        alertError("El correo es obligatorio");
        return;
      }

      await enviarPDFEmail(emailDestino, nitSeleccionado);
      setEmailModal(false);
      alertSuccess("Correo enviado");
      setEmailDestino("");

    } catch (e) {
      alertError(e.message);
    }
  };

  const columns = [
    { field: "codigo", headerName: "Código", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 2 },
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
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700}>
        Inventario por Empresa
      </Typography>

      {/* Dropdown para seleccionar empresa */}
      <Box mt={2}>
        <select
          className="form-select"
          style={{ width: "300px" }}
          onChange={(e) => cargarInventario(e.target.value)}
        >
          <option value="">Seleccione una empresa</option>
          {empresas.map((emp) => (
            <option key={emp.nit} value={emp.nit}>
              {emp.nombre} ({emp.nit})
            </option>
          ))}
        </select>
      </Box>

      {/* Tabla de inventario */}
      <Box mt={3} height={500}>
        <DataGrid
          rows={inventario}
          columns={columns}
          getRowId={(row) => row.id || crypto.randomUUID()}
          sx={{ background: "white", borderRadius: 2, boxShadow: 3 }}
        />
      </Box>

      {/* Acciones para admin */}
      {isAdmin && nitSeleccionado && (
        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" onClick={handlePDF}>
            📄 Descargar PDF
          </Button>

          <Button variant="outlined" onClick={() => setEmailModal(true)}>
            ✉️ Enviar por Email
          </Button>
        </Box>
      )}

      {/* Modal enviar email */}
      <Dialog open={emailModal} onClose={() => setEmailModal(false)}>
        <DialogTitle>Enviar Inventario por Email</DialogTitle>

        <DialogContent>
          <TextField
            label="Correo destino"
            fullWidth
            margin="dense"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEmailModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={enviarEmail}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
