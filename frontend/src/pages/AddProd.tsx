import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImageInput from "../components/assets/imageInput/ImageInput";
import BasicTooltip from "../components/shared/TooltipHelp/Tooltip";

const AddProd = () => {
  const [images, setImages] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [ubicacionDescriptiva, setUbicacionDescriptiva] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [unidad, setUnidad] = useState("");
  
  const ciudades = [""]
  
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
    images.forEach((imagen, index) => {
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
      setImages([]);
    } catch (error) {
      toast.error("Error al agregar el producto");
    }
  };

  return (
    <div className="flex h-screen  dark:bg-gray-900">
      <div className="w-5/6  flex m-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="w-2/3 p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-normal text-gray-800 dark:text-white">
              Añadir Producto
            </h1>
            <img src="/public/logoSena.png" alt="Logo-sena" className="h-16" />
          </div>

          <form onSubmit={manejarSubmit} className="space-y-6">
            <div className="flex space-x-4 ">
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Nombre del Producto</h6>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Tomate cherry"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Categoría</h6>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option hidden selected>Selecciona una categoría</option>
                  <option value="VERDURAS">Verduras</option>
                  <option value="GRANOS">Granos</option>
                  <option value="FRUTAS">Frutas</option>
                </select>
              </div>
            </div>

            <h6 className="text-gray-800  mx-1 dark:text-white">Descripción del Producto</h6>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Tomate cherry de alta calidad"
              className="w-full p-3 mt-2 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              required
            />

            <div className="flex space-x-4 mt-1">
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Precio</h6>
                <input
                  type="number"
                  id="precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 5000"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Cantidad en Stock</h6>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Ej: 100"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Unidad</h6>
                <select
                  id="unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option hidden selected>Selecciona una unidad</option>
                  <option value="Kg">Kilos</option>
                  <option value="L">Litros</option>
                </select>
              </div>
            </div>

            <h6 className="fs-22px mt-3 text-gray-800 dark:text-white">Agrega una ubicación</h6>
            <div className="flex space-x-4 mt-2">
              <div className="flex-1">
                <h6 className="text-gray-800 m-1 dark:text-white">Ubicación</h6>
                <select
                  id="ubicacion"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full  p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option hidden selected>Selecciona una ubicación</option>
                  {
                    ciudades.map((ciudad, index) => {
                      <option key={index} value={ciudad}>{ciudad}</option>
                    })
                  }
                </select>
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  dark:text-white flex-nowrap flex flex-row  "> <p className="m-1">Ubicación descriptiva</p> <BasicTooltip /> </h6>
                <input
                  type="text"
                  id="ubicacion-descriptiva"
                  value={ubicacionDescriptiva}
                  onChange={(e) => setUbicacionDescriptiva(e.target.value)}
                  placeholder="Ej: Dirección exacta"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h6 className="fs-22px pb-2 text-gray-800 dark:text-white">Agrega hasta 4 imágenes</h6>
            <ImageInput images={images} setImages={setImages} />

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
              alt="AddProductIMG"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProd;
