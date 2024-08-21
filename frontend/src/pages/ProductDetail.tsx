import { useEffect, useState } from 'react';
import { get_all_products } from '../api/products';
import ProductDetail from '../components/product/productDetail/ProductDetail';
import SwiperProducts from '../components/shared/SwiperProducts/swiperProducts';
import { useDarkMode } from "../hooks/theme";
import Footer from '../components/Footer';



const DetallesProd = () => {

  const { darkMode } = useDarkMode();


  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productos = await get_all_products();
        setProductos(productos);
      } catch (error) {
        console.error('Error al obtener los productos: ', error);
      }
    };

    void fetchProductos();
  }, []);

  return (
    <main>
      <ProductDetail darkMode={darkMode} />
      <SwiperProducts darkMode={darkMode} datos={productos} height='50vh' width='100%' />
      <Footer />
    </main>
  );
};

export default DetallesProd;