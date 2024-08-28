import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AsideToggle({ toggleAbierto, abierto }) {

    return (
        <Tooltip title={abierto ? "Cerrar" : "Abrir"} className='w-16 h-16 relative top-1'>
            <IconButton onClick={() => toggleAbierto}>

                {
                    location.pathname === '/store' ? (
                        <button onClick={toggleAbierto}>
                            {
                                abierto ? (
                                    <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                                ) : (
                                    <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                                )
                            }
                        </button>
                    ) : (
                        <button onClick={toggleAbierto} className='toggle-openaside'>
                            {
                                abierto ? (
                                    <XMarkIcon className="block h-8 w-8 " aria-hidden="true" />
                                ) : (
                                    <Bars3Icon className="block h-8 w-8 " aria-hidden="true" />
                                )
                            }
                        </button>
                    )
                }
            </IconButton>
        </Tooltip>
    );
}