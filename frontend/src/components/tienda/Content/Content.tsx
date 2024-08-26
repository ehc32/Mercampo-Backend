import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Card from "../../shared/Card/Cards";
import Swiper from "../../shared/Swiper/swiper";
import Loader from './../../shared/Loaders/Loader';
import './Content.css';

interface ContenidoProps {
    productos: any[];
    loading: boolean;
    dataLenght: number;
    page: number;
    setPage: (page: number) => void;
}

const Content: React.FC<ContenidoProps> = ({ productos, loading, dataLenght, page, setPage }) => {
    const [productosNuevos, setProductosNuevos] = useState<any[]>([]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
        setProductosNuevos([]); // Vacía el estado de productosNuevos
        if (productos.length > 0) { // Asegúrate de que productos tenga elementos
            const agregarProductos = () => {
                const productosPagina = productos.slice((page - 1) * 20, page * 20);
                setProductosNuevos(productosPagina);
            }
            agregarProductos();
        }
    }, [productos, page]); // Agrega productos y page como dependencias



    return (
        <section className="contenidoTienda">
            <Swiper width="92%" height="300px" datos={carrouselData} isUpSwiper={true} />
            {/* aqui las cards de productos*/}

            <div>
                <h2 className='titulo-sala-compra-light'>Una gran variedad de productos</h2>
                <h4 className='sub-titulo-sala-compra-light'>Encuentra productos de alta calidad a los mejores precios</h4>

                {
                    loading ? (
                        <div className="flex justify-center align-center h-100px">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className='product-container-light'>
                                <div className="h-min-500px flex flex-wrap">

                                    {
                                        productosNuevos.length > 0 && productosNuevos.map((producto, index) => {
                                            return (
                                                <Card key={index} producto={producto} />
                                            )
                                        })
                                    }
                                </div>
                                <div className="w-95 flex align-center justify-center h-min-100px">

                                    <Pagination
                                        count={Math.floor(dataLenght / 20) + 1}
                                        page={page}
                                        onChange={handleChange}
                                        showFirstButton
                                        showLastButton
                                        sx={{
                                            color:  '#000',
                                            '.MuiPaginationItem-root': {
                                                color:  '#000',
                                            },
                                            '.Mui-selected': {
                                                backgroundColor:  '#ccc',
                                            },
                                            '.MuiPaginationItem-root.Mui-focused': {
                                                outline: 'none', // Elimina el borde de foco
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
            <Footer />
        </section>
    );
};
export default Content;