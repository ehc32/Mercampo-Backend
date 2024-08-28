import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import './Card.css';
import BasicTooltip from '../tooltip/Tooltip';

import { toast } from "react-toastify";
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
}

const Card: React.FC<CarrouselLast12Props> = ({ producto }) => {


    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];

        return `${dia} de ${mes}`;
    }


    return (
        <div className='beforecard'>
            <div className='cardbody cardBodyLight'>
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
                        <h4 className='headInfo-light'>
                            {producto.name?.length > 20 ? `${producto.name?.slice(0, 20)}...` : producto.name}
                        </h4>
                        <h4 className='headInfo'>
                            {(producto.category.charAt(0).toUpperCase() + producto.category.slice(1).toLowerCase())}
                        </h4>
                    </div>
                    <p className='headInfo'>
                        {producto.description?.length > 100 ? `${producto.description?.slice(0, 100)}...` : producto.description}
                    </p>
                    <div className='footerInfo'>
                        <div>
                            <h6>$ {producto.price}</h6>
                            <span>{producto.locate?.slice(0, 15)}, {formatearFecha(producto.created)}</span>
                        </div>
                        <BasicTooltip producto={producto} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
