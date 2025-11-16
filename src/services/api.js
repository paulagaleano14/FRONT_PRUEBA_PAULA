const API_URL = "http://localhost:8080/api";

// ---------------- LOGIN ----------------
export async function loginApi(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error en login");
  }

  return res.json();
}

// ---------------- EMPRESAS ----------------
export async function getEmpresas() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/empresas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error obteniendo empresas");
  }

  return res.json();
}

export async function crearEmpresa(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/empresas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error creando empresa");
  }

  return res.json();
}

export async function deleteEmpresa(nit) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/empresas/${nit}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error eliminando empresa");
  }

  return true;
}

export async function editarEmpresa(nit, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/empresas/${nit}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error editando empresa");
  }

  return res.json();
}
