"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MenuPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifySession = () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.push("/login");
      } else {
        setHasSession(true);
      }
      setIsChecking(false);
    };

    const timeout = setTimeout(verifySession, 0);
    return () => clearTimeout(timeout);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (isChecking) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gray-100">

        {/* Niebla elegante */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.08),transparent_60%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,0,0.08),transparent_60%)] animate-pulse"></div>

        <p className="text-gray-700 relative z-10">Verificando sesión...</p>
      </div>
    );
  }

  if (!hasSession) return null;

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden px-4 bg-gray-100">

      {/*Fondo*/}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.08),transparent_60%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,0,0.08),transparent_60%)] animate-pulse"></div>

      {/*Logo*/}
      <div className="bg-white p-4 rounded-full shadow-lg mb-4 relative z-10">
        <Image
          src="/logo.png"
          width={160}
          height={160}
          alt="Logo Carnicería"
          className="rounded-full"
        />
      </div>

      <h1 className="text-4xl font-extrabold mb-10 text-gray-800 tracking-wide relative z-10">
        Menú principal
      </h1>

      {/*Botones*/}
      <div className="flex flex-col items-center gap-6 relative z-10">

        <div className="grid grid-cols-2 gap-6">
          {/*Productos*/}
          <button
            onClick={() => router.push("/productos")}
            className="bg-red-600 text-white font-bold py-5 px-10 rounded-2xl shadow-xl
            hover:bg-red-700 transform hover:scale-105 hover:-translate-y-1 transition"
          >
            Productos
          </button>

          {/*Ventas*/}
          <button
            onClick={() => router.push("/ventas")}
            className="bg-green-600 text-white font-bold py-5 px-10 rounded-2xl shadow-xl
            hover:bg-green-700 transform hover:scale-105 hover:-translate-y-1 transition"
          >
            Ventas
          </button>
        </div>

        {/*Reportes*/}
        <button
          onClick={() => router.push("/reportes")}
          className="bg-yellow-500 w-[260px] text-white font-bold py-5 px-10 rounded-2xl shadow-xl 
          hover:bg-yellow-600 transform hover:scale-105 hover:-translate-y-1 transition"
        >
          Reportes
        </button>
      </div>

      {/*Cerrar sesión*/}
      <button
        onClick={handleLogout}
        className="mt-12 bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl shadow hover:bg-gray-900 transition relative z-10"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
