import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper';

interface Producto {
    nombre: string;
    foto: string;
    precio: number;
}

interface CarrouselLast12Props {
    productos: Producto[];
    darkMode: boolean;
}

const CarrouselLast12: React.FC<CarrouselLast12Props> = ({ productos, darkMode }) => {
    return (
        <div className="container">
            <h1 className="heading">Flower Gallery</h1>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"
            >
                {
                    productos.map((product, index) => (

                        <SwiperSlide key={index}>
                            <img src={product.foto} alt="slide_image" />
                        </SwiperSlide>
                    ))


                }
                <div className="slider-controler">
                    <div className="swiper-button-prev slider-arrow">
                        <i className="bi bi-arrow-right"></i>
                    </div>
                    <div className="swiper-button-next slider-arrow">
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </Swiper>
        </div >
    );
}

export default CarrouselLast12;
