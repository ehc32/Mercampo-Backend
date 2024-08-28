
export default function Component() {
    return (
        <div className="w-full">
            <section className="w-full bg-[url('/public/fondoa.jpg')] bg-cover bg-center py-32 relative">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl space-y-4 text-start text-primary-foreground">
                        <h1 className="text-4xl font-bold text-white tracking-tighter sm:text-5xl md:text-6xl">Nuestra Plataforma de Comercio para Campesinos</h1>
                        <p className="text-xl md:text-2xl text-white">
                            Somos una plataforma dedicada a conectar a los campesinos con los mercados, brindando soluciones innovadoras para mejorar su producción y comercialización.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 md:w-1/3 lg:w-1/4">
                        <img src="/public/campesena.png" alt="Imagen de campesinos trabajando" className="w-72 h-20 object-cover rounded-lg shadow-lg" />
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-12">
                <div className="container grid gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-20">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestra Historia</h2>
                        <p className="text-muted-foreground md:text-xl">
                            Fundada en 2022, nuestra plataforma nació con el objetivo de revolucionar la forma en que los campesinos interactúan con los mercados. Creemos que la tecnología debe ser accesible y empoderadora para todos.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestra Misión</h2>
                        <p className="text-muted-foreground md:text-xl">
                            Nuestra misión es crear productos y servicios que tengan un impacto positivo en la vida de los campesinos. Estamos comprometidos con la sostenibilidad, la inclusión y la innovación, y nos esforzamos por ser una fuerza para el bien en el mundo.
                        </p>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-12 bg-muted">
                <div className="container grid gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-20">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestros Valores</h2>
                        <ul className="space-y-2 text-muted-foreground md:text-xl">
                            <li>
                                <div className="flex items-start gap-2">
                                    <CheckIcon className="mt-1 h-5 w-5 text-primary" />
                                    <span>Integridad: Somos honestos, éticos y responsables.</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start gap-2">
                                    <CheckIcon className="mt-1 h-5 w-5 text-primary" />
                                    <span>Innovación: Embracemos el cambio y buscamos mejorar continuamente.</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start gap-2">
                                    <CheckIcon className="mt-1 h-5 w-5 text-primary" />
                                    <span>Colaboración: Trabajamos juntos para alcanzar nuestros objetivos.</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start gap-2">
                                    <CheckIcon className="mt-1 h-5 w-5 text-primary" />
                                    <span>Empoderamiento: Empoderamos a nuestros usuarios y clientes para que tengan éxito.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestro Equipo</h2>
                        <p className="text-muted-foreground md:text-xl">
                            Nuestro equipo está compuesto por talentosos y dedicados individuos que aportan una variedad de habilidades y experiencias. Estamos apasionados por lo que hacemos y nos comprometemos a entregar los mejores resultados posibles para nuestros clientes.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

function CheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}