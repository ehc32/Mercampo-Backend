import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';
import Card from '../Card/Cards';

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
  datos: Producto[];
}

const SwiperProducts: React.FC<SwiperPropsP> = ({ width, height, darkMode, datos }) => {
  return (<div className="nk-main main-detail-product">
    <div className="nk-wrap">
      <div className="nk-content ">
        <div className="container-fluid">
          <div className="nk-content-body">
            <div className="nk-block">
              <div className="card card-bordered">
                <div className="card-inner">
                  <div className="row pb-5">
                    <div className="col-lg-12">
                      <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Productos similares</h2>
                      <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Variedad de productos de la misma categoria</h4>
                      <Swiper
                        slidesPerView={5}
                        spaceBetween={10}
                        pagination={{
                          clickable: true,
                        }}
                        style={{ width, height }}
                        modules={[Pagination]}
                        className="mySwiper"
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
                            <Card producto={item} darkMode={darkMode} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
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
