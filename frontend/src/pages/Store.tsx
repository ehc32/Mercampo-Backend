import React, { useEffect, useState } from "react";
import { get_all_products_paginated } from '../api/products';
import Content from "../components/tienda/Content/Content";
import { useDarkMode } from "../hooks/theme";

import './style.css';


const Store = () => {
    const { darkMode } = useDarkMode();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLenght, setDataLenght] = useState(0);
    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        const fetchProductos = async (page: number) => {
            setLoading(true);
            try {
                const productos = await get_all_products_paginated(page);
                setProductos(productos.data);
                setDataLenght(productos.meta.count)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };

        fetchProductos(page);
    }, [page]);


    return (
        <section className="sectionCatePage">
            <main className="mainTienda">
                {/* <AsideFilter darkMode={darkMode} /> */}
                <Content darkMode={darkMode} productos={productos} loading={loading} dataLenght={dataLenght} page={page} setPage={setPage} />
            </main>
        </section>
    );
};
export default Store;