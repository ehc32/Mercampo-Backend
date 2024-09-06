import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { get_order_items } from "../api/orders";
import { edit_user, get_solo_user } from "../api/users";
import Loader from "../components/Loader";
import ModalRequestSeller from "../components/shared/Modal/ModalARequestSeller";
import ModalEditProfile from "../components/shared/Modal/ModalEditUser";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { useAuthStore } from "../hooks/auth";
import { Token } from "../Interfaces";
import Footer from "../components/Footer";

export default function UserProfile2() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState("compras");
  const [stateName, setStateName] = useState("");
  const [stateLast, setStateLast] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [show, setShow] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode(token);
  const id = tokenDecoded.user_id;

  const queryClient = useQueryClient();

  // Consultar usuario actual
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["users", id],
    queryFn: () => get_solo_user(id),
  });

  const editProfileMut = useMutation({
    mutationFn: edit_user,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated!");
    },
    onError: () => {
      toast.error("Error, u not added nothing!");
    },
  });

  useEffect(() => {
    if (user) {
      setStateName(user.name);
      setImage(user.avatar);
    }
  }, [user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setFilePreview("");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editProfileMut.mutate({
      name: stateName,
      avatar: image,
      email: user.email,
      role: "",
      phone: "",
    });
  };

  const handleOrderClick = (orderId) => {
    // Llamar a la API para obtener los productos de la orden específica
    get_order_items(orderId)
      .then((items) => {
        setOrderItems(items); // Actualizar los productos de la orden
        setOpenModal(true); // Mostrar el modal
      })
      .catch((error) => {
        toast.error("Error fetching order items");
        console.error(error);
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cerrar el modal
    setOrderItems([]); // Limpiar los productos de la orden
  };

  if (isUserLoading) return <Loader />;
  if (isUserError) return <p>Error al cargar datos.</p>;

  const profileData = {
    fullName: user.name,
    phone: user.phone || "Sin registrar",
    email: user.email,
    role: user.role,
    avatar: `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`,
  };

  const tablesData = {
    projects: [
      {
        id: 1,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 2,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 3,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 4,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 5,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 6,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 7,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 8,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 9,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 10,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 11,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 12,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 13,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 14,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 15,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
    ],
    tasks: [
      {
        id: 1,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 2,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 3,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 4,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 5,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 6,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 7,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 8,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 9,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 10,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 11,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 12,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
      {
        id: 13,
        name: "Website Redesign",
        status: "In Progress",
        dueDate: "2023-12-31",
        total_price: "2000",
      },
      {
        id: 14,
        name: "Mobile App Development",
        status: "Planning",
        dueDate: "2024-03-15",
        total_price: "5000",
      },
      {
        id: 15,
        name: "Database Migration",
        status: "Completed",
        dueDate: "2023-11-30",
        total_price: "4000",
      },
    ],
  };

  const filterData = (data, term) => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <>
      <AsideFilter />
      <Box sx={{ maxWidth: "lg", mx: "auto", p: 6, mt: "5em" }}>
        <div
          className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-6">Perfil del usuario</h2>

          <Card
            sx={{ my: "2em" }}
            className="flex flex-row justify-between items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="flex items-center space-x-6">
              <Avatar
                src={profileData.avatar}
                alt={profileData.fullName}
                sx={{ width: 100, height: 100 }}
                className="border-4 border-gray-200"
              />
              <div>
                <Typography variant="h5" className="text-xl font-bold text-gray-800">{profileData.fullName}</Typography>
                <Typography variant="body2" className="text-gray-600">{profileData.phone}</Typography>
                <Typography variant="body2" className="text-gray-600">{profileData.email}</Typography>
              </div>
            </CardContent>
            <div className="text-end w-30 p-4">
              <ModalEditProfile
                stateName={stateName}
                setStateName={setStateName}
                stateLast={stateLast}
                setStateLast={setStateLast}
                image={image}
                handleFileChange={handleFileChange}
                removeImage={removeImage}
                setShow={setShow}
                handleSubmit={handleSubmit}
              />
              <ModalRequestSeller userId={id} requestSellerStatus={() => {}} />
            </div>
          </Card>
          <div className="mt-8">
            <h2 className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-2">
              Registro de compraventa
            </h2>
            <h4 className="sub-titulo-sala-compra-light text-gray-600 mb-6">
              Visualiza las ordenes de productos que has realizado{" "}
              {profileData.role == "seller" && <span className="text-green-600"> o ventas que has logrado</span>}
              {profileData.role == "admin" && <span className="text-green-600"> o ventas que has logrado</span>}
            </h4>
          </div>
          <div className="flex flex-row justify-between items-center py-4">
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "50%", padding: ".1em" }}
              className="border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
            <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                TabIndicatorProps={{
                  style: { backgroundColor: "#39a900" },
                }}
                className="border-b border-gray-200"
              >
                <Tab
                  label="Compras"
                  value="compras"
                  sx={{
                    color: tabValue === "compras" ? "#39a900" : "#4a5568",
                    fontWeight: "medium",
                  }}
                  className="mr-4"
                />
                <Tab
                  label="Ordenes"
                  value="orders"
                  sx={{
                    color: tabValue === "orders" ? "#39a900" : "#4a5568",
                    fontWeight: "medium",
                  }}
                />
              </Tabs>
            </Box>
          </div>

          {tabValue === "compras" && (
            <Table className="w-full">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Id</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Usuario</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Fecha de entrega</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Fecha de creación</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Precio total</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(tablesData.projects, searchTerm).map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm text-gray-600">{project.id}</TableCell>
                    <TableCell className="text-sm text-gray-600">{project.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{project.dueDate}</TableCell>
                    <TableCell className="text-sm text-gray-600">{project.dueDate}</TableCell>
                    <TableCell className="text-sm text-gray-600">$ {project.total_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tabValue === "orders" && (
            <Table className="w-full">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Id</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Usuario</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Fecha de entrega</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Fecha de creación</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold text-gray-700">Precio total</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(tablesData.tasks, searchTerm).map((task) => (
                  <TableRow
                    key={task.id}
                    onClick={() => handleOrderClick(task.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell className="text-sm text-gray-600">{task.id}</TableCell>
                    <TableCell className="text-sm text-gray-600">{task.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{task.dueDate}</TableCell>
                    <TableCell className="text-sm text-gray-600">{task.dueDate}</TableCell>
                    <TableCell className="text-sm text-gray-600">$ {task.total_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal para mostrar los productos de la orden */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              width: 400,
              p: 4,
              bgcolor: "white",
              margin: "auto",
              marginTop: "5em",
            }}
            className="rounded-lg shadow-xl"
          >
            <Typography id="modal-title" variant="h6" component="h2" className="text-xl font-semibold mb-4">
              Productos de la Orden
            </Typography>
            <Table className="w-full">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell className="text-sm font-bold text-gray-700">Nombre del Producto</TableCell>
                  <TableCell className="text-sm font-bold text-gray-700">Cantidad</TableCell>
                  <TableCell className="text-sm font-bold text-gray-700">Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm text-gray-600">{item.productName}</TableCell>
                    <TableCell className="text-sm text-gray-600">{item.quantity}</TableCell>
                    <TableCell className="text-sm text-gray-600">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300">
              Cerrar
            </button>
          </Box>
        </Modal>
      </Box>
      <Footer />
    </>
  );
}
