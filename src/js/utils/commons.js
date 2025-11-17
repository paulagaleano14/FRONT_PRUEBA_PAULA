/**
 * Valida los datos del formulario de productos.
 * @param {Object} form - Objeto con los datos del formulario.
 * @returns {string|null} Mensaje de error o null si todo es válido.
 */
export const validarProducto = (form) => {
  if (!form.codigo || !form.nombre || !form.caracteristicas || !form.empresaNIT) {
    return "Todos los campos son obligatorios";
  }

  // Texto límites
  if (form.codigo.length > 20) return "El código no puede superar 20 caracteres";
  if (form.nombre.length > 50) return "El nombre no puede superar 50 caracteres";
  if (form.caracteristicas.length > 200) return "Las características no pueden superar 200 caracteres";

  // Empresa NIT (solo números)
  if (!/^\d+$/.test(form.empresaNIT)) return "El NIT debe contener solo números";
  if (form.empresaNIT.length > 15) return "El NIT no puede superar 15 dígitos";

  // Precios
  const precios = form.precios;

  if (!/^\d+(\.\d+)?$/.test(precios.COP)) return "El precio COP debe ser un número válido";
  if (!/^\d+(\.\d+)?$/.test(precios.USD)) return "El precio USD debe ser un número válido";
  if (!/^\d+(\.\d+)?$/.test(precios.EUR)) return "El precio EUR debe ser un número válido";

  return null;
};
