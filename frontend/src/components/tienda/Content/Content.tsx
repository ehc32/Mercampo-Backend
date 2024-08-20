import { useState } from "react";
import Card from "../../shared/Card/Cards";
import Swiper from "../../shared/Swiper/swiper";

import Footer from "../../Footer";
import './Content.css';

interface CarrouselLast12Props {
    darkMode: boolean;
    byCategory: string[] | "all";
    productos: Producto[]
}

interface Producto {
    nombre?: string;
    foto?: string;
    price?: number;
    description?: string;
    locate?: string;
    categoria?: string;
    fecha?: string;
}

const Content: React.FC<CarrouselLast12Props> = ({ byCategory, darkMode, productos }) => {

    const [isUpSwiper, setIsUpSwiper] = useState<boolean>()


    const carrouselData = [
        {
            foto: 'https://c.wallhere.com/photos/d1/7d/1920x1080_px_Blurred_Clear_Sky_Depth_Of_Field_grass_Green_landscape_macro-789849.jpg!d'
        },
        {
            foto: 'https://c.wallhere.com/photos/8b/29/nature_sunlight_grass_macro_trees_shadow_lens_flare-167088.jpg!d',
        },
    ];


    console.log(productos)

    return (
        <section className="contenidoTienda">
            <Swiper width="92%" height="300px" datos={carrouselData} isUpSwiper={true} />
            {/* aqui las cards de productos*/}

            {
                byCategory.includes("all") ?
                    (
                        <div>
                            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Una gran variedad de productos</h2>
                            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Encuentra productos de alta calidad a los mejores prices</h4>
                            <div className={darkMode ? 'product-container-dark' : 'product-container-light'}>
                                {
                                    productos.map((producto) => (
                                        <Card producto={producto} darkMode={darkMode} />
                                    ))
                                }
                            </div>
                        </div>

                    ) : (
                        <div>
                            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Gran variedad de productos en todas las categorias</h2>
                            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Encuentra algo que te guste de manera eficiente</h4>
                            <div className={darkMode ? 'product-container-dark' : 'product-container-light'}>
                                {
                                    productos.map((producto) => (
                                        <Card producto={producto} darkMode={darkMode} />
                                    ))
                                }
                            </div>
                        </div>
                    )
            }
            <Footer />
        </section >

    )
}

export default Content;