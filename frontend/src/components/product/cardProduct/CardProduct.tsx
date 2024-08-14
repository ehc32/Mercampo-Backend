import Map from "../map/Map";

interface CarrouselLast12Props {
    darkMode: boolean;
}

const CardProduct: React.FC<CarrouselLast12Props> = ({ darkMode }) => {
    return (
        <div>
            <Map />
        </div>
    )
}

export default CardProduct