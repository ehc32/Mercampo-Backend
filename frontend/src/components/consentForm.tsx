import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

interface ConsentModalProps {
    open: boolean;
    handleClose: () => void;
    setAccepted: (e: any) => void;
    accepted: boolean;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ open, handleClose, setAccepted, accepted }) => {

    const handleCheckboxChange = () => {
        setAccepted(!accepted);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
                <div className=" mx-auto p-6 bg-white">
                    <h2 className="text-2xl font-semibold mb-4">Política de Privacidad</h2>
                    <p className="text-gray-700 mb-4">
                        Al proporcionar tus datos personales en este formulario, autorizas de manera voluntaria el tratamiento de la siguiente información:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-gray-700">
                        <li><strong>Nombre</strong></li>
                        <li><strong>Apellidos</strong></li>
                        <li><strong>Teléfono</strong></li>
                        <li><strong>Correo electrónico</strong></li>
                    </ul>
                    <p className="text-gray-700 mb-2">
                        Los datos proporcionados serán utilizados únicamente para la gestión de la comunicación entre la empresa y el usuario,
                        soporte técnico, y envío de actualizaciones sobre nuestros productos y servicios. Los datos serán almacenados por un
                        periodo máximo de 5 años.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Tienes derecho a solicitar acceso a tus datos, rectificación en caso de errores, cancelación cuando ya no sea necesario su
                        uso o si deseas oponerte a su tratamiento. También puedes revocar tu consentimiento en cualquier momento.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Tus datos podrían ser compartidos con terceros que provean servicios a nuestra compañía, tales como servidores de correo electrónico
                        o servicios de análisis. Aseguramos que cualquier transferencia cumple con las normativas de protección de datos.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Hemos implementado medidas de seguridad técnicas y organizativas adecuadas para proteger tus datos personales contra accesos no autorizados,
                        pérdidas o daños accidentales.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Puedes contactarnos en{" "}
                        <a href="mailto:correo@ejemplo.com" className="text-[#39A900] underline">
                            correo@ejemplo.com
                        </a>
                        {" "} de llega a ocurrir un inconveniente o para solicitar mayor información.
                    </p>

                    <p className="text-gray-700 mb-6">
                        Al continuar, confirmas que has leído y aceptas nuestra{" "}
                        <span className="text-[#39A900] " rel="noopener noreferrer">
                            política de Privacidad
                        </span>.
                    </p>
                    <div className="flex items-center my-4">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={accepted}
                            className="h-4 w-4 text-[#39A900] focus:ring-[#39A900] border-[#39A900] rounded cursor-pointer"
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="consent" className="ml-2 text-gray-700 label-conset">
                            Acepto el tratamiento de mis datos personales.
                        </label>
                    </div>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            className={`mt-6 px-4 py-2 font-semibold rounded-lg shadow-md cancel-button text-white cursor-not-allowed
                            `}
                        >
                            Cancelar
                        </Button>
                        {
                            accepted ? (
                                <Button
                                    onClick={handleClose}
                                    className={`mt-6 px-4 py-2 font-semibold rounded-lg shadow-md ok-button text-white cursor-not-allowed
                                `}
                                    disabled={!accepted}
                                >
                                    Enviar
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleClose}
                                    className={`mt-6 px-4 py-2 font-semibold rounded-lg shadow-md bg-gray-400 text-white cursor-not-allowed
                            `}
                                    disabled={!accepted}
                                >
                                    Enviar
                                </Button>
                            )
                        }
                    </DialogActions>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConsentModal;
