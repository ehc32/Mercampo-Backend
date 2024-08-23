import 'bootstrap-icons/font/bootstrap-icons.css';
import './Card.css';

interface Person {
    name: string;
    photo: string;
    role: string;

}

interface CarrouselLast12Props {
    person: Person;
    darkMode: boolean;
}

const Participant: React.FC<CarrouselLast12Props> = ({ person, darkMode }) => {

    return (
        <div>
            <img src={person.photo} alt={person.name} />
            <div>
                <h4>{person.name}</h4>
                <p>{person.role}</p>
            </div>
        </div>
    );
};

export default Participant;
