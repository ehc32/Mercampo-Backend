import { useEffect, useState } from 'react';
import { cate_api } from '../api/products';
import Footer from '../components/Footer';
import ProductDetail from '../components/product/productDetail/ProductDetail';
import SwiperProducts from '../components/shared/SwiperProducts/swiperProducts';
import { useDarkMode } from "../hooks/theme";



const DetallesProd = () => {

  const { darkMode } = useDarkMode();
  const [category, setCategory] = useState<string>("")
  const [loader, setLoader] = useState<boolean>(false)
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productos = await cate_api(category);
        setProductos(productos);
      } catch (error) {
        console.error('Error al obtener los productos: ', error);
      }
    };

    void fetchProductos();
  }, []);

  return (
    <main>
      <ProductDetail setCategory={setCategory} />
      <SwiperProducts datos={productos} height='50vh' width='100%' loader={loader} />
      <Footer />
    </main>
  );
};

export default DetallesProd;