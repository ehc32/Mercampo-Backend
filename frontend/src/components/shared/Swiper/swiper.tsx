import React from 'react';
// Import Swiper React components
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';

// Import required modules
import { Navigation } from 'swiper/modules';

// Define the props interface
interface SwiperPropsP {
  width: string;
  height: string;
  isUpSwiper: boolean;
  datos: {
    foto: string;
  }[];
}

// Define the functional component using React.FC and the props interface
const MySwiper: React.FC<SwiperPropsP> = ({ width, height, datos, isUpSwiper }) => {

  return (

    <SwiperReact
      navigation={true}
      modules={[Navigation]}
      className="mySwiper"
      style={{ width, height }}
    >
      {datos.map((producto, index) => (
        <SwiperSlide key={index}>
          <img src={producto.foto} alt="alt" />
          {
            isUpSwiper && (

              <div className="contenedorSwiper">
                <p>
                  Promociones o mensajes aqui junto a la imagen
                </p>
              </div>
            )
          }
        </SwiperSlide>
      ))}
    </SwiperReact>
  );
}

export default MySwiper;
