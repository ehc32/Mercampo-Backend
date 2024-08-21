import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import { AdminPrivateRoute, PrivateRoute } from "./components/PrivateRoute"

import LoginPage from "./pages/Login"
import DetallesProd from "./pages/ProductDetail"
import RegisterPage from "./pages/Register"
import Store from "./pages/Store"

import AddProductPage from "./pages/AddProductPage"
import AdminPage from "./pages/AdminPage"
import Home from "./pages/Home"
import ShopHistory from "./pages/ShopHistory"
import ShoppingCart from "./pages/ShoppingCart"
import UserProfile from "./pages/UserProfile"
import VendedorProduct from "./pages/VendedorProduct"
import AddProd  from "./pages/AddProd"


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />

                    <Route index element={<Home />} /> {/* vista principal */}
                    <Route path="product/:slug" element={<DetallesProd />} />
                    <Route path="store" element={<Store />} />    
                    <Route path="add" element={<AddProductPage />} />  {/* Vista para ingresar productos - solo con permisos de venta */}
                    <Route path="vendedor-order" element={<VendedorProduct />} />  {/* Vista para ingresar productos - solo con permisos de venta */}
                    <Route path="addprod" element={<AddProd />} />
                    

                    <Route path="login" element={<LoginPage />} />

                    <Route element={<PrivateRoute />} >
                        <Route path="cart" element={<ShoppingCart />} />
                        <Route path="profile" element={<UserProfile />} />
                        <Route path="/purchase-history" element={<ShopHistory />} />
                    </Route>

                    <Route path="admin" element={<AdminPrivateRoute />} >
                        <Route index element={<AdminPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App