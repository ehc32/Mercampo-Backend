import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';
import Card from '../Card/Cards';
import Loader from '../Loaders/Loader';

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

interface SwiperPropsP {
  width: string;
  height: string;
  isUpSwiper?: boolean;
  loader: boolean;
  datos: Producto[];
}

const SwiperNewProducts: React.FC<SwiperPropsP> = ({ width, height, datos, loader }) => {
  return (
    <div className="nk-main main-detail-product">
      <div className="nk-block">
        <div className="card card-bordered">
          <div className="card-inner">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="titulo-sala-compra-light">Nuevos productos agregados</h2>
                <h4 className="sub-titulo-sala-compra-light">¿Algo que pueda interesarte?</h4>

                {
                  loader ? (
                    <Swiper
                      slidesPerView={5}
                      spaceBetween={10}
                      loop={true}
                      autoplay={{
                        delay: 2000, // Tiempo de retardo entre cada diapositiva (en ms)
                        disableOnInteraction: false, // Continúa con el autoplay después de la interacción del usuario
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      style={{ width, height }}
                      modules={[Pagination, Autoplay]}
                      className="mySwiper cursor-grab active:cursor-grabbing hover:cursor-grab"
                      breakpoints={{
                        0: {
                          slidesPerView: 1,
                          spaceBetween: 10,
                        },
                        720: {
                          slidesPerView: 1,
                          spaceBetween: 10,
                        },
                        810: {
                          slidesPerView: 2,
                          spaceBetween: 15,
                        },
                        1074: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 25,
                        },
                        1600: {

                          slidesPerView: 5,
                          spaceBetween: 30,
                        }
                      }}
                    >
                      {datos.map((item, index) => (
                        <SwiperSlide key={index}>
                          <Card producto={item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <Loader />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwiperNewProducts;