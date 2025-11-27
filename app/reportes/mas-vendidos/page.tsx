"use client";

import { useState } from "react";

type ProductoMasVendido = {
  nombre: string;
  cantidad_vendida: number;
  total_generado: number;
};

export default function ProductosMasVendidosPage() {
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [productos, setProductos] = useState<ProductoMasVendido[]>([]);
  const [loading, setLoading] = useState(false);

  const obtenerReporte = async () => {
    if (!inicio || !fin) {
      alert("Selecciona ambas fechas.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://backend-pos-production-484f.up.railway.app/api/reportes/mas-vendidos?inicio=${inicio}&fin=${fin}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error(error);
      alert("Error al obtener el reporte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-red-900 to-red-700 text-white">
      <h1 className="text-3xl font-extrabold mb-6">Productos Más Vendidos</h1>

      {/* Filtros */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-lg mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="
                w-full p-3 rounded-lg 
                bg-black/40 
                text-white text-lg 
                focus:outline-none 
                placeholder-white 
                [&::-webkit-calendar-picker-indicator]:invert 
                [&::-webkit-calendar-picker-indicator]:w-7 
                [&::-webkit-calendar-picker-indicator]:h-7
              "
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Fecha Fin</label>
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="
                w-full p-3 rounded-lg 
                bg-black/40 
                text-white text-lg 
                focus:outline-none 
                placeholder-white 
                [&::-webkit-calendar-picker-indicator]:invert 
                [&::-webkit-calendar-picker-indicator]:w-7 
                [&::-webkit-calendar-picker-indicator]:h-7
              "
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={obtenerReporte}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-lg"
            >
              {loading ? "Cargando..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">Resultados</h2>

        {productos.length === 0 ? (
          <p className="text-gray-300">
            No hay productos vendidos en este rango.
          </p>
        ) : (
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="py-2">Producto</th>
                <th className="py-2">Cantidad Vendida</th>
                <th className="py-2">Total Generado</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="py-2">{p.nombre}</td>
                  <td className="py-2">{p.cantidad_vendida}</td>
                  <td className="py-2">${p.total_generado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
