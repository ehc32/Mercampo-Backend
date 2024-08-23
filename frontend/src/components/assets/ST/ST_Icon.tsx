const ST_Icon = () => {
    return (
        <div className="h-full m-2 row" style={{ pointerEvents: 'none' }}>
            <img
                className="h-10 w-auto lg:block mx-2"
                src="/public/lo.ico"
                alt="Logo"
            />
            <p className="hover-class">
                Servicios <br />
                Tecnológicos
            </p>
        </div>
    )
}
export default ST_Icon;