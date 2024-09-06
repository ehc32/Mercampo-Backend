import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { delete_user, edit_user, get_users } from "../api/users";
import Loader from "./Loader";

interface Props {
  results: any;
}

const Users = ({ results }: Props) => {
  const [idLocal, setIdLocal] = useState(0);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<[]>([])

  const fetchUsers = async () => {
    const response = await get_users();
    setData(response)
  };


  useEffect(() => {
    fetchUsers()
  }, [page]);

  const updateUser = async (formData: any) => {
    try {
      const userData = {
        id: formData.get("id"),
        name: formData.get("nombre"),
        email: formData.get("email"),
        role: formData.get("rol")
      };
      await edit_user(userData, idLocal);
      toast.success('Usuario actualizado con éxito!');
    } catch (e: any) {
      toast.error('Error al actualizar el usuario');
    }
  };

  const deleteUser = async (id: number) => {
    try {

    } catch (e: any) {
      toast.error('Error al eliminar el usuario: ');
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
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold  my-3 text-center text-black ">
        Lista de usuarios
      </h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2  py-1 text-center">Nombre</th>
            <th scope="col" className="px-2  py-1 text-center">Correo</th>
            <th scope="col" className="px-2  py-1 text-center">Teléfono</th>
            <th scope="col" className="px-2  py-1 text-center">Rol</th>
            <th scope="col" className="px-2  py-1 text-center">P. Publicación</th>
            <th scope="col" className="px-2  py-1 text-center">Fecha de creación</th>
          </tr>
        </thead>
        {data && data.length > 0 ? (
          <tbody>
            {data.map((o: any) => (
              <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600">
                <td className="px-2  py-1 ">{o.name}</td>
                <td className="px-2  py-1 ">{o.email}</td>
                <td className="px-2  py-1 ">{o.phone}</td>
                <td className="px-2  py-1 text-center">{o.role == "seller" ? "Vendedor" : o.role}</td>
                <td className="px-2  py-1 text-center">{o.can_publish == true ? "Puede" : "No puede"}</td>
                <td className="px-2  py-1 text-center">{formatearFecha(o.date_joined)}</td>

              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={7} className="px-6 py-1 text-center">No se encontraron usuarios</td>
            </tr>
          </tbody>
        )}
      </table>
      <div>
        <Pagination count={Math.ceil(data.length / 10)} page={page} onChange={(event, value) => setPage(value)} className="flex flex-row w-full justify-center" />
      </div>
    </div>
  );
};
export default Users;