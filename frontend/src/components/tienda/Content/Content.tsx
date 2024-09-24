import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import Footer from '../../Footer';
import Card from '../../shared/Card/Cards';
import Loader from './../../shared/Loaders/Loader';
import './Content.css';
import NotfoundPage from '../../../global/NotfoundPage';
import TuneIcon from '@mui/icons-material/Tune';
import { useDrawer } from '../../../context/DrawerProvider';
import { Button, TextField } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface ContenidoProps {
    productos: any[];
    loading: boolean;
    dataLenght: number;
    page: number;
    setPage: (page: number) => void;
    searchItem: string;
    setSearchItem: (search: string) => void;
    bringDataFilter: () => void;
    deleteDataFilter: () => void;
}

const Content: React.FC<ContenidoProps> = ({
    productos,
    loading,
    dataLenght,
    page,
    setPage,
    searchItem,
    setSearchItem,
    bringDataFilter,
    deleteDataFilter
}) => {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const buscarTextfield = (e: string) => {
        setSearchItem(e);
        bringDataFilter();
    };

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchItem(value);

        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
            buscarTextfield(value);
        }, 1000);

        setTimer(newTimer);
    };

    const { abierto, toggleAbierto } = useDrawer();


    const isWideScreen = window.innerWidth > 900;

    return (
        <section className="contenidoTienda">
            {/* <Swiper width="92%" height="300px" datos={carrouselData} isUpSwiper={true} /> */}
            {/* aquí las cards de productos */}

            <div>
                <div className='flex flex-col '>
                    <div className='w-20'></div>
                    <div>
                        <h2 className='titulo-sala-compra-light'>Una gran variedad de productos</h2>
                        <h4 className='sub-titulo-sala-compra-light'>Encuentra productos de alta calidad a los mejores precios</h4>
                    </div>
                    <p className='mt-4'>Busca de manera dinamica los productos que mas se adecuen a lo que nesesitas, para ello se han dispuesto filtros en donde especificar un poco más lo que buscas.</p>
                    <div className={ isWideScreen ? 'flex flex-col sm:flex-row items-center justify-center gap-4 my-10' : 'flex flex-row mx-2 sm:flex-row items-center justify-center gap-2 my-8'}>
                        <Button
                            variant="contained"
                            className='flex align-center'
                            color="error"
                            onClick={deleteDataFilter}
                        >
                            <DeleteSweepIcon />
                            {
                                isWideScreen &&
                                <p>Borrar filtros</p>
                            }
                        </Button>
                        <div
                            onClick={toggleAbierto}
                            className='flex items-center gap-2 cursor-pointer '
                        >
                            <TuneIcon />
                            {
                                isWideScreen &&
                                <span>Filtrar productos</span>
                            }
                        </div>
                        <form
                            action=""
                            onSubmit={(e) => e.preventDefault()}
                            className='flex-1 max-w-lg'>
                            <TextField
                                fullWidth
                                id="search"
                                label="Buscar producto  ..."
                                value={searchItem}
                                onChange={handleChange2}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#39A900',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#39A900',
                                    },
                                }}
                            />

                        </form>
                    </div>
                </div>

                {
                    loading ? (
                        <div className="flex justify-center items-center">
                            <Loader />
                        </div>
                    ) : (
                        dataLenght > 0 ? (
                            <>
                                <div className='product-container-light'>
                                    <div className="flex flex-wrap intern">
                                        {
                                            productos.length > 0 && productos.map((producto, index) => (
                                                <Card key={index} producto={producto} />
                                            ))
                                        }
                                    </div>
                                    <div className="w-95 flex items-center justify-center h-min-100px">
                                        <Pagination
                                            count={Math.ceil(dataLenght / 20)}
                                            page={page}
                                            showFirstButton
                                            showLastButton
                                            onChange={handleChange}
                                            className="flex flex-row w-full justify-center my-6"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NotfoundPage boton={true} />
                        )
                    )
                }
            </div>
        </section>
    );
};

export default Content;
