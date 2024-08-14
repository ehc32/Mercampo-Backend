import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import Footer from "../components/Footer";
import CardProduct from "../components/product/cardProduct/CardProduct";
import Content from "../components/tienda/Content/Content";

interface CarrouselLast12Props {
    darkMode: boolean;
}

const CatePage: React.FC<CarrouselLast12Props> = ({ darkMode }) => {

    return (
        <main>
            <section>
                <AsideFilter darkMode={darkMode} />
                <Content />
            </section>
            {/* <CardProduct darkMode={darkMode} /> */}
            <Footer />
        </main>
    );
};
export default CatePage;
