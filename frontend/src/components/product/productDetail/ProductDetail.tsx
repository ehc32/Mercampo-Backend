import 'bootstrap-icons/font/bootstrap-icons.min.css';
import MySwiper from '../../shared/Swiper/swiper';
import Map from '../map/Map';
import './../../../global/dashlite.css';
import './styles.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_solo } from './../../../api/products';
import Skeleton from 'react-loading-skeleton';

interface ProductProps {
    darkMode: boolean;
}

interface Producto {
    price?: number;
    name?: string;
    description?: string;
    category?: string;
    locate?: string;
}

const ProductDetail: React.FC<ProductProps> = ({ darkMode }) => {
    const carrouselData = [
        {
            foto: 'https://c.wallhere.com/photos/d1/7d/1920x1080_px_Blurred_Clear_Sky_Depth_Of_Field_grass_Green_landscape_macro-789849.jpg!d',
        },
        {
            foto: 'https://c.wallhere.com/photos/8b/29/nature_sunlight_grass_macro_trees_shadow_lens_flare-167088.jpg!d',
        },
    ];

    const { slug } = useParams<{ slug: string }>(); // Accede al slug de la URL
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const productoData = await get_solo(slug);
                setProducto(productoData);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener el producto: ', error);
                setLoading(false);
            }
        };

        fetchProducto();
    }, [slug]);

    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear(); // getFullYear() para obtener el año completo

        return `${dia} de ${mes} de ${año}`;
    }

    return (
        <>
            <div className="nk-main main-detail-product">
                <div className="nk-wrap">
                    <div className="nk-content ">
                        <div className="container-fluid">
                            <div className="nk-content-body">
                                <div className="nk-block">
                                    <div className="card card-bordered">
                                        <div className="card-inner">
                                            <div className="row pb-5">
                                                <div className="col-lg-6">
                                                    <div className="product-gallery mr-xl-1 mr-xxl-5 p-4">
                                                        <h4 className='titleProductoPreview'>Visualización del producto</h4>
                                                        <MySwiper width={"100%"} height={"40vh"} datos={carrouselData} isUpSwiper={false} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="product-info mt-5 mr-xxl-5 h-96 flex justify-between flex-col">
                                                        <div>
                                                            <div className='flex flex-row justify-between'>

                                                                <h2 className="fs-21px fw-bold mb-3 product-title">
                                                                    {loading ? (
                                                                        <Skeleton />
                                                                    ) : (
                                                                        producto?.name
                                                                    )}
                                                                </h2>
                                                                <h4 className="fs-21px fw-bold product-price text-primary w-40  text-center">
                                                                    {loading ? (
                                                                        <Skeleton style={{ width: '100px', height: '100px' }} />
                                                                    ) : (
                                                                        `$ ${producto?.price}`
                                                                    )}
                                                                </h4>
                                                            </div>
                                                            <div className="product-rating">
                                                                <ul className="rating">
                                                                    <li><em className="icon ni ni-star-fill"></em></li>
                                                                    <li><em className="icon ni ni-star-fill"></em></li>
                                                                    <li><em className="icon ni ni-star-fill"></em></li>
                                                                    <li><em className="icon ni ni-star-fill"></em></li>
                                                                    <li><em className="icon ni ni-star-half"></em></li>
                                                                </ul>
                                                                <div className="amount">(2 Reviews)</div>
                                                            </div>
                                                        </div>
                                                        <div className="product-excrept text-soft h-32">
                                                            <p className="lead">{producto?.description}</p>
                                                        </div>
                                                        <div>

                                                            <div className="product-meta">
                                                                <ul className="d-flex g-3 gx-5">
                                                                    <li>
                                                                        <div className="fs-14px text-muted">Categoría</div>
                                                                        <div className="fs-16px fw-bold text-secondary">{producto?.category}</div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="fs-14px text-muted">Localización</div>
                                                                        <div className="fs-16px fw-bold text-secondary">{producto?.locate}</div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="fs-14px text-muted">Fecha de publicación</div>
                                                                        <div className="fs-16px fw-bold text-secondary">{formatearFecha(producto?.created)}</div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="product-meta">
                                                                <div className='productCatn'>
                                                                    <div className="fs-14px text-muted">Selecciona una cantidad</div>
                                                                    <div className="fs-16px fw-bold text-secondary total">$0</div>
                                                                </div>
                                                                <ul className="d-flex flex-wrap ailgn-center g-2 pt-1 pl-4">
                                                                    <li className="w-140px item-row">
                                                                        <div className="cantidadOrden">
                                                                            <button
                                                                                className="btn btn-icon btn-outline-light number-spinner-btn number-minus"
                                                                                data-number="minus"
                                                                                onClick={() => {
                                                                                    const input = document.querySelector('.input-increment') as HTMLInputElement;
                                                                                    const currentValue = parseInt(input.value);
                                                                                    const totalElement = document.querySelector('.total');
                                                                                    const productoprice = producto?.price || 0;
                                                                                    input.value = (currentValue <= 0 ? 0 : currentValue - 1).toString();
                                                                                    totalElement!.innerText = currentValue <= 0 ? '$0' : `$${(currentValue - 1) * productoprice}`;
                                                                                }}
                                                                            >
                                                                                <em className="icon bi bi-dash"></em>
                                                                            </button>
                                                                            <input
                                                                                type="number"
                                                                                value="0"
                                                                                className='input-increment'
                                                                                disabled
                                                                            />
                                                                            <button
                                                                                className="btn btn-icon btn-outline-light number-spinner-btn number-plus"
                                                                                data-number="plus"
                                                                                onClick={() => {
                                                                                    const input = document.querySelector('.input-increment') as HTMLInputElement;
                                                                                    const currentValue = parseInt(input.value);
                                                                                    const totalElement = document.querySelector('.total');
                                                                                    const productoprice = producto?.price || 0;
                                                                                    input.value = (currentValue + 1).toString();
                                                                                    totalElement!.innerText = `$${(currentValue + 1) * productoprice}`;
                                                                                }}
                                                                            >
                                                                                <i className="icon bi bi-plus"></i>
                                                                            </button>
                                                                        </div>
                                                                        <button className="btn btn-primary">Añadir al carrito</button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Map address='el tablon, palermo huila' darkMode={darkMode} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetail;
