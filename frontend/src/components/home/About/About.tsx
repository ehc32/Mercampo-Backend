import Accordion from "../../shared/Accordion/Accordion"
import './styles.css'

interface aboutProps {
    darkMode: boolean
}

const contenidoAcordion = [
    {
        titulo: "¿Qué es el proyecto?",
        contenido: "El proyecto es una plataforma de aprendizaje en línea que busca brindaracceso a recursos educativos de alta calidad a estudiantes de todo el mundo."
    },
    {
        titulo: "Titulo para el ejemplo",
        contenido: "El proyecto es una plataforma de aprendizaje en línea que busca brindaracceso a recursos educativos de alta calidad a estudiantes de todo el mundo."
    },

]

const About: React.FC<aboutProps> = ({ darkMode }) => {
    return (
        <section>
            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Sobre nosotros</h2>
            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Conoce a cerca de nuestros servicios</h4>
            <div className={darkMode ? 'headAboutDark' : 'headAbout'} >
                <img src="https://www.tropicanafm.com/wp-content/uploads/2024/01/188012024-SENA.jpg" alt="imagen del acerca de " />
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
        </section>
    )
}

export default About;