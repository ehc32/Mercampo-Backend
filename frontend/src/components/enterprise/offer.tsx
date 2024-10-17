import { useState } from 'react';
import './style.css'
import { Rating } from '@mui/material';
import { ShoppingCartIcon, StarIcon } from 'lucide-react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const OfferEnterprise = () => {

    const [images, setImages] = useState([
        {
            image: "./../../../public/campo2.webp"
        },
        {
            image: "./../../../public/campesena4.jpg"
        },
        {
            image: "./../../../public/campesena2.jpeg"
        }
    ]);


    return (
        <>
        <div className='container-offer shadow flex flex-col justify-between'>
            <div className='h-16 justify-between flex flex-row p-4 align-center'>
                <div className="flex flex-row align-center">
                    <img className='mr-3 photocont' />
                    <div className="flex flex-col">
                        <p className='fs-16px text-black font-bold'>Nombre del usuario</p>
                        <span>rol</span>
                    </div>
                </div>
                <div className="fs-16px font-bold text-end">
                    <p className='text-[#39A900] '>
                        11 de septiembre del 2024
                    </p>
                    <span className="fs-14px">Neiva, Huila</span>
                </div>
            </div>

            <div className='imageContainer'>
                {
                    images.map((img, index) => (

                        <img src={img.image} key={index} />
                    ))
                }
            </div>
            <div className='flex flex-row h-24 footer-offer align-center justify-between'>
                <div className='flex flex-col descripcion'>
                    <p>Nombre del producto</p>
                    <p>Categoría</p>
                    <p>$ Precio</p>
                </div>
                <div className='flex flex-col align-end'>
                    <div className='flex flex-col footers2'>
                        <Rating
                            name="read-only"
                            value={2}
                            readOnly
                            precision={0.5}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            sx={{ marginBottom: 1 }}
                        />
                        {/* <button className='bg-[#39A900] borde fs-18px p-1 text-white m-1 flex flex-row '><ShoppingCartIcon className='mx-1' /><p>Agregar al carrito</p></button> */}
                    </div>
                    <div>
                        <button className='bg-[#fff] borde2 text-[#39A900] fs-18px p-1 m-1 font-semibold'>Detalles</button>
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
};

export default OfferEnterprise;
