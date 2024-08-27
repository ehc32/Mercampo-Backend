import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { search_order } from "../api/orders";
import { search_prod } from "../api/products";
import { search_users } from "../api/users";
import Footer from '../components/Footer';
import Orders from "../components/Orders";
import Products from "../components/Products";
import Users from "../components/Users";

const AdminPage = () => {
  const [show, setShow] = useState(0);
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["products", search],
    queryFn: () => {
      if (search && show === 0) {
        return search_prod(search);
      }
      return { products: [] };
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users", search],
    queryFn: () => {
      if (search && show === 2) {
        return search_users(search);
      }
      return { users: [] };
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", search],
    queryFn: () => {
      if (search && show === 1) {
        return search_order(search);
      }
      return { orders: [] };
    },
  });

  return (
    <section className="dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl mb-10 px-4 lg:px-12 h-svh">
        <div className="bg-white dark:bg-gray-800 card-bordered relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Buscar
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </div>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                onClick={() => setShow(0)}
                type="button"
                className="flex items-center justify-center text-white bg-[#39A900] hover:bg-[#3e8e41] focus:ring-4 focus:ring-[#3e8e41] font-medium rounded-lg text-sm px-4 py-2 dark:bg-[#3e8e41] dark:hover:bg-[#357a38] focus:outline-none dark:focus:ring-[#357a38]"
              >
                Productos
              </button>
              <button
                onClick={() => setShow(1)}
                type="button"
                className="flex items-center justify-center text-white bg-[#39A900] hover:bg-[#3e8e41] focus:ring-4 focus:ring-[#3e8e41] font-medium rounded-lg text-sm px-4 py-2 dark:bg-[#3e8e41] dark:hover:bg-[#357a38] focus:outline-none dark:focus:ring-[#357a38]"
              >
                Ordenes
              </button>
              <button
                onClick={() => setShow(2)}
                type="button"
                className="flex items-center justify-center text-white bg-[#39A900] hover:bg-[#3e8e41] focus:ring-4 focus:ring-[#3e8e41] font-medium rounded-lg text-sm px-4 py-2 dark:bg-[#3e8e41] dark:hover:bg-[#357a38] focus:outline-none dark:focus:ring-[#357a38]"
              >
                Usuarios
              </button>
            </div>
          </div>

          {show === 0 && <Products results={data} />}
          {show === 1 && <Orders results={orders} />}
          {show === 2 && <Users results={users} />}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default AdminPage;
