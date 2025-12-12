"use client";

import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  unidad: string;
  precio: number | string;
  existencia: number;
}

interface ItemVenta {
  id: number;
  nombre: string;
  unidad: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function VentasPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const [precioModal, setPrecioModal] = useState(0);
  const [cantidadModal, setCantidadModal] = useState(0);
  const [importeModal, setImporteModal] = useState(0);
  const [ultimoEditado, setUltimoEditado] = useState<
    "precio" | "cantidad" | "importe" | null
  >(null);

  // 🔥 Corrección importante: NO fallback a localhost.
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  // Cargar productos
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/productos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setProductos(data);
      } catch (e) {
        console.error("Error cargando productos", e);
      }
    };
    cargar();
  }, [API_URL]);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarProducto = (p: Producto) => {
    setProductoSeleccionado(p);

    const precioInicial = Number(p.precio);
    setPrecioModal(precioInicial);
    setCantidadModal(1.0);
    setImporteModal(Number((precioInicial * 1).toFixed(2)));

    setUltimoEditado(null);
    setShowModal(true);
  };

  useEffect(() => {
    if (!ultimoEditado) return;

    if (ultimoEditado === "precio" || ultimoEditado === "cantidad") {
      setImporteModal(Number((precioModal * cantidadModal).toFixed(2)));
    }

    if (ultimoEditado === "importe") {
      if (precioModal > 0) {
        setCantidadModal(Number((importeModal / precioModal).toFixed(3)));
      }
    }
  }, [precioModal, cantidadModal, importeModal, ultimoEditado]);

  const confirmarProducto = () => {
    if (!productoSeleccionado) return;

    setCarrito([
      ...carrito,
      {
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        unidad: productoSeleccionado.unidad,
        precio: precioModal,
        cantidad: cantidadModal,
        subtotal: importeModal,
      },
    ]);

    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const eliminarItem = (id: number) => {
    setCarrito(carrito.filter((i) => i.id !== id));
  };

  useEffect(() => {
    const t = carrito.reduce((sum, i) => sum + i.subtotal, 0);
    setTotal(t);
  }, [carrito]);

  // 🔥 Registrar venta (sin cambios, solamente usando el API_URL corregido)
  const registrarVenta = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: carrito.map((i) => ({
            producto_id: i.id,
            cantidad: i.cantidad,
            precio: i.precio,
          })),
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar la venta");

      alert("✅ Venta registrada con éxito");
      setCarrito([]);
      setTotal(0);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar venta</h1>

      {/* BUSCADOR */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-1/2 border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
        />
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="overflow-x-auto mb-8 shadow rounded-xl border border-gray-300 bg-white">
        <table className="min-w-full text-gray-800">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Unidad</th>
              <th className="py-2 px-4 text-left">Precio</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{p.nombre}</td>
                <td className="py-2 px-4">{p.unidad}</td>
                <td className="py-2 px-4">${Number(p.precio).toFixed(2)}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => agregarProducto(p)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARRITO */}
      <h2 className="text-2xl font-bold mb-3 text-gray-800">Carrito</h2>
      <div className="overflow-x-auto shadow rounded-xl border border-gray-300 bg-white">
        <table className="min-w-full text-gray-800">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Producto</th>
              <th className="py-2 px-4 text-left">Cantidad</th>
              <th className="py-2 px-4 text-left">Precio</th>
              <th className="py-2 px-4 text-left">Subtotal</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.nombre}</td>
                <td className="py-2 px-4">{item.cantidad.toFixed(3)}</td>
                <td className="py-2 px-4">${item.precio.toFixed(2)}</td>
                <td className="py-2 px-4">${item.subtotal.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => eliminarItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="flex justify-end items-center mt-6 gap-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Total: ${total.toFixed(2)}
        </h2>
        <button
          onClick={registrarVenta}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Registrar venta
        </button>
      </div>

      {/* MODAL */}
      {showModal && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[380px] text-gray-800">
            <h2 className="text-xl font-bold mb-4">
              Agregar {productoSeleccionado.nombre}
            </h2>

            {/* Precio */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Precio por unidad
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={precioModal}
                  onChange={(e) => {
                    setPrecioModal(Number(e.target.value));
                    setUltimoEditado("precio");
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 pl-6 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Cantidad */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Cantidad ({productoSeleccionado.unidad})
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={cantidadModal}
                onChange={(e) => {
                  setCantidadModal(Number(e.target.value));
                  setUltimoEditado("cantidad");
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Importe */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Importe total</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={importeModal}
                  onChange={(e) => {
                    setImporteModal(Number(e.target.value));
                    setUltimoEditado("importe");
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 pl-6 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarProducto}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
