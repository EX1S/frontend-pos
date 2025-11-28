"use client";

import { useState, useEffect } from "react";

type ItemInventario = {
  id: number;
  nombre: string;
  precio: number;
  existencia: number;
};

export default function InventarioActualPage() {
  const [items, setItems] = useState<ItemInventario[]>([]);
  const [loading, setLoading] = useState(true);

  // MISMA CONFIGURACIÓN QUE EN PRODUCTOS
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const obtenerInventario = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reportes/inventario`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setItems(data.inventario || []);
    } catch (error) {
      console.error(error);
      alert("Error al obtener el inventario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-red-900 to-red-700 text-white">
      <h1 className="text-3xl font-extrabold mb-6">Inventario Actual</h1>

      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>

        {loading ? (
          <p className="text-gray-300">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-300">No hay productos en inventario.</p>
        ) : (
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="py-2">Producto</th>
                <th className="py-2">Existencia</th>
                <th className="py-2">Precio</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/10 ${
                    item.existencia <= 5 ? "bg-red-800/40" : ""
                  }`}
                >
                  <td className="py-2">{item.nombre}</td>
                  <td className="py-2">{item.existencia}</td>
                  <td className="py-2">${item.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
