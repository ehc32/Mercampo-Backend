import React, { useState } from "react";
import { toast } from "react-toastify";
import ImageInput from "../components/assets/imageInput/ImageInput";
import 'react-toastify/dist/ReactToastify.css';
import BasicTooltip from "../components/shared/TooltipHelp/Tooltip";
import { post_product } from "../api/products";

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
  const ciudades = ["Neiva"];

  interface Product {
    name: string,
    category: string,
    description: string,
    count_in_stock: number,
    price: number,
    image: string[], // Ahora acepta un arreglo de strings
    map_locate: string,
    locate: string,
    unit: string,
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si todos los campos están completos
    if (
      !nombre ||
      !categoria ||
      !descripcion ||
      !ubicacion ||
      !cantidad ||
      !precio ||
      !unidad ||
      !ubicacionDescriptiva
    ) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    const product: Product = {
      name: nombre,
      category: categoria,
      description: descripcion,
      count_in_stock: parseInt(cantidad),
      price: parseInt(precio),
      image: images, // Asigna el arreglo de imágenes
      map_locate: ubicacionDescriptiva,
      locate: ubicacion,
      unit: unidad,
    };

    try {
      await post_product(product);
      toast.success("Producto agregado exitosamente");

      // Reset fields
      setNombre("");
      setCategoria("");
      setDescripcion("");
      setUbicacion("");
      setCantidad("");
      setPrecio("");
      setUnidad("");
      setUbicacionDescriptiva("");
      setImages([]);
    } catch (error) {
      toast.error("Error al agregar el producto");
    }
  };

  return (
    <div className="flex h-screen  dark:bg-gray-900">
      <div className="w-5/6  flex m-auto  bg-[#F7F7F7] dark:bg-gray-800 rounded-xl  shadow-lg overflow-hidden">
        <div className="w-2/3 p-10 card-bordered">
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
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
                  required
                />
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Categoría</h6>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
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
              onChange={(e) => {
                if (e.target.value.length <= 350) {
                  setDescripcion(e.target.value);
                }
              }}
              placeholder="Ej: Tomate cherry de alta calidad"
              className="w-full p-3 mt-2 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
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
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
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
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
                  required
                />
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  m-1 dark:text-white">Unidad</h6>
                <select
                  id="unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
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
                  className="w-full  p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
                  required
                >
                  <option hidden selected>Selecciona una ubicación</option>
                  {ciudades.map((ciudad, index) => (
                    <option key={index} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <h6 className="text-gray-800  dark:text-white flex-nowrap flex flex-row  ">
                  <p className="m-1">Ubicación descriptiva</p>
                  <BasicTooltip />
                </h6>
                <input
                  type="text"
                  id="ubicacion-descriptiva"
                  value={ubicacionDescriptiva}
                  onChange={(e) => setUbicacionDescriptiva(e.target.value)}
                  placeholder="Ej: Dirección exacta"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:ring-2 focus:ring-[#39A900]"
                  required
                />
              </div>
            </div>

            <h6 className="fs-22px pb-2 text-gray-800 dark:text-white">Agrega hasta 4 imágenes</h6>
            <ImageInput images={images} setImages={setImages} />

            <div className="flex justify-between items-center mt-8">
              <div></div>
              <button
                type="submit"
                className="px-8 py-2 bg-[#39A900] hover:bg-[#2f6d30] text-white rounded-md focus:ring-2 focus:ring-[#39A900]"
              >
                Añadir Producto
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/3 bg-[#39A900] hidden md:block"></div>
      </div>
    </div>
  );
}
export default AddProd;