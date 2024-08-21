import React, { useEffect, useState } from "react";
import { get_all_products } from '../api/products';
import Content from "../components/tienda/Content/Content";
import { useDarkMode } from "../hooks/theme";

import './style.css';

interface CarrouselLast12Props {
    byCategory: [];
}

const Shop: React.FC<CarrouselLast12Props> = () => {


    const { darkMode } = useDarkMode();
    const [productos, setProductos] = useState([]);


    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const productos = await get_all_products();
                setProductos(productos);
                setLoading(true)
            } catch (error) {
                console.error('Error al obtener los productos: ', error);
            }
        };

        void fetchProductos();
    }, []);

    const [byCategory,] = useState(["all"])

    return (
        <section className="sectionCatePage">
            <main className="mainTienda">
                {/* <AsideFilter darkMode={darkMode} /> */}
                <Content byCategory={byCategory} darkMode={darkMode} productos={productos} />
            </main>
        </section>
    );
};
export default Shop;
