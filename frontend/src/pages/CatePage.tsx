import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import Footer from "../components/Footer";
import CardProduct from "../components/product/cardProduct/CardProduct";
import Content from "../components/tienda/Content/Content";
import { useState } from "react";

interface CarrouselLast12Props {
    darkMode: boolean;
    byCategory: [];
}

const CatePage: React.FC<CarrouselLast12Props> = ({ darkMode }) => {
    const [byCategory, setCategory] = useState(["all"])

    return (
        <main>
                <AsideFilter darkMode={darkMode} />
                <Content byCategory={byCategory} darkMode={darkMode}/>
            {/* <CardProduct darkMode={darkMode} /> */}
            <Footer />
        </main>
    );
};
export default CatePage;
