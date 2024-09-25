import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@mui/material";
import './Modal.css'

const ConsentModal: React.FC<ConsentModalProps> = ({ open, handleClose, setAccepted, accepted }) => {

    const handleCheckboxChange = () => {
        setAccepted(!accepted);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogContent>
                <div className="mx-auto p-6 bg-white">
                    <h2 className="text-2xl font-semibold mb-4">Política de Privacidad</h2>
                    <p className="text-gray-700 mb-2">
                        Mercampo domiciliada en [Neiva, Colombia], con el sitio web mercampo.com, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, garantiza la protección de los datos personales de los usuarios que interactúan con sus servicios.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Esta política describe los términos en que Mercampo usa, recopila, almacena y protege la información personal proporcionada por los usuarios al utilizar su sitio web. Nuestro objetivo es garantizar que la información personal esté segura y que sea utilizada solo con el consentimiento de los titulares de los datos.
                    </p>
                    <h3 className="text-xl font-semibold mb-2">1. Información recolectada</h3>
                    <ul className="list-disc list-inside mb-2 text-gray-700">
                        <li>Nombre completo</li>
                        <li>Dirección de correo electrónico</li>
                        <li>Número de teléfono</li>
                        <li>Dirección física</li>
                        <li>Cualquier otro dato necesario para el procesamiento de compras y la prestación de nuestros servicios.</li>
                    </ul>
                    <p className="text-gray-700 mb-2">
                        Información de navegación obtenida a través de cookies u otras tecnologías de seguimiento que permiten mejorar la experiencia del usuario en nuestro sitio.
                    </p>
                    <h3 className="text-xl font-semibold mb-2">2. Finalidad del tratamiento de los datos personales</h3>
                    <ul className="list-disc list-inside mb-2 text-gray-700">
                        <li>Procesar y gestionar órdenes de compra de productos y servicios adquiridos a través del sitio web.</li>
                        <li>Enviar información relevante sobre el estado de los pedidos, productos y ofertas.</li>
                        <li>Mejorar la atención al cliente mediante consultas, quejas o sugerencias.</li>
                        <li>Gestionar la relación contractual y comercial con los usuarios.</li>
                        <li>Cumplir con las obligaciones legales aplicables a Mercampo.</li>
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">3. Derechos de los titulares de los datos</h3>
                    <p className="text-gray-700 mb-2">
                        Los usuarios tienen derecho a:
                    </p>
                    <ul className="list-disc list-inside mb-2 text-gray-700">
                        <li>Conocer, actualizar y rectificar sus datos personales.</li>
                        <li>Solicitar prueba del consentimiento otorgado para el tratamiento de sus datos personales.</li>
                        <li>Revocar el consentimiento y solicitar la eliminación de sus datos personales cuando no se cumplan con los principios, derechos y garantías establecidas en la Ley 1581 de 2012.</li>
                        <li>Ser informados sobre el uso que se da a sus datos personales y sobre cualquier modificación a esta política de privacidad.</li>
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">4. Transferencia y cesión de datos</h3>
                    <p className="text-gray-700 mb-2">
                        Mercampo no venderá, cederá ni distribuirá la información personal a terceros sin el consentimiento expreso de los titulares, salvo en los siguientes casos:
                    </p>
                    <ul className="list-disc list-inside mb-2 text-gray-700">
                        <li>A autoridades competentes en cumplimiento de obligaciones legales o requerimientos judiciales.</li>
                        <li>A proveedores de servicios externos contratados para realizar operaciones o funciones en nombre de Mercampo (como el procesamiento de pagos), siempre bajo la estricta confidencialidad y con fines exclusivamente vinculados a nuestras operaciones comerciales.</li>
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">5. Seguridad de la información</h3>
                    <p className="text-gray-700 mb-2">
                        Mercampo se compromete a garantizar la seguridad de la información personal de los usuarios, adoptando todas las medidas técnicas, administrativas y humanas necesarias para proteger los datos contra accesos no autorizados, pérdida, destrucción o alteración.
                    </p>
                    <h3 className="text-xl font-semibold mb-2">6. Términos de conservación de datos</h3>
                    <p className="text-gray-700 mb-2">
                        Los datos personales serán conservados durante el tiempo necesario para cumplir con los fines establecidos en esta política, y en función de las normativas legales aplicables. Una vez se cumplan dichos propósitos, los datos serán eliminados de nuestras bases de datos, salvo que exista una obligación legal de retenerlos.
                    </p>
                    <h3 className="text-xl font-semibold mb-2">7. Revocación del consentimiento y eliminación de datos</h3>
                    <p className="text-gray-700 mb-2">
                        El usuario puede, en cualquier momento, revocar su consentimiento para el tratamiento de sus datos personales y solicitar la eliminación de los mismos, siempre que no exista una obligación legal para mantenerlos.
                    </p>
                    <h3 className="text-xl font-semibold mb-2">8. Modificaciones a la política de privacidad</h3>
                    <p className="text-gray-700 mb-6">
                        Mercampo se reserva el derecho de modificar esta política de privacidad en cualquier momento, notificando previamente a los usuarios a través de los medios adecuados. Las modificaciones entrarán en vigor desde la fecha de publicación en el sitio web.
                    </p>
                    <div className="flex items-center my-4">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={accepted}
                            className="h-4 w-4 text-[#39A900] focus:ring-[#39A900] border-[#39A900] rounded cursor-pointer"
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="consent" className="ml-2 text-gray-700 label-consent">
                            Acepto el tratamiento de mis datos personales.
                        </label>
                    </div>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            className={`mt-6 px-4 py-2 font-semibold rounded-lg shadow-md cancel-button text-white cursor-not-allowed`}
                        >
                            Cerrar
                        </Button>
                        {
                            accepted ? (
                                <Button
                                    onClick={handleClose}
                                    className={`mt-6 px-4 py-2 font-semibold rounded-lg shadow-md ok-button text-white cursor-not-allowed`}
                                    disabled={!accepted}
                                >
                                    Aceptar
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleClose}
                                    className={`mt-6 px-4 py-2 font-semibold rounded-lg shadow-md bg-gray-400 text-white cursor-not-allowed`}
                                    disabled={!accepted}
                                >
                                    Aceptar
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
