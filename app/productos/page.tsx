"use client";

import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Producto {
  id: number;
  nombre: string;
  unidad: string;
  precio: number;
  activo: boolean;
  existencia: number;
  actualizado_en: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del modal y modo (nuevo o edición)
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null
  );

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState<"kg" | "pieza">("kg");
  const [precio, setPrecio] = useState<number>(0);
  const [existencia, setExistencia] = useState<number>(0);
  const [activo, setActivo] = useState<boolean>(true);

  // Cargar productos al montar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/productos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar productos");

      setProductos(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para nuevo producto
  const abrirModalNuevo = () => {
    setEditMode(false);
    setProductoEditando(null);
    setNombre("");
    setUnidad("kg");
    setPrecio(0);
    setExistencia(0);
    setActivo(true);
    setShowModal(true);
  };

  // Abrir modal para editar producto
  const abrirModalEditar = (p: Producto) => {
    setEditMode(true);
    setProductoEditando(p);
    setNombre(p.nombre);
    setUnidad(p.unidad as "kg" | "pieza");
    setPrecio(Number(p.precio));
    setExistencia(Number(p.existencia));
    setActivo(p.activo);
    setShowModal(true);
  };

  // Crear o actualizar producto
  const handleGuardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token. Inicia sesión de nuevo.");

      // Normalizar valores numéricos
      const precioNum = Number(precio);
      const existenciaNum = Number(existencia);

      if (isNaN(precioNum) || isNaN(existenciaNum)) {
        throw new Error("Precio y existencia deben ser números válidos.");
      }

      const url = editMode
        ? `${API_URL}/api/productos/${productoEditando?.id}`
        : `${API_URL}/api/productos`;

      const method = editMode ? "PUT" : "POST";

      const body = editMode
        ? {
            nombre: nombre.trim(),
            unidad,
            precio: precioNum,
            existencia: existenciaNum,
            activo,
          }
        : {
            nombre: nombre.trim(),
            unidad,
            precio: precioNum,
            existencia: existenciaNum,
          };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar producto");

      if (editMode) {
        alert("✏️ Producto actualizado correctamente");
        setProductos((prev) =>
          prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
        );
      } else {
        alert("✅ Producto agregado con éxito");
        setProductos((prev) => [...prev, data]);
      }

      setShowModal(false);
    } catch (err) {
      if (err instanceof Error) alert("❌ " + err.message);
      else alert("❌ Error desconocido");
    }
  };

  // Eliminar producto
  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token. Inicia sesión de nuevo.");

      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error al eliminar el producto");

      alert("🗑️ Producto eliminado correctamente");
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (err instanceof Error) alert("❌ " + err.message);
      else alert("❌ Error desconocido");
    }
  };

  // Render: carga o error
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Cargando productos...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );

  // Render principal
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Encabezado y botón */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de productos</h1>

        <button
          onClick={abrirModalNuevo}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-300 bg-white">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Nombre
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Unidad
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Precio
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Existencia
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Activo
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Actualizado
              </th>
              <th className="py-3 px-4 text-center text-gray-700 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition text-sm"
              >
                <td className="py-2 px-4 text-gray-800 whitespace-nowrap">
                  {p.nombre}
                </td>
                <td className="py-2 px-4 text-gray-800">{p.unidad}</td>
                <td className="py-2 px-4 text-gray-800">
                  ${Number(p.precio).toFixed(2)}
                </td>
                <td className="py-2 px-4 text-gray-800">
                  {Number(p.existencia)}
                </td>
                <td className="py-2 px-4">
                  {p.activo ? (
                    <span className="text-green-600 font-semibold">Sí</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  {p.actualizado_en || "-"}
                </td>
                <td className="py-2 px-4 text-center space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => abrirModalEditar(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editMode ? "Editar producto" : "Agregar producto"}
            </h2>

            <form onSubmit={handleGuardar} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 text-blue-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ej. Bistec de res"
                />
              </div>

              {/* Unidad */}
              <div>
                <label className="block text-gray-700 mb-1">Unidad</label>
                <select
                  value={unidad}
                  onChange={(e) =>
                    setUnidad(e.target.value as "kg" | "pieza")
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-blue-900 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="pieza">pieza</option>
                </select>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 text-blue-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {/* Existencia */}
              <div>
                <label className="block text-gray-700 mb-1">Existencia</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={existencia}
                  onChange={(e) => setExistencia(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-blue-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ej. 10"
                />
              </div>

              {/* Activo (solo en edición, pero si quieres también en nuevo, quita la condición) */}
              {editMode && (
                <div className="flex items-center gap-2">
                  <input
                    id="activo"
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="activo" className="text-gray-700">
                    Producto activo
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {editMode ? "Guardar cambios" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}