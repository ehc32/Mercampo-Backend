import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function BasicTooltip() {
    return (
        <Tooltip title="Menciona el país, ciudad, barrio o direccion del producto" style={{ padding: "2px" }} placement="right">
            <IconButton>
                <HelpOutlineIcon style={{ color: "#39A900" }} />
            </IconButton>
        </Tooltip>
    );
}