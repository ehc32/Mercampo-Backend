import './../global/dashlite.css'

const NotfoundPage = ({ boton }) => {
    return (
        <div className="nk-app-root w-full">
            <div className="nk-main">
                <div className="nk-wrap nk-wrap-nosidebar">
                    <div className="nk-content">
                        <div className="my-auto">
                            <div className="text-center">
                                <h1 className="nk-error-head">Recurso no encontrado</h1>
                                <h3 className="nk-error-title w-full">Oops! Ha ocurrido un error al encontrar el recurso solicitado.</h3>

                                {
                                    boton ? (
                                        <>
                                            <p className="nk-error-text">Parece que no existe un producto con esas especificaciones.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="nk-error-text">Lo sentimos por el inconveniente. Parece que intentaste acceder a una página que no existe o ha sido eliminada.</p>
                                            <a href="/" className="btn btn-lg btn-primary mt-2">Volver al Inicio</a>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotfoundPage;
