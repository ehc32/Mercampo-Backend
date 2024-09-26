import { FaFacebookF, FaWhatsapp, FaInstagram, FaGlobe } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import './Card.css'

const EmpresaCard = () => {
    return (
        <>
            <div className="cardbody2 cardBodyLight p-2 px-5 flex flex-row items-center bg-white shadow-lg rounded-lg mb-4">
                <img
                    src="https://via.placeholder.com/100"
                    alt="Foto de la empresa"
                    className="object-cover w-24 h-24 rounded-full"
                />
                <div className="ml-4 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-black">Café Brisa Andina</h2>
                    <p className="text-gray-600 mt-1">Neiva, Colombia</p>
                    <p className="text-justify text-gray-600 mt-2">
                        Café Brisa Andina es una empresa dedicada a la producción y comercialización de café 100% orgánico
                        cultivado en las montañas de los Andes. Con más de 20 años de experiencia, llevamos a cada taza el
                        sabor auténtico de nuestras tierras.
                    </p>
                    <div className='flex justify-between align-center my-2'>
                        <div className="flex space-x-4 mx-1">
                            <Tooltip title="Facebook" arrow>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <FaFacebookF className="text-2xl text-blue-600 hover:text-blue-800 transition" />
                                </a>
                            </Tooltip>
                            <Tooltip title="WhatsApp" arrow>
                                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                                    <FaWhatsapp className="text-2xl text-green-500 hover:text-green-600 transition" />
                                </a>
                            </Tooltip>
                            <Tooltip title="Instagram" arrow>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className="text-2xl text-pink-500 hover:text-pink-600 transition" />
                                </a>
                            </Tooltip>
                            <Tooltip title="Página Web" arrow>
                                <a href="https://cafebrisandina.com" target="_blank" rel="noopener noreferrer">
                                    <FaGlobe className="text-2xl text-gray-500 hover:text-gray-700 transition" />
                                </a>
                            </Tooltip>
                        </div>
                        <button className="text-[#fff] font-bold bg-[#39A900] p-1 rounded-md 1s ease-linear hover:bg-[#34A000]">Conocer más</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmpresaCard;
