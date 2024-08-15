import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';

// import required modules
import { Navigation } from 'swiper/modules';


interface Producto {
    nombre?: string;
    foto?: string;
    precio?: number;
    description?: string;
    locate?: string;
    id?: number;

}

interface CarrouselLast12Props {
    producto: Producto[];
    darkMode: boolean;
}

const Card: React.FC<CarrouselLast12Props> = ({ producto, darkMode }) => {
    return (
        <div className={darkMode ? "card" : "card"}>
            <div>
                <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                    <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
                    <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
                    <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
                    <SwiperSlide><img src="https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg" alt="alt" /></SwiperSlide>
                </Swiper>
            </div>
            <div>
                <h2>{producto.nombre}</h2>
                <div>Rating aqui</div>
                <div>$ {producto.precio}</div>
                <div>
                    <p>{producto.fecha}</p>
                    <p>{producto.locate}</p>
                </div>
            </div>
        </div>
    )
}