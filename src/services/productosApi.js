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

  if (!res.ok) throw new Error("Error creando producto");
  return res.json();
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
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error eliminando producto");
}
