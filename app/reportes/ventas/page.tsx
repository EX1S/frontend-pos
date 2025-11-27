"use client";

import { useState } from "react";

type Venta = {
  id: number;
  usuario_id: string;
  total: number;
  creado_en: string;
  fecha: string;
};

export default function ReporteVentasPage() {
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);

  const obtenerReporte = async () => {
    if (!inicio || !fin) {
      alert("Selecciona ambas fechas.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://backend-pos-production-484f.up.railway.app/api/reportes/ventas?inicio=${inicio}&fin=${fin}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setVentas(data.ventas || []);
    } catch (error) {
      console.error(error);
      alert("Error al obtener el reporte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-red-900 to-red-700 text-white">
      <h1 className="text-3xl font-extrabold mb-6">Reporte de Ventas por Fecha</h1>

      {/* FILTROS */}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-lg mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Fecha inicio */}
          <div>
            <label className="block text-sm font-semibold mb-1">Fecha Inicio</label>
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

          {/*Fecha fin*/}
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

          {/*Botón*/}
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

      {/*Resultado*/}
      <div className="bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-lg">
        <h2 className="text-xl font-bold mb-4">Resultados</h2>

        {ventas.length === 0 ? (
          <p className="text-gray-300">No hay ventas en este rango.</p>
        ) : (
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="py-2">ID Venta</th>
                <th className="py-2">Fecha</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>

            <tbody>
              {ventas.map((v, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="py-2">{v.id}</td>
                  <td className="py-2">{v.fecha}</td>
                  <td className="py-2">${v.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
