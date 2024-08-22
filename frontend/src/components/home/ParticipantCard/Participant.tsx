import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import './Card.css';
import BasicTooltip from '../tooltip/Tooltip';

interface Person {
    nombre?: string;
    foto?: string;
    cargo?: number;

}

interface CarrouselLast12Props {
    person: Person;
    darkMode: boolean;
}

const Participant: React.FC<CarrouselLast12Props> = ({ person, darkMode }) => {
    
    return (
        <div>
            <img src={person.foto} alt={person.nombre} />
            <div>
                <h4>{person.nombre}</h4>
                <p>{person.cargo}</p>
            </div>
        </div>
    );
};

export default Participant;
