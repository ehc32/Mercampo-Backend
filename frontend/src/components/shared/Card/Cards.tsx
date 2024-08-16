import { Link } from 'react-router-dom';
import './Card.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useCartStore } from '../../../store/cart';

interface Producto {
    nombre?: string;
    foto?: string;
    precio?: number;
    description?: string;
    locate?: string;
    categoria?: string;
    fecha?: string;
}

interface CarrouselLast12Props {
    producto: Producto[];
    darkMode: boolean;
}

const Card: React.FC<CarrouselLast12Props> = ({ producto, darkMode }) => {


    const addToCart = useCartStore(state => state.addToCart)

    return (
        <>
            <div className={darkMode ? 'cardbody cardBodyDark' : 'cardbody cardBodyLight'}>
                <Link to="/product/prueba">
                    <div className='imgContent'>
                        <img src={producto.foto} alt="Imagen del producto" />
                    </div>
                    <div className='minihead'>
                        <hr />
                    </div>
                </Link>
                <div className='infoContent'>
                    <div>
                        <h4 className='headInfo'>{producto.nombre}</h4>
                        <h4 className='headInfo'>{producto.categoria}</h4>
                    </div>
                    <p className='headInfo'>{producto.description.slice(0, 100)}</p>
                    <div className='footerInfo'>
                        <div>
                            <h6>$ {producto.precio}</h6>
                            <span>{producto.locate}, {producto.fecha}</span>
                        </div>
                        <i
                            className='bi bi-cart3'
                            onClick={() => addToCart(producto)}></i>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card;