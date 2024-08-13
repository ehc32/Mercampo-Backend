
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-800 text-white py-8">
      <div className="flex justify-center mb-4">
        {/* Logos footer - Aquí puedes agregar tus logos */}
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div>
            <p className="text-lg font-semibold">Centro de la Empresa la Industria, la Empresa y los Servicios</p>
            <p className="text-sm">Carrera 9 No 68-50, estaciones - PBX (60 8) 8757040 IP 83352</p>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="https://www.facebook.com/SENAHuila" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              <FaFacebook size={24} />
            </a>
            <a href="https://x.com/senahuila" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.youtube.com/@senaneiva2716" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
              <FaYoutube size={24} />
            </a>
            <a href="https://www.linkedin.com/school/servicio-nacional-de-aprendizaje-sena-/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
              <FaLinkedin size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-white-900">
              <FaWhatsapp size={24} />
            </a>
          </div>
          <div className="mt-4 space-y-2">
            <a href="#" className="block">@SENAComunica</a>
            <a href="https://www.sena.edu.co" target="_blank" rel="noopener noreferrer" className="block">www.sena.edu.co</a>
            <a href="https://industriaempresayservicios.blogspot.com/p/servicios-tecnologicos.html" target="_blank" rel="noopener noreferrer" className="block">
              Servicios Tecnologicos - Regional Huila
            </a>
          </div>
          <div className="mt-4 text-sm">&copy; Copyright. Todos los derechos reservados</div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {/* Logos footer 2 - Aquí puedes agregar tus logos */}
      </div>
    </footer>
  );
};

export default Footer;
