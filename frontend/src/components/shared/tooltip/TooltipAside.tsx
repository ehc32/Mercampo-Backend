import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';

// Componente de toggle para mostrar u ocultar el menú lateral
export default function AsideToggle({ toggleAbierto, abierto }) {
  const location = useLocation();
  const icon = abierto ? <CloseIcon className="block fs-18px" aria-hidden="true" /> : <MenuIcon className="block fs-18px" aria-hidden="true" />;

  return (
    <Tooltip title={abierto ? "Cerrar" : "Abrir"} className='w-16 h-16 relative top-1'>
      <IconButton onClick={() => toggleAbierto(!abierto)}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}