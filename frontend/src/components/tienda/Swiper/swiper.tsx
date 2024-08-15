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
  return (
    <Swiper navigation={true}  modules={[Navigation]} className="mySwiper">
      <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
      <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
      <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
      <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
    </Swiper>
  );
}
