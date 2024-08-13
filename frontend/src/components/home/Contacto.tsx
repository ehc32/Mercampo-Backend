import './Style.css'

interface CarrouselLast12Props {
    darkMode: boolean;
}

const Contacto: React.FC<CarrouselLast12Props> = ({ darkMode }) => {

    return (

        <section className={darkMode ? 'contacto-dark' : 'contacto'}>
            <h4 className={darkMode ? 'card-name-dark' : 'card-name-light'}>Formulario de contacto</h4>
            <h6 className={darkMode ? 'card-subname-dark' : 'card-subname-light'}>¿Alguna inquietud? Envíanos un correo</h6>
            <form className='contactForm'>
                <div className="form-group">
                    <label className={darkMode ? 'label-dark' : 'label-light'} htmlFor="nombreCompleto">Nombre Completo</label>
                    <input type="text" id="nombreCompleto" className={darkMode ? 'input-dark' : 'input-light'} required />
                </div>
                <div className="form-group">
                    <label className={darkMode ? 'label-dark' : 'label-light'} htmlFor="correo">Correo electrónico</label>
                    <input type="email" id="correo" className={darkMode ? 'input-dark' : 'input-light'} required />
                </div>
                <div className="form-group">
                    <label className={darkMode ? 'label-dark' : 'label-light'} htmlFor="telefono">Teléfono (opcional)</label>
                    <input type="tel" id="telefono" className={darkMode ? 'input-dark' : 'input-light'} />
                </div>
                <div className="form-group">
                    <label className={darkMode ? 'label-dark' : 'label-light'} htmlFor="mensaje">Mensaje</label>
                    <textarea id="mensaje" className={darkMode ? 'textarea-dark' : 'textarea-light'} required></textarea>
                </div>
                <button type="submit" className={darkMode ? 'btn-dark' : 'btn-light'}>Enviar</button>
            </form>
        </section>

    )

}

export default Contacto;