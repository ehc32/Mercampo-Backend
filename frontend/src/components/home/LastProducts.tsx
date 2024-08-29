import React from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Style.css';
import SwiperProducts from '../shared/SwiperProducts/swiperProducts';

interface Producto {
    nombre: string;
    foto: string;
    price: number;
}

interface CarrouselLast12Props {
    productos: Producto[];
    darkMode: boolean;
}

const CarrouselLast12: React.FC<CarrouselLast12Props> = ({ productos, darkMode }) => {
    return (
        <>
            <h4 className={darkMode ? 'card-name-dark' : 'card-name-light'}>Ultimos añadidos</h4>
            <h6 className={darkMode ? 'card-subname-dark' : 'card-subname-light'}>Descubre ofertas recientemente añadidas a un price unico</h6>

            <SwiperProducts />
        </>
    );
};

export default CarrouselLast12;