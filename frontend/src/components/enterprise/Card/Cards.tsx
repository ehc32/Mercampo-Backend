import { FaFacebookF, FaWhatsapp, FaInstagram, FaGlobe } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import './Card.css';

const EmpresaCard = (emp) => {
    const empresa = emp.empresa;
    const navigate = useNavigate(); 

    const handleConocerMas = () => {
        navigate(`/myEnterprise/${empresa.owner_user}`);
    };

    return (
        <div className="cardbody2 cardBodyLight p-2 px-5 flex flex-row items-center bg-white shadow rounded-lg mb-4">
            <img
                src={empresa.avatar || "https://via.placeholder.com/150"}
                alt="Foto de la empresa"
                className="object-cover img-emp"
            />
            <div className="ml-4 flex flex-col justify-center w-60">
                <h2 className="text-xl font-bold text-black">{empresa.name}</h2>
                <p className="text-gray-600 mt-1">{empresa.address}</p>
                <p className="text-justify text-gray-600 mt-2 break-words whitespace-normal overflow-hidden w-full">
                    {empresa.description}
                </p>  
                <div className='flex justify-between items-center my-2'>    
                    <div className="flex space-x-4 mx-1">
                        <Tooltip title="Facebook" arrow>
                            <a href={empresa.facebook} target="_blank" rel="noopener noreferrer">
                                <FaFacebookF className="text-2xl text-blue-600 hover:text-blue-800 transition" />
                            </a>
                        </Tooltip>
                        <Tooltip title="WhatsApp" arrow>
                            <a href={`https://wa.me/${empresa.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className="text-2xl text-green-500 hover:text-green-600 transition" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Instagram" arrow>
                            <a href={empresa.instagram} target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="text-2xl text-pink-500 hover:text-pink-600 transition" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Página Web" arrow>
                            <a href={empresa.link_enterprise} target="_blank" rel="noopener noreferrer">
                                <FaGlobe className="text-2xl text-gray-500 hover:text-gray-700 transition" />
                            </a>
                        </Tooltip>
                    </div>
                    <button 
                        onClick={handleConocerMas}
                        className="text-white font-bold bg-[#39A900] p-1 rounded-md transition hover:bg-[#34A000]"
                    >
                        Conocer más
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmpresaCard;