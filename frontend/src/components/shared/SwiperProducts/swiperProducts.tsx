import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination,Autoplay } from 'swiper/modules';
import Card from '../Card/Cards';
import Loader from './../../shared/Loaders/Loader';

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
  darkMode: boolean;
  isUpSwiper?: boolean;
  loader: boolean;
  datos: Producto[];
}

const SwiperProducts: React.FC<SwiperPropsP> = ({ width, height, darkMode, datos, loader }) => {
  return (


    <div className="nk-main main-detail-product">
      
      <div className="nk-wrap">
        <div className="nk-content ">
          <div className="container-fluid">
            <div className="nk-content-body">
              <div className="nk-block">
                <div className={darkMode ? "card2" : "card card-bordered"}>
                  <div className="card-inner">
                    <div className="row pb-5">
                      <div className="col-lg-12">
                        <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Productos similares</h2>
                        <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Variedad de productos de la misma categoria</h4>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwiperProducts;
