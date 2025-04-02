import { FaFacebookF, FaWhatsapp, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Map from './Map';
import './style.css';

interface AsideEnterpriseProps {
    enterpriseData: any;
}

const AsideEnterprise = ({ enterpriseData }: AsideEnterpriseProps) => {
    return (
        <aside className="enterprise-sidebar">
            <div className="sidebar-content">
                {/* Encabezado con logo */}
                <div className="enterprise-header">
                    <div className="enterprise-logo-container">
                        <img
                            src={enterpriseData?.enterprise.avatar || "./../../../public/logoSena.png"}
                            alt="Logo de la empresa"
                            className="enterprise-logo"
                        />
                    </div>
                    <h2 className="enterprise-name">{enterpriseData?.enterprise.name || "Nombre de la Empresa"}</h2>
                    <p className="enterprise-leader">Líder: {enterpriseData?.owner.name || "Maria del Pilar"}</p>
                </div>

                {/* Descripción */}
                <div className="enterprise-description">
                    <p>{enterpriseData?.enterprise.description || "Café Brisa Andina es una empresa dedicada a la producción y comercialización de café 100% orgánico..."}</p>
                </div>
                
                {/* Tipo de productos */}
                <div className="enterprise-section">
                    <h3 className="section-title">Tipo de productos</h3>
                    <div className="product-type">
                        <FaEnvelope className="section-icon" />
                        <span>{enterpriseData?.enterprise.tipo_productos || "Café"}</span>
                    </div>
                </div>
                
                {/* Contacto */}
                <div className="enterprise-contact">
                    <h3 className="section-title">Contacto</h3>

                    <div className="social-links">
                        <a
                            href={enterpriseData?.enterprise.facebook || "https://facebook.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link facebook"
                        >
                            <FaFacebookF className="social-icon" />
                            <span>Facebook</span>
                        </a>
                        <a
                            href={enterpriseData?.enterprise.instagram || "https://instagram.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link instagram"
                        >
                            <FaInstagram className="social-icon" />
                            <span>Instagram</span>
                        </a>
                        <a
                            href={enterpriseData?.enterprise.whatsapp || "https://wa.me/1234567890"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link whatsapp"
                        >
                            <FaWhatsapp className="social-icon" />
                            <span>WhatsApp</span>
                        </a>
                    </div>

                    <div className="contact-info">
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span>{enterpriseData?.owner.email || "ncerquera5@soy.sena.edu.co"}</span>
                        </div>
                        <a 
                            className="contact-item" 
                            href={enterpriseData?.enterprise.whatsapp || "https://wa.me/1234567890"}
                            target="_blank"
                        >
                            <FaPhoneAlt className="contact-icon" />
                            <span>{enterpriseData?.enterprise.phone || "+57 3132316909"}</span>
                        </a>
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <span>{enterpriseData?.enterprise.address || "Neiva, Huila"}</span>
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="enterprise-map">
                    <Map address={enterpriseData?.enterprise.address || 'neiva'} />
                </div>
            </div>
        </aside>
    );
};

export default AsideEnterprise;