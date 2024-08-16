import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AccordionProps {
    titulo: string;
    contenido: string;
    darkMode: boolean;
}

const AccordionSet: React.FC<AccordionProps> = ({ titulo, contenido, darkMode }) => {
    const className = darkMode ? 'dark-mode-accordion' : 'light-mode-accordion';

    return (
        <Accordion className={className}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className={className}
            >
                {titulo}
            </AccordionSummary>
            <AccordionDetails className={className}>
                {contenido}
            </AccordionDetails>
        </Accordion>
    );
};

export default AccordionSet;