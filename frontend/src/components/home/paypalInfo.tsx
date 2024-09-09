import React from 'react';

const PaypalIntro = () => {
    return (
        <section className="paypal-intro bg-gray-100 py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                    <span className="text-[#39A900]">Pago Seguro</span> con PayPal
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                    En nuestra tienda en línea, te ofrecemos la opción de pagar con PayPal, una de las plataformas de pago más seguras y confiables del mundo. Con PayPal, puedes realizar tus compras de manera rápida y sencilla, con la tranquilidad de que tus datos están protegidos.
                </p>
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ventajas de Usar PayPal</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                            <strong className="text-gray-800">Seguridad:</strong> PayPal utiliza tecnología avanzada para proteger tus datos financieros y personales, reduciendo el riesgo de fraude.
                        </li>
                        <li>
                            <strong className="text-gray-800">Comodidad:</strong> Puedes pagar con tu cuenta de PayPal sin necesidad de ingresar tus datos bancarios cada vez que realices una compra.
                        </li>
                        <li>
                            <strong className="text-gray-800">Accesibilidad:</strong> PayPal está disponible en más de 200 países y admite múltiples monedas, facilitando las compras internacionales.
                        </li>
                        <li>
                            <strong className="text-gray-800">Rápido y Sencillo:</strong> Completa tus pagos en cuestión de minutos con solo unos clics, sin necesidad de complicadas verificaciones.
                        </li>
                        <li>
                            <strong className="text-gray-800">Protección al Comprador:</strong> PayPal ofrece protección para compras, ayudándote a resolver cualquier problema que puedas encontrar con tus pedidos.
                        </li>
                    </ul>
                </div>
                <p className="text-lg text-gray-700">
                    Al elegir PayPal como método de pago, no solo estás optando por una transacción segura, sino también por una experiencia de compra sin complicaciones. ¡Compra con confianza y disfruta de tus productos!
                </p>
            </div>
        </section>
    );
};

export default PaypalIntro;
