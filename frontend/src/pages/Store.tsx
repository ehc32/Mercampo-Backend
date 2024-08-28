import { useEffect, useState } from "react";
import { get_all_products_paginated_to_shop, filter_request } from '../api/products';
import Content from "../components/tienda/Content/Content";
import { useAbierto } from "../hooks/aside";
import { motion, AnimatePresence } from 'framer-motion';
import './style.css';
import { toast } from "react-toastify";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";

const Store = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLenght, setDataLenght] = useState(0);
    const [page, setPage] = useState<number>(1)
    const { abierto, toggleAbierto } = useAbierto();
    const [filtrado, toggleFiltrado] = useState<boolean>(false); // revisar si se está filtrado

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

            const response = await filter_request(locate, price, categories, time, startDate, endDate, searchItem, page);

            toast.success("Filtros aplicados con éxito!");
            setDataLenght(response.data.meta.count)
            setProductos(response.data.data)
            toggleFiltrado(true)
        } catch (e) {

            toggleFiltrado(false)
            toast.error("Ha ocurrido un error al filtrar");
            console.error(e);
        }
    };

    // delete filtros
    const deleteDataFilter = () => {
        try {
            fetchProductos(page)
            toast.info(("Filtros restablecidos"));
        } catch (error) {

        }
    }

    // END FILTROS

    const fetchProductos = async (page: number) => {
        try {
            const productosAPI = await get_all_products_paginated_to_shop(page);
            setProductos(productosAPI.data);
            setDataLenght(productosAPI.meta.count)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchProductos(page);

    }, [page])

    return (
        <section className="sectionCatePage">
            <main className="mainTienda">
                <AnimatePresence>
                    {abierto && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0, zIndex: 10 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AsideFilter
                                bringDataFilter={bringDataFilter}
                                deleteDataFilter={deleteDataFilter}
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