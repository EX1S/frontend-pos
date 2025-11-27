"use client";

import { useRouter } from "next/navigation";

export default function ReportesPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Ventas por Fecha",
      desc: "Consulta las ventas realizadas en un rango.",
      route: "/reportes/ventas",
    },
    {
      title: "Productos más vendidos",
      desc: "Identifica qué productos salen más.",
      route: "/reportes/mas-vendidos",
    },
    {
      title: "Inventario actual",
      desc: "Existencias y alertas de productos bajos.",
      route: "/reportes/inventario",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-red-900 to-red-700 text-white">
      
      <h1 className="text-4xl font-extrabold mb-10">
        Reportes
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">

        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => router.push(card.route)}
            className="
              bg-white/10 backdrop-blur-lg border border-white/20 
              p-6 rounded-2xl shadow-lg cursor-pointer transition 
              transform hover:-translate-y-2 hover:shadow-2xl
              hover:bg-white/20 hover:border-white/40
            "
          >
            <h2 className="text-2xl font-semibold text-white mb-2">
              {card.title}
            </h2>
            <p className="text-gray-300">
              {card.desc}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
