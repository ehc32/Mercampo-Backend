import React, { useEffect, useState } from "react";
import { get_all_products } from '../api/products';
import Footer from "../components/Footer";
import About from "../components/home/About/About";
import Hero from "../components/home/Hero";
import Participants from "../components/home/Participants/Participants";
import RandomProducts from "../components/home/RandomProducts";
import Swiper from "../components/shared/Swiper/swiper";
import SwiperNewProducts from "../components/shared/SwiperNewsProducts/swiperNewsProducts";
import Whatsapp from "../components/shared/WhatsappButton/Whatsapp";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";


export default function Tienda() {

    const [productosRandom, setProductosRandom] = useState([]);

    const people = [
        {
            name: "Nicolás Cerquera Nieva",
            photo: "/public/fondoa.jpg",
            role: "Desarrollador de software y diseñador gráfico",
        },
        {
            name: "Nicolás Cerquera Nieva",
            photo: "/public/fondoa.jpg",
            role: "Desarrollador de software y diseñador gráfico",
        },
        {
            name: "Nicolás Cerquera Nieva",
            photo: "/public/fondoa.jpg",
            role: "Desarrollador de software y diseñador gráfico",
        },
        {
            name: "Nicolás Cerquera Nieva",
            photo: "/public/fondoa.jpg",
            role: "Desarrollador de software y diseñador gráfico",
        },
    ]



    const fetchProductos = async () => {
        try {
            const productos = await get_all_products();
            setProductosRandom(productos);

        } catch (error) {
            console.error('Error al obtener los productos: ', error);
        }
    };

    const fetchNewProductos = async () => {
        try {
            const productos = await get_all_products();
            setProductosRandom(productos);

        } catch (error) {
            console.error('Error al obtener los productos: ', error);
        }
    };

    useEffect(() => {
        void fetchProductos();
        void fetchNewProductos();
    }, []);

    const carrouselData = [
        {
            foto: '/public/campesena.jpg'
        },
        {
            foto: '/public/campesena1.jpg'
        },
        {
            foto: '/public/campesena4.jpg'
        },
        {
            foto: '/public/campesena2.jpeg'
        },

    ]

    return (
        <React.Fragment>
            <AsideFilter />
            <Hero />
            <SwiperNewProducts width="100%" height="55vh" loader={true} datos={productosRandom} />
            <RandomProducts productos={productosRandom} />
            <About />
            <Swiper width="60%" height="40vh" datos={carrouselData} isUpSwiper={false} />
            <Participants people={people} />
            <Whatsapp />
            <Footer />
        </React.Fragment>
    );
}
