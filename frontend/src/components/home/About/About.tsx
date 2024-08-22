import Accordion from "../../shared/Accordion/Accordion"
import './styles.css'

interface aboutProps {
    darkMode: boolean
}

const contenidoAcordion = [
    {
        titulo: "¿Qué es el proyecto?",
        contenido: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.Fuga debitis incidunt illo sunt exercitationem qui ipsum dolor voluptate eius totam id officia facilis dolores, quasi excepturi.Architecto consectetur aliquid facere..Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga debitis incidunt illo sunt exercitationem qui ipsum dolor voluptate eius totam id officia facilis dolores, quasi excepturi. Architecto consectetur aliquid facere."
    },
    {
        titulo: "Titulo para el ejemplo",
        contenido: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.Fuga debitis incidunt illo sunt exercitationem qui ipsum dolor voluptate eius totam id officia facilis dolores, quasi excepturi.Architecto consectetur aliquid facere..Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga debitis incidunt illo sunt exercitationem qui ipsum dolor voluptate eius totam id officia facilis dolores, quasi excepturi. Architecto consectetur aliquid facere."
    },

]

const About: React.FC<aboutProps> = ({ darkMode }) => {
    return (
        <section>
            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Sobre nosotros</h2>
            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Conoce más a cerca de nuestros servicios</h4>
            <div className={darkMode ? 'headAboutDark' : 'headAbout'} >
                <img src="https://periodismopublico.com/wp-content/uploads/2019/06/Sena-.jpg" alt="imagen del acerca de " />
                <p>El proyecto es una plataforma de aprendizaje en línea que busca brindaracceso a recursos educativos de alta calidad a estudiantes de todo el mundo, El proyecto es una plataforma de aprendizaje en línea que busca brindaracceso a recursos educativos de alta calidad a estudiantes de todo el mundo.</p>
            </div>
            <div className="acordionContainer">
                <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Preguntas frecuentes</h2>
                <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Conoce más acerca del proyecto</h4>
                {
                    contenidoAcordion.map((contenido, index) => (
                        <Accordion key={index} titulo={contenido.titulo} contenido={contenido.contenido} darkMode={darkMode} />
                    ))

                }
            </div>
            <div className="peopleContainer">
                <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Preguntas frecuentes</h2>
                <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Conoce más acerca del proyecto</h4>
               <div>
                persons
               </div>
            </div>
        </section>
    )
}

export default About;