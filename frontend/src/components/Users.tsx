import Pagination from '@mui/material/Pagination';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { delete_user, edit_user, get_users } from "../api/users";
import { User } from "../Interfaces";
import Loader from "./Loader";
import ModalUsers from "./shared/Modal/ModalUsers";

interface Props {
  results: any;
}

const Users = ({ results }: Props) => {
  const [idLocal, setIdLocal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: get_users,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await get_users();
      return response;
    };
    fetchUsers().then((data) => {
      queryClient.setQueryData(["users"], data);
    });
  }, [page, queryClient]);

  const updateUser = async (formData: any) => {
    try {
      const userData = {
        id: formData.get("id"),
        name: formData.get("nombre"),
        last_name: formData.get("apellido"),
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
      await delete_user(id);
      toast.success('Usuario eliminado con éxito!');
    } catch (e: any) {
      toast.error('Error al eliminar el usuario: ');
    }
  };

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-5 mt-5 text-center text-black ">
          Lista de Usuarios
        </h2>
        <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400 bg-slate-50">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 bg-slate-100">
          <tr>
            <th scope="col" className="px-4 py-3">
              Id
            </th>
            <th scope="col" className="px-4 py-3">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3">
              Apellido
            </th>
            <th scope="col" className="px-4 py-3">
              Correo Electronico
            </th>
            <th scope="col" className="px-4 py-3">
              Rol
            </th>
            <th
              scope="col"
              className="px-4 py-3 flex items-center justify-center gap-4"
            >
              Acciones
            </th>
          </tr>
        </thead>

        {results && results.users.length > 0 ? (
          <tbody>
            {results &&
              results.users.slice((page - 1) * 10, page * 10).map((user: User, index: number) => (
                <tr className="border-b dark:border-gray-700" key={index}>
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.id}
                  </th>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.last_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-4 h-full">

                    <svg
                      onClick={() => {
                        if (user.id) {
                          deleteUser(user.id);
                        }
                      }}
                      className="w-6 h-6 text-red-300 cursor-pointer" // Estilo de cursor y color del ícono
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>

                    <div onClick={() => setIdLocal(user.id)}>
                      <ModalUsers updateUser={updateUser} idLocal={idLocal} />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        ) : (
          <tbody>
            {data &&
              data.slice((page - 1) * 10, page * 10).map((user: User, index: number) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.id}
                  </th>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.last_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-4 h-full">

                    <svg
                      onClick={() => {
                        if (user.id) {
                          deleteUser(user.id);
                        }
                      }}
                      className="w-6 h-6 text-red-300 cursor-pointer" // Estilo de cursor y color del ícono
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <div onClick={() => setIdLocal(user.id)}>
                      <ModalUsers updateUser={updateUser} idLocal={idLocal} />
                    </div>
                  </td>
                </tr>
              ))}
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