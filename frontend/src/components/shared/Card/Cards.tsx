import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../hooks/cart';
import './Card.css';

interface Producto {
    nombre?: string;
    foto?: string;
    price?: number;
    description?: string;
    locate?: string;
    categoria?: string;
    fecha?: string;
    first_image?: string;
    slug?: string;
    name?: string;
    category?: string;
}

interface CarrouselLast12Props {
    producto: Producto;
    darkMode: boolean;
}

const Card: React.FC<CarrouselLast12Props> = ({ producto, darkMode }) => {
    const addToCart = useCartStore(state => state.addToCart);


    return (
        <div className={darkMode ? 'cardbody cardBodyDark' : 'cardbody cardBodyLight'}>
            <Link to={`/product/${producto.slug}`}>
                <div className='imgContent'>
                    <img src={producto.first_image} alt="Imagen del producto" />
                </div>
                <div className='minihead'>
                    <hr />
                </div>
            </Link>
            <div className='infoContent'>
                <div>
                    <h4 className={darkMode ? 'headInfo-dark' : 'headInfo-light'}>
                        {producto.name}
                    </h4>
                    <h4 className='headInfo'>
                        {producto.category}
                    </h4>
                </div>
                <p className='headInfo'>
                    {producto.description?.slice(0, 100)}
                </p>
                <div className='footerInfo'>
                    <div>
                        <h6>$ {producto.price}</h6>
                        <span>{producto.locate?.slice(0, 15)}, {producto.fecha}</span>
                    </div>
                    <i
                        className='bi bi-cart3'
                        onClick={() => addToCart(producto)}
                    ></i>
                </div>
            </div>
        </div>
    );
};

export default Card;
