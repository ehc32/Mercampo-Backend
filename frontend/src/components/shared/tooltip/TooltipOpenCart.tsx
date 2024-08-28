import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useCartStore } from '../../../hooks/cart';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function BasicTooltip() {
    const addToCart = useCartStore(state => state.addToCart);

    return (
        <Tooltip title="Abrir carrito de compras">
            <Link to="/cart">
                <IconButton>
                    <ShoppingCartIcon style={{ color: "#39A900", height: "30px", width: "30px" }} />
                </IconButton>
            </Link>
        </Tooltip>
    );
}