import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AccordionProps {
    titulo: string;
    contenido: string;
}

const AccordionSet: React.FC<AccordionProps> = ({ titulo, contenido }) => {
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    {titulo}
                </AccordionSummary>
                <AccordionDetails>
                    {contenido}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default AccordionSet;
