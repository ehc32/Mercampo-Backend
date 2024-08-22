import React, { useEffect, useState } from "react";
import { get_all_products } from '../api/products';
import Footer from "../components/Footer";
import About from "../components/home/About/About";
import Hero from "../components/home/Hero";
import RandomProducts from "../components/home/RandomProducts";
import Swiper from "../components/shared/Swiper/swiper";
import { useDarkMode } from "../hooks/theme";

export default function Tienda() {
    const { darkMode } = useDarkMode();
    const [productosRandom, setProductosRandom] = useState([]);


    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const productos = await get_all_products();
                setProductosRandom(productos);
                
            } catch (error) {
                console.error('Error al obtener los productos: ', error);
            }
        };

        void fetchProductos();
    }, []);

    const carrouselData = [
        {
            foto: 'https://periodismopublico.com/wp-content/uploads/2019/06/Sena-.jpg'
        },
        {
            foto: 'https://www.elolfato.com/sites/default/files/styles/news_full_image/public/assets/news/foto-home-03022023.png?itok=OVxS2L5E',
        },
    ]

    return (
        <React.Fragment>
            <Hero darkMode={darkMode} />
            <RandomProducts productos={productosRandom} darkMode={darkMode} />
            <Swiper width="100%" height="50vh" datos={carrouselData} isUpSwiper={false} />
            <About darkMode={darkMode} />
            <Footer />
        </React.Fragment>
    );
}
