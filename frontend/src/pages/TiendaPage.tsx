import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import About from "../components/home/About/About";
import Hero from "../components/home/Hero";
import RandomProducts from "../components/home/RandomProducts";
import Swiper from "../components/shared/Swiper/swiper";
import { useDarkMode } from "../hooks/theme";
import { get_all_products } from './../api/products';

export default function Tienda() {
    const { darkMode } = useDarkMode();
    const [productosRandom, setProductosRandom] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const productos = await get_all_products();
                setProductosRandom(productos);
                setLoading(true)
            } catch (error) {
                console.error('Error al obtener los productos: ', error);
            }
        };

        void fetchProductos();
    }, []);

    const carrouselData = [
        {
            foto: 'https://c.wallhere.com/photos/d1/7d/1920x1080_px_Blurred_Clear_Sky_Depth_Of_Field_grass_Green_landscape_macro-789849.jpg!d'
        },
        {
            foto: 'https://c.wallhere.com/photos/8b/29/nature_sunlight_grass_macro_trees_shadow_lens_flare-167088.jpg!d',
        },
    ];

    return (
        <React.Fragment>
            <Hero darkMode={darkMode} />
            <RandomProducts productos={productosRandom} darkMode={darkMode} loading={loading} />
            <Swiper width="100%" height="300px" datos={carrouselData} isUpSwiper={true} />
            <About darkMode={darkMode} />
            <Footer />
        </React.Fragment>
    );
}
