import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import Footer from "../components/Footer";
import CardProduct from "../components/product/cardProduct/CardProduct";

interface CarrouselLast12Props {
    darkMode: boolean;
}

const CatePage: React.FC<CarrouselLast12Props> = ({ darkMode }) => {

    return (
        <main>
            <AsideFilter darkMode={darkMode} />
            <CardProduct darkMode={darkMode} />
            <Footer />
        </main>
    );
};
export default CatePage;
