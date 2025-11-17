const API_URL = "http://localhost:8080/api/inventario";

export async function getInventarioPorEmpresa(nit) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${nit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error obteniendo inventario");
  }

  return res.json();
}

export async function descargarPDF(nit) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${nit}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error descargando PDF");
  }

  const blob = await res.blob();
  return blob;
}

export async function enviarPDFEmail(emailDestino, empresaNIT) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      emailDestino,
      empresaNIT
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res.text();
}


