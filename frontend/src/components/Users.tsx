import { BsFillTrashFill } from "react-icons/bs";
import { delete_user, get_users } from "../api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { User } from "../Interfaces";
import NestedModal from "./shared/Modal/Modal";

interface Props {
  results: any;
}

const Users = ({ results }: Props) => {
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: get_users,
  });

  const deleteUserMut = useMutation({
    mutationFn: delete_user,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted!");
    },
    onError: () => {
      toast.error("Error!");
    },
  });

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3">
              ID
            </th>
            <th scope="col" className="px-4 py-3">
              Correo Electronico
            </th>
            <th scope="col" className="px-4 py-3">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3">
              Apellido
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
              results.users.map((user: User) => (
                <tr className="border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.id}
                  </th>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.last_name}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-4">
                    <BsFillTrashFill
                      onClick={() => {
                        if (user.id) {
                          deleteUserMut.mutate(user.id);
                        }
                      }}
                      size={22}
                      className="text-red-300 cursor-pointer"
                    />
                    <NestedModal />
                  </td>
                </tr>
              ))}
          </tbody>
        ) : (
          <tbody>
            {data &&
              data.map((user: User) => (
                <tr className="border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.id}
                  </th>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.last_name}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-4">
                    {/* Ícono de eliminar usuario */}
                    <svg
                      onClick={() => {
                        if (user.id) {
                          deleteUserMut.mutate(user.id); // Elimina el usuario si tiene un ID
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


                    <NestedModal />                     {/* Ícono de editar usuario */}
                    <svg
                      onClick={() => {
                        // Aquí puedes agregar la lógica para editar el usuario
                        console.log("Editar usuario", user.id);
                      }}
                      className="w-6 h-6 text-blue-300 cursor-pointer" // Estilo de cursor y color del ícono
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </td>
                </tr>
              ))}
          </tbody>
        )}
      </table>
    </div>
  );
};
export default Users;
