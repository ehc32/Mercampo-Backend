import { useEffect, useState } from 'react';
import { cate_api_random } from '../api/products';
import Comments from '../components/product/coments/Comments';
import ProductDetail from '../components/product/productDetail/ProductDetail';
import SwiperProducts from '../components/shared/SwiperProducts/swiperProducts';
import AsideFilter from '../components/tienda/AsideFilter/AsideFilter';

const DetallesProd = () => {
  const [category, setCategory] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [productos, setProductos] = useState([]);
  const [productId, setProductId] = useState(0)

  const fetchProductos = async () => {
    try {
      const productos = await cate_api_random(category);
      setProductos(productos);
      setLoader(true);
    } catch (error) {
      console.error('Error al obtener los productos: ', error);
    }
  };

  useEffect(() => {
    if (category) {
      fetchProductos();
    }
  }, [category]);

  return (
    <main className='mt-24'>
      <ProductDetail setCategory={setCategory} fetchProductos={fetchProductos} setProductId={setProductId} />
      <Comments productId={productId} />
      <SwiperProducts datos={productos} height='50vh' width='100%' loader={loader} />

      <AsideFilter />
    </main>
  );
};

export default DetallesProd;