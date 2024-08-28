import Participant from '../ParticipantCard/Participant';

interface People {
    name: string;
    photo: string;
    role: string;
}

interface ParticipantsProps {
    people: People[];
}

const Participants: React.FC<ParticipantsProps> = ({ people }) => {
    return (
        <div className='mb-20'>
            <h2 className='titulo-sala-compra-light'>Participantes del proyecto</h2>
            <h4 className="sub-titulo-sala-compra-light text-center mb-4">
                En servicios tecnológicos, nos enorgullece contar con un equipo de trabajo excepcional, comprometido con la excelencia y dedicado a brindar la mejor experiencia a nuestros clientes.
            </h4>
            <div className='flex flex-row flex-wrap text-center justify-around'>
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