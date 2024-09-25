interface Product {
  first_image?: string;
  name?: string;
  category?: string;
  description?: string;
  count_in_stock?: number;
  price?: number;
  image?: string[]; // Es mejor que esto sea "images" para reflejar que es un arreglo
  map_locate?: string;
  locate?: string;
  unit?: string;
  tiempoL?: number;
  created?: number;
  slug?: string; // Este campo se debe agregar aquí para que sea parte del producto
}

interface CarrouselLast12Props {
  producto?: Product; // Cambiado a un solo producto en lugar de un array
}

interface SwiperPropsP {
  width?: string;
  height?: string;
  isUpSwiper?: boolean;
  loader?: boolean;
  datos?: Product[]; // Utiliza "Product" para reflejar que son productos
}

interface Props {
  results?: any; // Considera definir mejor este tipo si es posible
}

interface ConsentModalProps {
  open?: boolean;
  handleClose?: () => void;
  setAccepted?: (e: any) => void;
  accepted?: boolean;
}

interface propsModal {
  idLocal?: number | string;
  updateUser?: (id: number | string) => void;
}

interface ModalSellerConfigProps {
  userId?: number | string;
  id?: number | string;
}

interface BasicRatingProps {
  typeRating?: 'use' | 'read-only'; // Define los valores permitidos
  valueData?: number; // Si valueData no es requerido, se puede marcar como opcional
}

interface OrderInterface {
  id?: number;
  user?: string;
  total_price?: number;
  delivery_address?: string;
  order_date?: string;
  delivery_date?: string;
}

interface MyOrder {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  created?: string;
  count_in_stock?: number;
  count_in_sells?: number;
  rating?: number;
  fecha_limite?: string;
  quantity?: number;
}

interface User {
  id?: number;
  role?: string;
}

interface ContenidoProps {
  productos: any[];
  loading: boolean;
  dataLenght: number;
  page: number;
  setPage: (page: number) => void;
  searchItem: string;
  setSearchItem: (search: string) => void;
  bringDataFilter: () => void;
  deleteDataFilter: () => void;
  changeOrder: () => void;
}