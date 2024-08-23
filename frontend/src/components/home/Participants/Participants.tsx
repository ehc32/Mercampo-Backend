import Participant from '../ParticipantCard/Participant';

interface People {
    name: string;
    photo: string;
    role: string;
}

interface ParticipantsProps {
    people: People[];
    darkMode: boolean;
}

const Participants: React.FC<ParticipantsProps> = ({ people, darkMode }) => {
    return (
        <div className="peopleContainer">
            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Participantes del proyecto</h2>
            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}></h4>
            <div>
                {
                    people.map((person, index) => (
                        <Participant key={index} person={person} darkMode={false} />
                    ))
                }
            </div>
        </div>
    )
}

export default Participants;