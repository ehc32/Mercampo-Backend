import { useEffect, useState } from "react";
import { get_all_products_paginated_to_shop, filter_request } from '../api/products';
import Content from "../components/tienda/Content/Content";
import { useAbierto } from "../hooks/aside";
import { motion, AnimatePresence } from 'framer-motion';
import './style.css';
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";

const Store = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLenght, setDataLenght] = useState(0);
    const [page, setPage] = useState<number>(1)
    const { abierto, toggleAbierto } = useAbierto();



    // FILTROS

    const [locate, setLocate] = useState<string>("");
    const [price, setPrice] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
    const [categories, setCategories] = useState<string[]>([]);
    const [searchItem, setSearchItem] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // REQUEST TO SERVER

    const bringDataFilter = async () => {
        try {
            const formData = new FormData();

            // Agregar filtros al FormData
            formData.append('locate', locate);
            formData.append('price_min', price.min.toString());
            formData.append('price_max', price.max.toString());
            formData.append('categories', categories.join(','));
            formData.append('searchItem', searchItem);
            formData.append('startDate', startDate?.toISOString() ?? '');
            formData.append('endDate', endDate?.toISOString() ?? '');

            const response = await filter_request(formData);


            console.log(response);

        } catch (e) {
            console.error(e);
        }
    };
    // END FILTROS

    useEffect(() => {
        const fetchProductos = async (page: number) => {
            setLoading(true);
            try {
                console.log("trayendo productos de la pagina: " + page)
                const productosAPI = await get_all_products_paginated_to_shop(page);
                setProductos(productosAPI.data);
                setDataLenght(productosAPI.meta.count)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };

        fetchProductos(page);
    }, [page]); // Agrega page como dependencia

    return (
        <section className="sectionCatePage">
            <main className="mainTienda">
                <AnimatePresence>
                    {abierto && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AsideFilter bringDataFilter={bringDataFilter} />
                        </motion.aside>
                    )}
                </AnimatePresence>
                <Content productos={productos} loading={loading} dataLenght={dataLenght} page={page} setPage={setPage} />
            </main>
        </section>
    );
};
export default Store;