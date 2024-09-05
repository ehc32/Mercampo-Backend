const ST_Icon = () => {
    return (
        <div className="h-full m-2 row whitespace-nowrap" style={{ pointerEvents: 'none' }}>
            <img
                className="h-10 w-auto lg:block mx-1 relative top-1"
                src="/public/lo.ico"
                alt="Logo"
            />
            <img
                className="h-10 w-6 lg:block mx-0 mr-1 relative top-1" // Reduce el ancho y el margen
                src="/public/line.png"
                alt="Logo"
            />
            <p className="hover-class fs-16px font-bold text-black">
                Servicios <br />
                Tecnológicos
            </p>
        </div>
    )
}
export default ST_Icon;