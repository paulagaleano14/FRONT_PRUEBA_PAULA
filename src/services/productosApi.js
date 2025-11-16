const API_URL = "http://localhost:8080/api";

export async function crearProducto(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  let errorBody;
  try {
    errorBody = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(errorBody?.message || "Error creando producto");
  }

  return errorBody;
}


export async function getProductos() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/productos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error obteniendo productos");
  return res.json();
}

export async function editarProducto(id, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  let errorBody;
  try {
    errorBody = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(errorBody?.message || "Error creando producto");
  }

  return errorBody; // si sí fue OK es el producto
}

export async function getProductosPorEmpresa(nit) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/productos/empresa/${nit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error obteniendo productos");
  return res.json();
}

export async function deleteProducto(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error eliminando producto");
  }
}
