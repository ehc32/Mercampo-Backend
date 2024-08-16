
import MySwiper from '../../shared/Swiper/swiper';
import Map from '../map/Map';
import './../../../global/dashlite.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

const ProductDetail = () => {

    const carrouselData = [
        {
            foto: 'https://c.wallhere.com/photos/d1/7d/1920x1080_px_Blurred_Clear_Sky_Depth_Of_Field_grass_Green_landscape_macro-789849.jpg!d'
        },
        {
            foto: 'https://c.wallhere.com/photos/8b/29/nature_sunlight_grass_macro_trees_shadow_lens_flare-167088.jpg!d',
        },
    ];

    const producto =
    {
        nombre: 'Mango2',
        foto: 'https://st4.depositphotos.com/12499764/28026/i/450/depositphotos_280260174-stock-photo-holding-pineapple-sunglasses-hand.jpg',
        precio: 14.00,
        locate: "Neiva",
        description: "La piña es una fruta tropical dulce y jugosa que se consume fresca o en jugos, batidos y otras bebidas refrescantes. Su pulpa suave y fibrosa es rica en vitaminas, minerales y antioxidantes, lo que la hace una excelente opción para una dieta saludable. La piña también se utiliza en la cocina para agregar sabor y textura a platos salados y postres, y su jugo se utiliza como ingrediente en marinadas y salsas. Además, la piña tiene propiedades antiinflamatorias y digestivas, lo que la hace una fruta beneficiosa para la salud en general.",
        fecha: "Agosto 15",
        categoria: "Fruta",
    }

    return (
        <>
            <div className="nk-main main-detail-product">
                <div className="nk-wrap">
                    <div className="nk-content ">
                        <div className="container-fluid">
                            <div className="nk-content-inner">
                                <div className="nk-content-body">
                                    <div className="nk-block ">
                                        <div className="card card-bordered">
                                            <div className="card-inner">
                                                <div className="row pb-5">
                                                    <div className="col-lg-6">
                                                        <div className="product-gallery mr-xl-1 mr-xxl-5 p-4">
                                                            <MySwiper width={"100%"} height={"50vh"} datos={carrouselData} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="product-info mt-5 mr-xxl-5">
                                                            <h4 className="product-price text-primary">$ {producto.precio}</h4>
                                                            <h2 className="product-title">{producto.nombre}</h2>
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
                                                            <div className="product-excrept text-soft">
                                                                <p className="lead">{producto.description}</p>
                                                            </div>
                                                            <div className="product-meta">
                                                                <ul className="d-flex g-3 gx-5">
                                                                    <li>
                                                                        <div className="fs-14px text-muted">Categoria</div>
                                                                        <div className="fs-16px fw-bold text-secondary">{producto.categoria}</div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="fs-14px text-muted">Model Number</div>
                                                                        <div className="fs-16px fw-bold text-secondary">htmlForerunner 290XT</div>
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className="product-meta">
                                                                <ul className="d-flex flex-wrap ailgn-center g-2 pt-1">
                                                                    <li className="w-140px">
                                                                        <div className="htmlForm-control-wrap number-spinner-wrap">
                                                                            <button
                                                                                className="btn btn-icon btn-outline-light number-spinner-btn number-minus"
                                                                                data-number="minus"
                                                                                onClick={() => {
                                                                                    const input = document.querySelector('.number-spinner');
                                                                                    const currentValue = parseInt(input.value);
                                                                                    input.value = currentValue - 1;
                                                                                }}
                                                                            >
                                                                                <em className="icon bi bi-minus"></em>
                                                                            </button>
                                                                            <input type="number" className="htmlForm-control number-spinner" value="0" />
                                                                            <button
                                                                                className="btn btn-icon btn-outline-light number-spinner-btn number-plus"
                                                                                data-number="plus"
                                                                                onClick={() => {
                                                                                    const input = document.querySelector('.number-spinner');
                                                                                    const currentValue = parseInt(input.value);
                                                                                    input.value = currentValue + 1;
                                                                                }}
                                                                            >
                                                                                <i className="icon bi bi-plus"></i>
                                                                            </button>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <button className="btn btn-primary">Añadir al carrito</button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="nk-main main-detail-product">
                <div className="nk-wrap">
                    <div className="nk-content ">
                        <div className="container-fluid">
                            <div className="nk-content-inner">
                                <div className="nk-content-body">
                                    <div className="nk-block ">
                                        <div className="card card-bordered">
                                            <div className="card-inner">
                                                <div className="row pb-5">
                                                    <Map lat={37.7749} lng={-122.4194} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail;