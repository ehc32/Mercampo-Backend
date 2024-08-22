import React, { useState, useEffect } from "react";
import Card from "../../shared/Card/Cards";
import Swiper from "../../shared/Swiper/swiper";
import Pagination from '@mui/material/Pagination';
import Footer from "../../Footer";
import './Content.css';
import Loader from './../../shared/Loaders/Loader'

interface CarrouselLast12Props {
    darkMode: boolean;
    productos: object;
    loading: boolean;
}

const Content: React.FC<CarrouselLast12Props> = ({ darkMode, productos, loading, error }) => {
    const [page, setPage] = useState(1);
    const [productosNuevos, setProductosNuevos] = useState([])

    const handleChange = (event, value) => {
        setPage(value);
    };

    const carrouselData = [
        {
            foto: 'https://c.wallhere.com/photos/d1/7d/1920x1080_px_Blurred_Clear_Sky_Depth_Of_Field_grass_Green_landscape_macro-789849.jpg!d'
        },
        {
            foto: 'https://c.wallhere.com/photos/8b/29/nature_sunlight_grass_macro_trees_shadow_lens_flare-167088.jpg!d',
        },
    ];


    useEffect(() => {
        const agregarProductos = () => {

            productos.forEach((producto) => {
                setProductosNuevos((prevProductos) => [...prevProductos, producto]);
            });
            
        };
        agregarProductos();
    }, [productos]);

    return (
        <section className="contenidoTienda">
            <Swiper width="92%" height="300px" datos={carrouselData} isUpSwiper={true} />
            {/* aqui las cards de productos*/}

            <div>
                <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Una gran variedad de productos</h2>
                <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Encuentra productos de alta calidad a los mejores prices</h4>

                {
                    loading ? (
                        <Loader />
                    ) : (
                        <>
                            <div className={darkMode ? 'product-container-dark' : 'product-container-light'}>
                                {
                                    productosNuevos.slice((page - 1) * 20, page * 20).map((producto, index) => {
                                        return (
                                            <Card key={index} producto={producto} darkMode={darkMode} />
                                        )
                                    })
                                }
                            </div>
                            <div>

                                <Pagination
                                    count={3}
                                    page={page}
                                    onChange={handleChange}
                                    showFirstButton
                                    showLastButton
                                />
                            </div>
                        </>
                    )
                }
            </div>

        </section>
    );
};
export default Content;