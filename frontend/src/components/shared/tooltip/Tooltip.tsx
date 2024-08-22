import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useCartStore } from '../../../hooks/cart';

export default function BasicTooltip({producto}) {
    const addToCart = useCartStore(state => state.addToCart);

    return (
        <Tooltip title="Añadir al carrito">
            <IconButton onClick={() => addToCart(producto)}>
                <ShoppingCartIcon style={{color: "#39A900"}} />
            </IconButton>
        </Tooltip>
    );
}