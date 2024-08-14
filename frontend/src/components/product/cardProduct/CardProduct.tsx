import Map from "../map/Map";
import ProductDetail from "../productDetail/ProductDetail";

interface CarrouselLast12Props {
    darkMode: boolean;
}

const CardProduct: React.FC<CarrouselLast12Props> = ({ darkMode }) => {
    return (
        <div>
            <ProductDetail />
            <Map />
        </div>
    )
}

export default CardProduct