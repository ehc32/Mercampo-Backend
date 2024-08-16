import Accordion from "../../shared/Accordion/Accordion"


const About = () => {
    return (
        <section>
            <h1>Servicios tecnológicos</h1>
            <div className="acordionContainer">
                <Accordion titulo={"titulo"} contenido={"lorem lotem lorem"}/>
            </div>
        </section>
    )
}

export default About;