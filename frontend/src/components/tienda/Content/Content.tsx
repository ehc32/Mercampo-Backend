import Card from "../../home/Card/Cards";
import Swipper from "../Swiper/swiper"
import './Content.css';

interface CarrouselLast12Props {
    darkMode: boolean;
    byCategory: string[] | "all";
    productos: Producto[]
}

interface Producto {
    nombre?: string;
    foto?: string;
    precio?: number;
    description?: string;
    locate?: string;
    categoria?: string;
    fecha?: string;
}

const Content: React.FC<CarrouselLast12Props> = ({ byCategory, darkMode, productos }) => {

    console.log(productos)

    return (

        <section className="contenidoTienda">
            <Swipper />
            {/* aqui las cards de productos*/}

            {
                byCategory.includes("all") ?
                    (
                        <div>
                            <h2 className="tituloSalaCompra">Una gran variedad de productos</h2>
                            <h4 className="subtituloSalaCompra">Encuentra productos de alta calidad a los mejores precios</h4>
                            <div className='productContainer'>
                                {
                                    productos.map((producto) => (
                                        <Card producto={producto} darkMode={darkMode} />
                                    ))
                                }
                            </div>
                        </div>

                    ) : (
                        <div>
                            <h2 className="tituloSalaCompra">Gran variedad de productos en todas las categorias</h2>
                            <h4 className="subtituloSalaCompra">Encuentra algo que te guste de manera eficiente</h4>
                            <div className='productContainer'>
                                {
                                    productos.map((producto) => (
                                        <Card producto={producto} darkMode={darkMode} />
                                    ))
                                }
                            </div>
                        </div>
                    )
            }
        </section >

    )
}

export default Content;