import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';

// import required modules
import { Navigation } from 'swiper/modules';

export default function App() {

  const datos = [
    {
      nombre: 'Piña',
      foto: 'https://c.wallhere.com/photos/3f/cf/plants_beautiful_field_portland_island_corn_cornfield_perfect-1027216.jpg!d',
      precio: 14.00,
      locate: "Neiva",
      description: "La piña es una fruta tropical que se consume fresca o en jugos"
    },
    {
      nombre: 'Mango',
      foto: 'https://c.wallhere.com/photos/45/5b/outdoors_field_summer_plants-1929021.jpg!d',
      precio: 14.00,
      locate: "Neiva",
      description: "La piña es una fruta tropical que se consume fresca o en jugos"
    }
  ];
  return (
    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      {
        datos.map((producto) => (

          <SwiperSlide><img src={producto.foto} alt="alt" /></SwiperSlide>

        ))
      }

    </Swiper>
  );
}
