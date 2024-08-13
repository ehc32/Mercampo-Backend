import './Style.css'

interface CarrouselLast12Props {
    darkMode: boolean;
}
const Hero: React.FC<CarrouselLast12Props> = ({ darkMode }) => {
    return (
        <section className={darkMode ? 'hero-dark' : 'hero'}>
            <div className={darkMode ? 'hero-text-dark' : 'hero-text-light'}>
                <h1>Descubre las mejores ofertas</h1>
                <p>En nuestra tienda online encontrarás los productos que necesitas</p>
                <button className={darkMode ? 'hero-button-dark' : 'hero-button-light'}>Compra ahora!</button>
            </div>
            <img src="../../../public/heroimg.png" alt="Hero img" className="hero-img" />
        </section>
    )
}

export default Hero;