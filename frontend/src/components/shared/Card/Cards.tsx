import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cart';
import './Card.css';
import { useState } from 'react';


interface Producto {
    nombre?: string;
    foto?: string;
    price?: number;
    description?: string;
    locate?: string;
    categoria?: string;
    fecha?: string;
}

interface CarrouselLast12Props {
    producto: Producto[];
    darkMode: boolean;
    loading: boolean;
}

const Card: React.FC<CarrouselLast12Props> = ({ producto, darkMode, loading }) => {



    const addToCart = useCartStore(state => state.addToCart)

    return (
        <>
            <div className={darkMode ? 'cardbody cardBodyDark' : 'cardbody cardBodyLight'}>
                <Link to={`/product/${producto.slug}`}>
                    <div className='imgContent'>

                        {/* <img src={producto.foto} alt="Imagen del producto" /> */}
                    
                                <img src="data:image/jpeg;base64,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" alt="Imagen del producto" />
                                
                    </div>
                    <div className='minihead'>
                        <hr />
                    </div>
                </Link>
                <div className='infoContent'>
                    <div>
                        <h4 className={darkMode ? 'headInfo-dark' : 'headInfo-light'}>{producto.name}</h4>
                        <h4 className='headInfo'>{producto.category}</h4>
                    </div>
                    <p className='headInfo'>{producto.description.slice(0, 100)}</p>
                    <div className='footerInfo'>
                        <div>
                            <h6>$ {producto.price}</h6>
                            <span>{producto.locate.slice(0, 15)}, {producto.fecha}</span>
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