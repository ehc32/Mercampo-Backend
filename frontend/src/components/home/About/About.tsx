import './styles.css';
import AccordionSet from './../../shared/Accordion/Accordion';

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

                <div className="w-full flex flex-col lg:flex-row justify-between mt-10 space-y-6 lg:space-y-0 lg:space-x-4">

                <div className="w-full lg:w-[48%] bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2 text-center" style={{ color: '#39A900' }}>
                                Bienvenidos a [Nombre de tu plataforma]
                            </h3>
                            <p className="text-gray-700 text-base text-justify">
                                En [Nombre de tu plataforma], nos comprometemos a crear un espacio seguro y transparente donde los productores locales pueden vender sus productos directamente a los consumidores, sin intermediarios. Nuestra misión es apoyar el desarrollo económico de las comunidades rurales y urbanas, promoviendo el comercio justo y sostenible.
                            </p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold mb-2 text-center" style={{ color: '#39A900' }}>
                                ¿Qué hace que nuestra plataforma sea diferente?
                            </h3>
                            <p className="text-gray-700 text-base text-justify">
                                Sin intermediarios: En [Nombre de tu plataforma], los productores pueden vender sus productos directamente a los consumidores, sin tener que pagar comisiones o tarifas a intermediarios. Pagos seguros: Nuestra plataforma cuenta con integración PayPal, lo que garantiza que las transacciones sean seguras y confiables. Acceso a nuevos mercados: Nuestra plataforma conecta a los productores con un amplio mercado de consumidores, lo que les permite expandir su negocio y aumentar sus ventas.
                            </p>
                        </div>
                       
                    </div>
                    <div className="w-full lg:w-[48%] bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: '#39A900' }}>
                            Preguntas Frecuentes
                        </h1>
                        <AccordionSet
                            titulo="¿Qué es [Nombre de tu plataforma]?"
                            contenido="Somos una plataforma de mercadeo libre que conecta a productores y consumidores, sin intermediarios. Nuestra misión es apoyar el desarrollo económico de las comunidades rurales y urbanas, promoviendo el comercio justo y sostenible."
                            darkMode={false}
                        />
                        <AccordionSet
                            titulo="¿Cómo funciona la plataforma?"
                            contenido="Nuestra plataforma permite a los productores vender sus productos directamente a los consumidores, sin intermediarios. Los pagos se realizan de manera segura a través de PayPal."
                            darkMode={false}
                        />
                        <AccordionSet
                            titulo="¿Qué beneficios ofrece a los productores?"
                            contenido="Ofrecemos acceso a nuevos mercados, pagos seguros y la oportunidad de vender sus productos a un precio justo."
                            darkMode={false}
                        />
                                                <AccordionSet
                            titulo="¿Cómo puedo unirme a la plataforma?"
                            contenido="Para unirte a nuestra plataforma, solo debes registrarte con tus datos en la sección de 'Registro' y comenzar a utilizar nuestras herramientas."
                            darkMode={false}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}