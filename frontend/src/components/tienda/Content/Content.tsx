import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import Card from "../../shared/Card/Cards";
import Swiper from "../../shared/Swiper/swiper";
import Loader from './../../shared/Loaders/Loader';
import './Content.css';
import NotfoundPage from '../../../global/NotfoundPage';

interface ContenidoProps {
    productos: any[];
    loading: boolean;
    dataLenght: number;
    page: number;
    setPage: (page: number) => void;
}

const Content: React.FC<ContenidoProps> = ({ productos, loading, dataLenght, page, setPage }) => {
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const carrouselData = [
        {
            foto: '/public/5.jpeg'
        },
        {
            foto: '/public/4.jpg',
        },
    ];

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
                        dataLenght > 0 ? (

                            <>
                                <div className='product-container-light'>
                                    <div className="h-min-500px flex flex-wrap">
                                        {
                                            productos?.length > 0 && productos.map((producto, index) => {
                                                return (
                                                    <Card key={index} producto={producto} />
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="w-95 flex align-center justify-center h-min-100px">
                                        <Pagination
                                            count={Math.ceil(dataLenght / 20)}
                                            page={page}
                                            showFirstButton
                                            showLastButton
                                            onChange={(event, value) => setPage(value)}
                                            className="flex flex-row w-full justify-center my-6"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <NotfoundPage boton={true} />
                            </>
                        )
                    )
                }
            </div>
            
        </section>
    );
};
export default Content;