import { FaFacebookF, FaWhatsapp, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Map from './Map';
import './style.css'
const AsideEnterprise = () => {
    return (
        <aside className="container-aside">
            {/* Imagen de fondo */}
            <div className="relative">

                {/* Imagen principal de la empresa */}
                <img
                    src="./../../../public/logoSena.png"
                    alt="Logo de la empresa"
                    className="w-32 h-32 rounded-full borde shadow-lg bg-white object-cover m-auto"
                />
            </div>

            {/* Información de la empresa */}
            <div className="mt-2 text-center">
                <h2 className="text-xl font-bold text-white">Nombre de la Empresa</h2>
                <p className="text-gray-50">Lider: Maria del Pilar </p>
                <p className="text-gray-50 justify-text mt-1 p-2">Café Brisa Andina es una empresa dedicada a la producción y comercialización de café 100% orgánico cultivado en las montañas de los Andes. Con más de 20 años de experiencia, llevamos a cada taza el sabor auténtico de nuestras tierras, cuidando cada proceso para ofrecer una experiencia única y sostenible.</p>
            </div>
            <div className="text-white px-2">
                <h3 className="text-lg font-semibold mb-1">Tipo de productos</h3>
                <div className="mt-2 flex flex-col space-y-1 items-start">
                    <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-xl" />
                        <span>Cafe</span>
                    </div>
                </div>
            </div>
            <div className=" text-white p-2">
                <h3 className="text-lg font-semibold mb-2">Contacto</h3>

                {/* Redes Sociales */}
                <div className="flex flex-row  items-center justify-between align-center">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-blue-600 transition"
                    >
                        <FaFacebookF className="text-2xl" />
                        <span className='rd-span'>Facebook</span>
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-pink-500 transition"
                    >
                        <FaInstagram className="text-2xl" />
                        <span className='rd-span'>Instagram</span>
                    </a>
                    <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-green-500 transition"
                    >
                        <FaWhatsapp className="text-2xl" />
                        <span className='rd-span'>WhatsApp</span>
                    </a>
                </div>

                {/* Información de contacto adicional */}
                <div className="mt-3 flex flex-col space-y-4 items-start">
                    <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-xl" />
                        <span>ncerquera5@soy.sena.edu.co</span>
                    </div>
                    <a className="flex items-center space-x-2"
                        href="https://wa.me/1234567890"
                        target="_blank">
                        <FaPhoneAlt className="text-xl" />
                        <span>+57 3132316909</span>
                    </a>
                    <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-xl" />
                        <span>Neiva, Huila</span>
                    </div>
                </div>
                <div className='py-3'>
                    <Map address='neiva' />
                </div>
            </div>
        </aside>
    );
};

export default AsideEnterprise;
