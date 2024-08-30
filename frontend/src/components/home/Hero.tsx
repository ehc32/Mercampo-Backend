import { Link } from 'react-router-dom';
import './Style.css'

interface CarrouselLast12Props {
    darkMode: boolean;
}
const Hero: React.FC<CarrouselLast12Props> = () => {
    return (
        <section className='hero-light flex flex-row flex-wrap'>
            <div className='hero-text-light'>
                <h1>Descubre las mejores ofertas</h1>
                <p>En nuestra tienda online encontrarás los productos que necesitas</p>
                <Link to="/store">
                    <button className='hero-button-light'>Compra ahora!</button>
                </Link>
            </div>
            <img src="../../../public/heroimg.png" alt="Hero img" className="hero-img" />
        </section>
    )
}

export default Hero;