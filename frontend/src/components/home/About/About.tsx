import './styles.css'

export default function Component() {
    return (
        <>
            <div className="contenedorabout p-4 my-6">
                <section className="w-full h-96 bg-[url('/public/campesino.jpeg')] bg-cover bg-center py-32 relative rounded-lg">
                    <div className="w-full px-2 md:px-6">
                        <div className="max-w-3xl space-y-4 text-start text-primary-foreground">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl" style={{ color: '#39A900' }}>
                                Nuestra Plataforma de Comercio para Campesinos
                            </h1>
                            <p className="text-xl md:text-2xl text-white">
                                Somos una plataforma dedicada a conectar a los campesinos con los mercados, brindando soluciones innovadoras para mejorar su producción y comercialización.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-1/2 md:w-1/3 lg:w-1/4">
                            <img src="/public/campesena.png" alt="Imagen de campesinos trabajando" className="w-72 h-20 object-cover rounded-lg shadow-lg" />
                        </div>
                    </div>
                </section>

                {/* Contenido principal con misión, visión, valores y otros */}
                <div className="w-full flex flex-col lg:flex-row justify-between mt-10 space-y-6 lg:space-y-0 lg:space-x-4">
                    {/* Sección izquierda para misión, visión y valores */}
                    <div className="w-full lg:w-[48%] bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: '#39A900' }}>
                            MISIÓN, VISIÓN Y VALORES CLAROS
                        </h1>
                        <p className="text-gray-700 text-base mb-3 text-justify">
                            Nuestra misión, visión y valores representan la esencia de nuestra plataforma. Guían nuestra conducta, expresan nuestra integridad y reflejan el respeto por la dignidad humana, todo orientado al cumplimiento de nuestra estrategia sostenible.
                        </p>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#39A900' }}>
                                Misión
                            </h2>
                            <p className="text-gray-700 text-base text-justify">
                                Satisfacer con excelencia a los consumidores de nuestras bebidas.
                            </p>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#39A900' }}>
                                Visión
                            </h2>
                            <p className="text-gray-700 text-base text-justify">
                                Ser el mejor líder total de bebidas, que genere valor económico, social y ambiental sostenible gestionando modelos de negocio innovadores y ganadores, con los mejores colaboradores en el mundo.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#39A900' }}>
                                Valores
                            </h2>
                            <p className="text-gray-700 text-base mb-4 text-justify">
                                Son la clave para guiar nuestra conducta día con día. Expresan quiénes somos y en qué creemos, además de subrayar nuestra integridad.
                            </p>
                        </div>
                    </div>

                    {/* Línea divisoria */}
                    <div className="hidden lg:block w-0.5 bg-gray-300"></div>

                    {/* Sección derecha para imágenes y contenido adicional */}
                    <div className="w-full lg:w-[48%] bg-gray-100 p-6 rounded-lg shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2 text-center" style={{ color: '#69C83B' }}>
                                Primero la gente
                            </h3>
                            <p className="text-gray-700 text-base text-justify">
                                Nuestra gente y el trabajo conjunto son los activos más valiosos de la compañía.
                            </p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2 text-center" style={{ color: '#69C83B' }}>
                                Programa de Aceleración de Líderes
                            </h3>
                            <p className="text-gray-700 text-base text-justify">
                                Creemos el Programa de Aceleración de Líderes, dirigido a gerentes y directores de todos los países donde operamos.
                            </p>
                        </div>
                        <img src="/public/1.jpg" alt="Imagen relacionada" className="rounded-lg shadow-lg mb-6 w-full h-auto object-cover" />
                    </div>
                </div>
            </div>
        </>
    );
}
