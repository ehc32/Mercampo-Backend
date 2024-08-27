import React, { useEffect, useState } from "react";
import { get_all_products } from '../api/products';
import Footer from "../components/Footer";
import About from "../components/home/About/About";
import Hero from "../components/home/Hero";
import RandomProducts from "../components/home/RandomProducts";
import Swiper from "../components/shared/Swiper/swiper";
import { useDarkMode } from "../hooks/theme";
import { AnimatePresence, motion } from "framer-motion";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { useAbierto } from "../hooks/aside";

export default function Tienda() {
    const { darkMode } = useDarkMode();
    const [productosRandom, setProductosRandom] = useState([]);


    const { abierto, toggleAbierto } = useAbierto();
    
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
            <AnimatePresence>
                {abierto && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AsideFilter />
                    </motion.aside>
                )}
            </AnimatePresence>
            <Hero />
            <RandomProducts productos={productosRandom} />
            <Swiper width="100%" height="50vh" datos={carrouselData} isUpSwiper={false} />
            <About />
            <Footer />
        </React.Fragment>
    );
}
