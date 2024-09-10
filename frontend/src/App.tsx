import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AdminPrivateRoute, PrivateRoute } from "./components/PrivateRoute";

import LoginPage from "./pages/Login";
import DetallesProd from "./pages/ProductDetail";
import RegisterPage from "./pages/Register";
import Store from "./pages/Store";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";
import ShoppingCart from "./pages/ShoppingCart";
import UserProfile from "./pages/UserProfile";
import AddProd from "./pages/AddProd";
import { ToastContainer } from "react-toastify";
import NotfoundPage from "./global/NotfoundPage";


function App() {

    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="product/:slug" element={<DetallesProd />} />
                    <Route path="store" element={<Store />} />
                    
                    {/* Rutas protegidas para vendedores y admins */}s
                    <Route element={<PrivateRoute allowedRoles={['seller', 'admin']} />} >
                        <Route path="addprod" element={<AddProd />} />
                    </Route>

                    {/* Rutas protegidas para clientes autenticados */}
                    <Route element={<PrivateRoute allowedRoles={['client', 'seller', 'admin']} />} >
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
    )
}

export default App;
