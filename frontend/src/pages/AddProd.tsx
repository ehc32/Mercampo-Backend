import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { post_product } from "../api/products";
import ImageInput from "../components/assets/imageInput/ImageInput";
import BasicTooltip from "../components/shared/tooltip/TooltipHelp";
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

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
  const [tiempoL, setTiempoL] = useState<number>();
  const ciudades = ["Neiva", "Pitalito", "Garzón", "La Plata", "San Agustín", "Acevedo", "Campoalegre", "Yaguará", "Gigante", "Paicol", "Rivera", "Aipe", "Villavieja", "Tarqui", "Timaná", "Palermo"];


  interface Product {
    name: string,
    category: string,
    description: string,
    count_in_stock: number,
    price: number,
    image: string[],
    map_locate: string,
    locate: string,
    unit: string,
    tiempoL: number
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !categoria || !descripcion || !ubicacion || !cantidad || !precio || !unidad || !tiempoL || !ubicacionDescriptiva) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    const product: Product = {
      name: nombre,
      category: categoria,
      description: descripcion,
      count_in_stock: parseInt(cantidad),
      price: parseInt(precio),
      image: images,
      map_locate: ubicacionDescriptiva,
      locate: ubicacion,
      unit: unidad,
      tiempoL: tiempoL,
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
      setTiempoL(0);
      setImages([]);
    } catch (error) {
      toast.error("Error al agregar el producto");
    }
  };

  return (
    <div className="flex my-2">
      <div className="w-full md:w-4/6 flex m-auto dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="w-full p-4 md:p-10 card-bordered">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl text-black font-bold dark:text-white">
              Añadir Producto
            </h1>
            <img src="/public/logoSena.png" alt="Logo-sena" className="h-12 md:h-16" />
          </div>

          <form onSubmit={manejarSubmit} className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <h6 className="text-black font-bold m-1 dark:text-white">Nombre del Producto</h6>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  placeholder="Ej: Tomate cherry"
                  className="w-full p-3 border dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black focus:outline-none"
                  required
                />
              </div>

              <div className="flex-1">
                <h6 className="text-black font-bold m-1 dark:text-white">Categoria</h6>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    displayEmpty
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#39A900',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>Selecciona una categoría</MenuItem>
                    <MenuItem value="VERDURAS">Verduras</MenuItem>
                    <MenuItem value="FRUTAS">Frutas</MenuItem>
                    <MenuItem value="GRANOS">Grano</MenuItem>
                    <MenuItem value="UNIDAD">Unidad</MenuItem>
                    <MenuItem value="OTROS">Otros</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <h6 className="text-black font-bold mx-1 dark:text-white">Descripción del Producto</h6>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => {
                if (e.target.value.length <= 350) {
                  setDescripcion(e.target.value);
                }
              }}
              placeholder="Ej: Tomate cherry de alta calidad"
              className="resize-none w-full p-3 mt-2 border focus:outline-none dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black"
              rows={4}
              required
            />

            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <h6 className="text-black font-bold m-1 dark:text-white">Precio</h6>
                <input
                  type="number"
                  id="precio"
                  value={precio}
                  onChange={(e) => setPrecio(Math.max(0, Number(e.target.value)).toString())}
                  placeholder="Ej: 5000"
                  className="w-full p-3 border focus:outline-none dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black"
                  min="0"
                  required
                />
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <h6 className="text-black font-bold m-1 dark:text-white">Cantidad en Stock</h6>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(0, Number(e.target.value)).toString())}
                  placeholder="Ej: 100"
                  className="w-full p-3 border focus:outline-none dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black"
                  min="0"
                  required
                />
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <h6 className="text-black font-bold m-1 dark:text-white">Unidad</h6>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    required
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#39A900',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>Selecciona una unidad</MenuItem>
                    <MenuItem value="Kg">Kilos</MenuItem>
                    <MenuItem value="L">Litros</MenuItem>
                    <MenuItem value="U">Unidades</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex-1">
                <h6 className="text-black font-bold m-1 dark:text-white">Tiempo de publicación</h6>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={tiempoL}
                    onChange={(e) => setTiempoL(e.target.value)}
                    required
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#39A900',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>Selecciona un tiempo limite</MenuItem>
                    {/* <MenuItem value={0}>1 semana</MenuItem> */}
                    <MenuItem value={1}>2 semanas</MenuItem>
                    <MenuItem value={2}>3 semanas</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <h6 className="fs-22px mt-3 text-black font-bold dark:text-white">Agrega una ubicación</h6>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <h6 className="text-black font-bold m-1 dark:text-white">Ubicación</h6>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    required
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#39A900',
                      }
                    }}
                  >
                    <MenuItem value="" disabled>Selecciona una ubicación</MenuItem>
                    {ciudades.map((ciudad, index) => (
                      <MenuItem key={index} value={ciudad}>
                        {ciudad}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex-1">
                <h6 className="text-black font-bold dark:text-white flex flex-row items-center">
                  <span className="m-1">Ubicación descriptiva</span>
                  <BasicTooltip />
                </h6>
                <input
                  type="text"
                  id="ubicacion-descriptiva"
                  value={ubicacionDescriptiva}
                  onChange={(e) => setUbicacionDescriptiva(e.target.value)}
                  placeholder="Ej: Dirección exacta"
                  className="w-full p-3 border focus:outline-none dark:border-gray-600 border-gray-300 rounded-md dark:bg-gray-700 bg-white dark:text-white text-black"
                  required
                />
              </div>
            </div>

            <h6 className="fs-22px pb-2 text-black font-bold dark:text-white">Agrega hasta 4 imágenes</h6>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <ImageInput images={images} setImages={setImages} />
              <button
                type="submit"
                className="px-8 py-2 mt-4 md:mt-0 bg-[#39A900] hover:bg-[#2f6d30] text-white rounded-md"
              >
                Añadir Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProd;