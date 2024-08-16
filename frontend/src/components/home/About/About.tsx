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
        titulo: "¿Qué es el proyecto?",
        contenido: "El proyecto es una plataforma de aprendizaje en línea que busca brindaracceso a recursos educativos de alta calidad a estudiantes de todo el mundo."
    },

]

const About: React.FC<aboutProps> = ({ darkMode }) => {
    return (
        <section>
            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Una gran variedad de productos</h2>
            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Encuentra productos de alta calidad a los mejores precios</h4>

            <div className="acordionContainer">
                {
                    contenidoAcordion.map((contenido, index) => (
                        <Accordion key={index} titulo={contenido.titulo} contenido={contenido.contenido} darkMode={darkMode}/>
                    ))

                }
            </div>
        </section>
    )
}

export default About;