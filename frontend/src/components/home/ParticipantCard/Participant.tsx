import 'bootstrap-icons/font/bootstrap-icons.css';
import './Card.css';
import { useState } from 'react';

interface Person {
    name: string;
    photo: string;
    role: string;
    postImages: string[]; // Añadir un array de imágenes adicionales
}

interface CarrouselLast12Props {
    person: Person;
    darkMode: boolean;
}

const Participant: React.FC<CarrouselLast12Props> = ({ person, darkMode }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleMouseEnter = () => {
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setShowPopup(false);
    };

    return (
        <div
            className='flex flex-column card-people'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img src={person.photo} alt={person.name} />
            <div className='flex flex-column justify-center text-center'>
                <h4>{person.name}</h4>
                <p>{person.role}</p>
            </div>

            {showPopup && (
                <div
                    className='popup'
                    onMouseEnter={handleMouseEnter}  // Mantiene el popup abierto al pasar el mouse sobre él
                    onMouseLeave={handleMouseLeave}  // Cierra el popup al salir
                >
                    <h3>{person.name}</h3>
                    <div className='social-icons'>
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-linkedin"></i>
                        <i className="bi bi-twitter"></i>
                    </div>
                    {/* <div className='post-images'>
                        {person.postImages.map((image, index) => (
                            <img key={index} src={image} alt={`Post de ${person.name} ${index + 1}`} className='post-preview' />
                        ))}
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default Participant;
