import Pagination from '@mui/material/Pagination';
import {
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { delete_product, get_all_products_paginated } from "../api/products";
import { get_solo_user } from "../api/users";
import SearchIcon from '@mui/icons-material/Search';
import './style.css';
import { Box, IconButton, Modal } from '@mui/material';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  results: any;
}

const Products = ({ results }: Props) => {
  const [page, setPage] = useState(1);
  const [dataLenght, setDataLenght] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [dataUser, setDataUser] = useState<any[]>([]);
  let contador = 0

  const handleOpenModal = async (user: any) => {
    try {
      const response = await get_solo_user(user)

      setDataUser(response)
      toast.success('Usuario cargado con éxito');
    } catch (e) {
      toast.error('Error al cargar al usuario');
    }
    setModalOpen(true);
  };



  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const fetchProductos = async (page: number) => {
    try {
      const productosAPI = await get_all_products_paginated(page);
      setData(productosAPI.data);
      setDataLenght(productosAPI.meta.count)
      contador++
      if (contador == 2) {
        toast.success('Productos cargados con éxito');
        contador = 0
      }
    } catch (error) {
      toast.error('Error al cargar los productos');
    }
  };


  useEffect(() => {

    fetchProductos(page);

  }, [page])

  const updateProduct = async (id: number) => {
    try {
      await updateProduct(id)
      toast.success('Producto actualizado con éxito!');
    } catch (e) {
      toast.error('Error al actualizar el producto');
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      await delete_product(id);
      toast.success('Producto eliminado con éxito!');
      queryClient.invalidateQueries(["products"]);
      fetchProductos(page);
    } catch (e: any) {
      toast.error('Error al eliminar el producto');
    }
  };

  function formatearFecha(fechaISO: any) {
    const fecha = new Date(fechaISO);
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const year = fecha.getFullYear();

    return `${dia} de ${mes} del ${year}`;
  }

  return (
    <div className="overflow-x-auto scroll-tablas">
      <h2 className="text-xl font-semibold  my-3 text-center text-black ">
        Lista de productos
      </h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2 py-2 text-center">Nombre</th>
            <th scope="col" className="px-2 py-2 text-center">Categoria</th>
            {/* <th scope="col" className="px-2 py-2 text-center">Descripción</th> */}
            <th scope="col" className="px-2 py-2 text-center">Localización</th>
            <th scope="col" className="px-2 py-2 text-center">Precio</th>
            <th scope="col" className="px-2 py-2 text-center">Unidad</th>
            <th scope="col" className="px-2 py-2 text-center">Opiniones</th>
            <th scope="col" className="px-2 py-2 text-center">Calificación</th>
            <th scope="col" className="px-2 py-2 text-center">Fecha de creación</th>
            <th scope="col" className="px-2 py-2 text-center">Publicado por</th>
          </tr>
        </thead>
        {data && data.length > 0 ? (
          <tbody>
            {data.map((o: any) => (
              <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600">
                <td className="px-2 py-2 whitespace-nowrap">{o.name}</td>
                <td className="px-2 py-2 whitespace-nowrap">{o.category}</td>
                {/* <td className="px-2 py-2">{o.description}</td> */}
                <td className="px-2 py-2 whitespace-nowrap">{o.map_locate.slice(0,20)}</td>
                <td className="px-2 py-2 whitespace-nowrap">$ {o.price}</td>
                <td className="px-2 py-2 text-center whitespace-nowrap">{o.unit}</td>
                <td className="px-2 py-2 text-center whitespace-nowrap">{o.num_reviews}</td>
                <td className="px-2 py-2 text-center whitespace-nowrap">{o.rating}</td>
                <td className="px-2 py-2 whitespace-nowrap">{formatearFecha(o.created)}</td>
                <td className="px-2  py-1 text-center">
                  <IconButton className='focus:outline-none' onClick={() => handleOpenModal(o.user)}>
                    <SearchIcon className='text-blue-600'/>
                  </IconButton>
                  <IconButton className='focus:outline-none' onClick={() => deleteProduct(o.id)}>
                    <DeleteIcon className='text-red-600'/>
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={7} className="px-2 py-2 text-center">No se encontraron productos</td>
            </tr>
          </tbody>
        )}
      </table>
      {/* Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ width: 500, maxHeight: 700, padding: 2, backgroundColor: 'background.paper', margin: 'auto', marginTop: '10%' }}>
          {dataUser ? (
            <div className="text-center">
              <img src={dataUser.avatar} alt="avatar" className="w-24 h-24 rounded-full mx-auto" />
              <h2 className="text-xl font-bold mt-4">{dataUser.name}</h2>
              <p className="text-gray-600">{dataUser.email}</p>
              <p className="text-gray-600">{dataUser.phone}</p>
            </div>
          ) : (
            <p>No hay información disponible</p>
          )}
          <div className='w-full text-center'>
            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-[#39A900] text-white rounded  w-6/12">Cerrar</button>
          </div>
        </Box>
      </Modal>

      <div>
        <Pagination
          count={Math.ceil(dataLenght / 10)}
          page={page}
          onChange={(event, value) => setPage(value)}
          className="flex flex-row w-full justify-center my-6"
        />
      </div>
    </div>
  );

};

export default Products;
