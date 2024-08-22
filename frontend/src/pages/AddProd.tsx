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
    <div className="max-w-4xl mx-auto p-6 dark:bg-gray-800 bg-white text-white dark:text-black rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Añadir Producto</h2>
      <form onSubmit={manejarSubmit} className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="nombre" className="block text-sm font-medium">
            Nombre del Producto
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 p-2 block w-full dark:bg-gray-700 bg-white dark:text-white text-black rounded-md border dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="categoria" className="block text-sm font-medium">
            Categoría
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1 p-2 block w-full bg-gray-700 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="VERDURAS">Verduras</option>
            <option value="FRUTAS">Frutas</option>
            <option value="CEREALES">Cereales</option>
            <option value="LACTEOS">Lácteos</option>
            {/* Agrega más opciones según sea necesario */}
          </select>
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="descripcion" className="block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 p-2 block w-full bg-gray-700 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="ubicacion" className="block text-sm font-medium">
            Ubicación
          </label>
          <select
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="mt-1 p-2 block w-full dark:bg-gray-700 bg-white dark:text-white text-black rounded-md border dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="Neiva">Neiva</option>
            <option value="Cali">Cali</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Bogotá">Campotriste</option>
            <option value="Medellín">Palermo</option>
            {/* Agrega más opciones según sea necesario */}
          </select>
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="cantidad" className="block text-sm font-medium">
            Cantidad en Stock
          </label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="mt-1 p-2 block w-full dark:bg-gray-700 bg-white dark:text-white text-black rounded-md border dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="precio" className="block text-sm font-medium">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="mt-1 p-2 block w-full dark:bg-gray-700 bg-white dark:text-white text-black rounded-md border dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label htmlFor="unidad" className="block text-sm font-medium">
            Unidad
          </label>
          <select
            id="unidad"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className="mt-1 p-2 block w-full dark:bg-gray-700 bg-white dark:text-white text-black rounded-md border dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="Kilos">Kilos</option>
            <option value="Gramos">Gramos</option>
            <option value="Miligramos">Arroba</option>
            <option value="Miligramos">Tonelada</option>

            {/* Agrega más opciones según sea necesario */}
          </select>
        </div>

        <div className="w-full px-3 mb-6">
          <label htmlFor="imagenes" className="block text-sm font-medium">
            Imágenes del Producto (Máximo 4)
          </label>
          <input
            type="file"
            id="imagenes"
            onChange={manejarCambioArchivos}
            multiple
            accept="image/*"
            className="mt-1 block w-full text-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-lime-600 hover:bg-#3e8e41 rounded-md font-semibold text-white"
        >
          Añadir Producto
        </button>
      </form>
    </div>
  );
};

export default AddProd;
