import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddProd = () => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [unidad, setUnidad] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);

  const manejarCambioArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files).slice(0, 4); // Limitar a 4 imágenes
      setImagenes(fileArray);
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("categoria", categoria);
    formData.append("descripcion", descripcion);
    formData.append("ubicacion", ubicacion);
    formData.append("cantidad", cantidad);
    formData.append("precio", precio);
    formData.append("unidad", unidad);
    imagenes.forEach((imagen, index) => {
      formData.append(`imagen${index + 1}`, imagen);
    });

    try {
      await axios.post("/api/productos/agregar", formData);
      toast.success("Producto agregado exitosamente");

      // Reset fields
      setNombre("");
      setCategoria("VERDURAS");
      setDescripcion("");
      setUbicacion("Neiva");
      setCantidad("");
      setPrecio("");
      setUnidad("Kilos");
      setImagenes([]);
    } catch (error) {
      toast.error("Error al agregar el producto");
    }
  };

  return (
    <div className="flex h-screen  dark:bg-gray-900">
      <div className="w-11/12 max-w-7xl flex m-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="w-2/3 p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-normal text-gray-800 dark:text-white">
              Añadir Producto
            </h1>
            <img src="logo" alt="Logo-sena" className="h-10" />
          </div>

          <form onSubmit={manejarSubmit} className="space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del Producto"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="VERDURAS">Verduras</option>
                  <option value="FRUTAS">Frutas</option>
                  <option value="CEREALES">Cereales</option>
                  <option value="LACTEOS">Lácteos</option>
                </select>
              </div>
            </div>

            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
              className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              required
            />

            <div className="flex space-x-4">
              <div className="flex-1">
                <select
                  id="ubicacion"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una ubicación</option>
                  <option value="Neiva">Neiva</option>
                  <option value="Cali">Cali</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Campotriste">Campotriste</option>
                  <option value="Palermo">Palermo</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Cantidad en Stock"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  id="precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder= "$ Precio"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <select
                  id="unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una unidad</option>
                  <option value="Kilos">Kilos</option>
                  <option value="Gramos">Gramos</option>
                  <option value="Arroba">Arroba</option>
                  <option value="Tonelada">Tonelada</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="imagenes"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Imágenes del Producto (Máximo 4)
              </label>
              <input
                type="file"
                id="imagenes"
                onChange={manejarCambioArchivos}
                multiple
                accept="image/*"
                className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center mt-8">
              <a href="#" className="text-blue-500 hover:underline">
                Ayuda
              </a>
              <button
                type="submit"
                className="px-8 py-3 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
              >
                Añadir Producto
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/3 bg-lime-600 flex items-center justify-center p-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src=""
              alt="Ppp"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProd;
