import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminPrivateRoute, PrivateRoute } from "./components/admin/PrivateRoute";
import Layout from "./components/layout/Layout";
import { ToastContainer } from "react-toastify";
import NotfoundPage from "./global/NotfoundPage";
import AddProd from "./pages/AddProd";
import AddEnterprise from "./pages/AddEnterprise";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import DetallesProd from "./pages/ProductDetail";
import RegisterPage from "./pages/Register";
import ShoppingCart from "./pages/ShoppingCart";
import Store from "./pages/Store";
import UserProfile from "./pages/UserProfile";
import Enterprise from "./pages/Enterprise";
import EnterpriseShop from "./pages/EnterpriseShop";


function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="store" element={<Store />} />
                    <Route path="enterpriseShop" element={<EnterpriseShop />} />

                    {/* Rutas protegidas para vendedores y admins */}
                    <Route element={<PrivateRoute allowedRoles={['seller', 'admin']} />} >
                        <Route path="addprod" element={<AddProd />} />
                        <Route path="create-enterprise" element={<AddEnterprise />} />
                    </Route>

                    {/* Rutas protegidas para clientes autenticados */}
                    <Route element={<PrivateRoute allowedRoles={['client', 'seller', 'admin']} />} >
                        <Route path="myEnterprise" element={<Enterprise />} />
                        <Route path="product/:slug" element={<DetallesProd />} />
                        <Route path="cart" element={<ShoppingCart />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                    {/* Ruta solo para admins */}
                    <Route element={<AdminPrivateRoute allowedRoles={['admin']} />} >
                        <Route path="admin" element={<AdminPage />} />
                    </Route>

                    <Route path="*" element={<NotfoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
