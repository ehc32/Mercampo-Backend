import React from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Style.css';

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

            <Swiper
                className='carrousel'
                slidesPerView={6}
                spaceBetween={0}
                freeMode={true}
                loop={true}
                autoplay={{
                    delay: 5000,
                }}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    800: {
                        slidesPerView: 3,
                    },
                    1300: {
                        slidesPerView: 4,
                    },
                    2300: {
                        slidesPerView: 6,
                    },
                    2800: {
                        slidesPerView: 7,
                    },
                }}
            >
                {productos.map((dato, index) => (
                    <SwiperSlide key={index}>
                        <div className={darkMode ? 'card-products-dark' : 'card-products-light'}>
                            <img src={dato.foto} alt={dato.nombre} />
                            <h5>{dato?.nombre}</h5>
                            <h6>$ {dato?.price ? dato.price : "--"} </h6>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default CarrouselLast12;