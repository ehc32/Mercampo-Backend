import { useState } from "react";
import Swipper from "../Swiper/swiper"
import './Content.css';

interface CarrouselLast12Props {
    darkMode: boolean;
    byCategory: string[] | "all";
}

const Content: React.FC<CarrouselLast12Props> = ({ byCategory, darkMode }) => {

    return (

        <section className="contenidoTienda">
            <Swipper />
            <div>
                {/* aqui las cards de productos*/}

                {
                    byCategory.includes("all") ?
                        (
                            <div>
                                <h2>Todos los productos</h2>
                            </div>
                        ) : (
                            <div>
                                <h2>Producto de {Array.isArray(byCategory) && byCategory.length > 1 ? "las categorias" : "la categoria "} {Array.isArray(byCategory) && byCategory.map((categoria) => categoria).join(', ')}</h2>
                            </div>
                        )
                }
            </div>
        </section >

    )
}

export default Content;