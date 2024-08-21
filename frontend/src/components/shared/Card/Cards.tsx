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

    const getImageSrc = (base64Image: string | undefined) => {
        // Si la imagen base64 ya tiene un prefijo, simplemente la retorna
        console.log("entra")
        if (base64Image && base64Image.startsWith('data:image/')) {
            return base64Image;
        }
        // Si no tiene prefijo, asume que es JPEG como default
        return base64Image ? `data:image/jpeg;base64,${base64Image}` : '';
    };

    return (
        <div className={darkMode ? 'cardbody cardBodyDark' : 'cardbody cardBodyLight'}>
            <Link to={`/product/${producto.slug}`}>
                <div className='imgContent'>
                    <img src={getImageSrc(producto.first_image)} alt="Imagen del producto" />
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
                        <h6>${producto.price}</h6>
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
