import React, { useEffect, useState } from "react";
import { get_all_products } from "../api/products";
import About from "../components/home/About/About";
import Hero from "../components/home/Hero";
import Participants from "../components/home/Participants/Participants";
import RandomProducts from "../components/home/RandomProducts";
import SwiperNewProducts from "../components/shared/SwiperNewsProducts/swiperNewsProducts";
import Whatsapp from "../components/shared/WhatsappButton/Whatsapp";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import PaypalIntro from "../components/home/paypalInfo";


export default function Tienda() {
  const [productosRandom, setProductosRandom] = useState([]);

  const people = [

    {
      name: "Yan Carlos Cerquera",
      photo: "/public/carlos.jpeg",
      role: "Ingeniero Electronico"
    },
    {
      name: "Edgar Eduardo Olarte",
      photo: "/public/eduar.jpeg",
      role: "Ingeniero de Sistemas"
    },
    {
      name: "Nicolás Cerquera Nieva",
      photo: "/public/Nicolas.jpeg",
      role: "Tecnólogo en ADSO"
    },
    {
      name: "Juan Nicolás Escobar",
      photo: "/public/escobar.jpeg",
      role: "Tecnólogo en ADSO"
    },

  ];

  const fetchProductos = async () => {
    try {
      const productos = await get_all_products();
      setProductosRandom(productos);
    } catch (error) {
      console.error("Error al obtener los productos: ", error);
    }
  };

  useEffect(() => {
    void fetchProductos();
  }, []);

  const carrouselData = [
    { foto: "/public/1.jpg" },
    { foto: "/public/2.jpg" },
    { foto: "/public/4.jpg" },
    { foto: "/public/fondoa.jpeg" },
  ];

  return (
    <React.Fragment>
      <div className="home-container">
        <AsideFilter />
        <Hero />
      
        <RandomProducts productos={productosRandom} />
        <PaypalIntro />
        <About />
        <Participants people={people} />
        <Whatsapp />

      </div>
    </React.Fragment>
  );
}
