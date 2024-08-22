import React, { useEffect, useState } from "react";
import { get_all_products_paginated } from '../api/products';
import Content from "../components/tienda/Content/Content";
import { useDarkMode } from "../hooks/theme";

import './style.css';


const Store = () => {
    const { darkMode } = useDarkMode();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            try {
                const productos = await get_all_products_paginated(1);
                setProductos(productos);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };

        void fetchProductos();
    }, []);


    return (
        <section className="sectionCatePage">
            <main className="mainTienda">
                {/* <AsideFilter darkMode={darkMode} /> */}
                <Content darkMode={darkMode} productos={productos} loading={loading} />
            </main>
        </section>
    );
};
export default Store;