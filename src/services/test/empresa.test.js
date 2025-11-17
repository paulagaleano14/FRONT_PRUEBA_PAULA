import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getEmpresas,
  crearEmpresa,
  editarEmpresa,
  deleteEmpresa,
  loginApi
} from "../api";

import { URL } from "../../js/const";

const API_URL = URL + "/api";

// --- MOCKS GLOBALES ---
beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

// Mock del fetch global
global.fetch = vi.fn();


describe("loginApi()", () => {
  it("debe enviar email y password y devolver JSON", async () => {
    const mockResponse = { token: "abc123" };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await loginApi("test@example.com", "1234");

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "1234" })
    });

    expect(result).toEqual(mockResponse);
  });

  it("debe lanzar error si el login falla", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Credenciales inválidas" })
    });

    await expect(loginApi("a@a.com", "x")).rejects.toThrow("Credenciales inválidas");
  });
});

describe("getEmpresas()", () => {
  it("debe obtener empresas con el token", async () => {
    const mockEmpresas = [
      { nit: "1", nombre: "Empresa Uno" }
    ];

    localStorage.setItem("token", "TEST_TOKEN");

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEmpresas)
    });

    const result = await getEmpresas();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/empresas`, {
      headers: { Authorization: "Bearer TEST_TOKEN" }
    });

    expect(result).toEqual(mockEmpresas);
  });

  it("debe lanzar error si la API devuelve error", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Error obteniendo empresas" })
    });

    await expect(getEmpresas()).rejects.toThrow("Error obteniendo empresas");
  });
});

describe("crearEmpresa()", () => {
  it("debe enviar POST con token y devolver json", async () => {
    const body = { nit: "999", nombre: "Nueva SA" };
    const mockResponse = { ok: true };

    localStorage.setItem("token", "ABC123");

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await crearEmpresa(body);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/empresas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ABC123"
      },
      body: JSON.stringify(body)
    });

    expect(result).toEqual(mockResponse);
  });

  it("debe lanzar error si la creación falla", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Error creando empresa" })
    });

    await expect(crearEmpresa({})).rejects.toThrow("Error creando empresa");
  });
});
describe("editarEmpresa()", () => {
  it("debe enviar PUT con token", async () => {
    const nit = "123";
    const body = { nombre: "EDITADA" };
    const mockResponse = { updated: true };

    localStorage.setItem("token", "TTT");

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await editarEmpresa(nit, body);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/empresas/${nit}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer TTT"
      },
      body: JSON.stringify(body)
    });

    expect(result).toEqual(mockResponse);
  });

  it("debe lanzar error si falla el update", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Error editando empresa" })
    });

    await expect(editarEmpresa("1", {})).rejects.toThrow("Error editando empresa");
  });
});

describe("deleteEmpresa()", () => {
  it("debe enviar DELETE con token y devolver true", async () => {
    localStorage.setItem("token", "XYZ");

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    });

    const result = await deleteEmpresa("123");

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/empresas/123`, {
      method: "DELETE",
      headers: { Authorization: "Bearer XYZ" }
    });

    expect(result).toBe(true);
  });


  it("debe lanzar error si la API responde error", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Error eliminando empresa" })
    });

    await expect(deleteEmpresa("1")).rejects.toThrow("Error eliminando empresa");
  });
});



