import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ReactPaginate from 'react-paginate';
import 'react-paginate/theme/basic/react-paginate.css';
import { useNavigate } from "react-router-dom";
import { create_order } from "../api/orders";
import Footer from "../components/Footer";
import { useCartStore } from "../hooks/cart";
import './style.css';

const CartPage = () => {

    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const addToCart = useCartStore((state) => state.addToCart);
    const removeAll = useCartStore((state) => state.removeAll);

    const cart = useCartStore((state) => state.cart);
    const total_price = useCartStore((state) => state.totalPrice);

    const [pagina, setPagina] = useState(1);
    const [productosPorPagina, setProductosPorPagina] = useState(10);

    const ultimaPagina = Math.ceil(cart.length / productosPorPagina);
    const primerProducto = (pagina - 1) * productosPorPagina;
    const ultimoProducto = primerProducto + productosPorPagina;
    const cartPagina = cart.slice(primerProducto, ultimoProducto);

    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [postal_code, setPostal_code] = useState<string>("");

    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const createOrderMut = useMutation({
        mutationFn: create_order,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order created!")
            removeAll()
            navigate('/')
        },
        onError: () => {
            toast.error("Error!")
            navigate('/')
        },
    });

    const createOrder = (data: any, actions: any) => {
        console.log(data)
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: total_price
                    },
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING"
            }
        });
    };

    const onApprove = (data: any, actions: any) => {
        console.log(data)
        return actions.order.capture(handleSubmit());
    };

    const handleSubmit = () => {
        createOrderMut.mutate({
            order_items: cart,
            total_price: total_price,
            address: address,
            city: city,
            postal_code: postal_code,
        });
    };


    return (
        <>
            <section className="dark:bg-gray-900 p-3 sm:p-5">
                <div className="px-4 lg:px-12">
                    <div className="divisor gap-6"> {/* Este div contiene ambas secciones */}
                        <div className="card-bordered bg-white relative shadow-md sm:rounded-lg overflow-hidden p-8">
                            <h4 className="fs-22px font-bold text-center text-gray-900 mb-2">Formulario de pago</h4>
                            <h6 className="fs-16px text-gray-900 text-center mb-2">¿Terminaste? ¡Haz tu pedido!</h6>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div className="inputForm">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 cursor-default">Dirección</label>
                                    <input
                                        onChange={(e) => setAddress(e.target.value)}
                                        value={address}
                                        type="text" className="inputForm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5" placeholder="Dirección" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 cursor-default">Ciudad</label>
                                    <input
                                        onChange={(e) => setCity(e.target.value)}
                                        value={city}
                                        type="text" className="inputForm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5" placeholder="Ciudad" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 cursor-default">Codigo Postal</label>
                                    <input
                                        onChange={(e) => setPostal_code(e.target.value)}
                                        value={postal_code}
                                        type="text" className="inputForm border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5" placeholder="Codigo Postal" />
                                </div>
                                <div className="botonDePaypal">
                                    <PayPalScriptProvider
                                        options={{
                                            clientId: "AcvM04ycLuatoHGj4mz_xumwdLrJbM1g3n_Vy-fCiVmFD9DULLcxSnKZ_kil0RIgU490rEk9okpAxicZ",
                                            currency: "USD"
                                        }}
                                    >
                                        <PayPalButtons
                                            createOrder={(data, actions) => createOrder(data, actions)}
                                            onApprove={(data, actions) => onApprove(data, actions)}
                                            style={{ layout: "horizontal" }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            </form>
                        </div>
                        <div className="card-bordered bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                            <div className="relative contenedorSobreTabla mt-5 overflow-hidden bg-white shadow-md sm:rounded-lg">
                                <div className="flex flex-col px-4 box-titlesCart lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                                    <div className="flex flex-col box-titlesCart items-center w-full space-y-4">
                                        <h4 className="fs-22px font-bold text-gray-900">Tu carrito de compras</h4>
                                        <h6 className="fs-16px text-gray-900">Aqui tu lista de deseos</h6>
                                        <div className="flex flex-row justify-between w-full">
                                            <h5>
                                                <span className="fs-18px font-bold">
                                                    Productos en tu carrito: {cart.length}
                                                </span>
                                            </h5>
                                            <h5>
                                                <span className="fs-18px font-bold">
                                                    Total: $ {total_price === null ? " 0" : ` ${total_price.toFixed(2)}`}
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto tablaCart">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-center">Foto</th>
                                                <th scope="col" className="px-4 py-3 text-center">Producto</th>
                                                <th scope="col" className="px-4 py-3 text-center">Categoria</th>
                                                <th scope="col" className="px-4 py-3 text-center">Cantidad</th>
                                                <th scope="col" className="px-4 py-3 text-center">Precio</th>
                                                <th scope="col" className="px-4 py-3 text-center">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartPagina.map((product) => (
                                                <tr key={product.id} className="border-b cursor-pointer hover:bg-gray-100" >
                                                    <td scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap text-center">
                                                        <img src={product.first_image} alt={product.name} className="mx-auto h-12 rounded-full border-1 border-green-500" />
                                                    </td>
                                                    <td className="px-4 py-2 text-start">
                                                        <span className=" fs-16px font-medium px-2 py-0.5 rounded">
                                                            {product.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className=" fs-16px font-medium px-2 py-0.5 rounded">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center font-medium text-gray-900 whitespace-nowrap">
                                                        <div className="flex items-center  text-center space-x-3">
                                                            <button onClick={() => removeFromCart(product)} className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 min-w-6" type="button">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"></path></svg>
                                                            </button>
                                                            <span className="fs-16px font-medium">{product.quantity}</span>
                                                            <button onClick={() => addToCart(product)} className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 min-w-6" type="button">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-center font-medium text-gray-900 whitespace-nowrap">
                                                        <span className="fs-16px font-medium">
                                                            $ {product.price}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-center font-medium text-gray-900 whitespace-nowrap">
                                                        <span className="fs-16px font-medium">
                                                            $ {product.price * product.quantity}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <ReactPaginate
                                    pageCount={ultimaPagina}
                                    onPageChange={(pagina) => setPagina(pagina.selected + 1)}
                                    containerClassName="paginacion"
                                    pageClassName="pagina"
                                    pageLinkClassName="pagina-link"
                                    activeClassName="pagina-activa"
                                    previousClassName="pagina-anterior"
                                    previousLinkClassName="pagina-anterior-link"
                                    nextClassName="pagina-siguiente"
                                    nextLinkClassName="pagina-siguiente-link"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default CartPage;