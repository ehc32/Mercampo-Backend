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
    const [price, setPrice] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [time, setTime] = useState<string>("");
    const [searchItem, setSearchItem] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // REQUEST TO SERVER

    const bringDataFilter = async () => {
        try {
            console.log("daa")
            const formData = new FormData();

            formData.append('locate', locate);
            formData.append('price', price);
            formData.append('categories', categories ? categories.join(',') : '');

            if (startDate && endDate) {
                formData.append('startDate', startDate?.toISOString() ?? '');
                formData.append('endDate', endDate?.toISOString() ?? '');
            }

            formData.append('time', time);
            formData.append('searchItem', searchItem);

            console.log(locate, price, categories, time, searchItem);

            const response = await filter_request(formData);

            console.log(response);

        } catch (e) {
            console.error(e);
        }
    };
    // END FILTROS

        useEffect(() => {
            console.log("la pagina actual es " + page)

            const fetchProductos = async (page: number) => {
                try {
                    console.log("trayendo productos de la pagina: " + page)
                    const productosAPI = await get_all_products_paginated_to_shop(page);
                    setProductos(productosAPI.data);
                    setDataLenght(productosAPI.meta.count) 
                    console.log(productos)
                } catch (error) {
                    console.error(error)
                } finally {
                    setLoading(false);
                }
            };

            fetchProductos(page);

        }, [page])

    return (
        <section className="sectionCatePage">
            <main className="mainTienda">
                <AnimatePresence>
                    {abierto && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0, zIndex: 50 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AsideFilter
                                bringDataFilter={bringDataFilter}
                                setTime={setTime}
                                setLocate={setLocate}
                                setSearchItem={setSearchItem}
                                setCategories={setCategories}
                                setStartDate={setStartDate}
                                setPrice={setPrice}
                                setEndDate={setEndDate}
                                locate={locate}
                                price={price}
                                categories={categories}
                                time={time}
                                searchItem={searchItem}
                                startDate={startDate}
                                endDate={endDate}
                            />
                        </motion.aside>
                    )}
                </AnimatePresence>
                <Content productos={productos} loading={loading} dataLenght={dataLenght} page={page} setPage={setPage} />
            </main>
        </section>
    );
};
export default Store;