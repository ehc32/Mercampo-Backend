import './Aside.css';
import { useState } from 'react';

interface CarrouselLast12Props {
    darkMode: boolean;
}

const AsideFilter: React.FC<CarrouselLast12Props> = ({ darkMode }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Constante para guardar el término de búsqueda
    const [maxPrice, setMaxPrice] = useState(''); // Constante para guardar el precio máximo
    const [location, setLocation] = useState(''); // Constante para guardar la localización
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [timeRange, setTimeRange] = useState('');

    function buscarSimilitudes() {
        if (searchTerm.length > 0) {
            console.log("Buscar: " + searchTerm)
        }
    }
    const handleCategoryChange = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setSelectedCategories((prevCategories) => [...prevCategories, value]);
        } else {
            setSelectedCategories((prevCategories) =>
                prevCategories.filter((category) => category !== value)
            );
        }
    };

    const handleTimeRangeChange = (e) => {
        console.log(e.target.value)
        setTimeRange(e.target.value);
    };

    const handlePriceChange = (e) => {
        console.log(e.target.value)
        setMaxPrice(e.target.value);
    };

    const handleLocationChange = (e) => {
        console.log(e.target.value)
        setLocation(e.target.value);
    };

    const categorias = ["Frutas", "Verduras", "Grano", "Otros"]

    return (
        <nav className={darkMode ? 'asideCard' : 'asideCard'}>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Busqueda de productos</h4>
                <form
                    action=""
                    onSubmit={(e) => {
                        e.preventDefault();
                        buscarSimilitudes();
                    }}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="busquedaAside"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Categoría</h4>
                {
                    categorias.map((categoria, index) => (
                        <div key={index} className={darkMode ? 'asideBox' : 'asideBox'}>
                            <input
                                type="checkbox"
                                id={categoria}
                                name={categoria}
                                value={categoria}
                                onChange={handleCategoryChange}
                            />
                            <label className={darkMode ? 'label-dark' : 'label-dark'} htmlFor={categoria
                            }>{categoria}</label>
                        </div>
                    ))

                }
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Precio máximo</h4>
                <input
                    type="range"
                    name=""
                    id=""
                    onMouseUp={handlePriceChange}
                />
                <span>Precio máximo: {maxPrice}</span>
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Rango de tiempo</h4>
                <select onChange={handleTimeRangeChange} className='busquedaAside' value={timeRange}>
                    <option value="6 Horas">6 Horas</option>
                    <option value="12 Horas">12 Horas</option>
                    <option value="24 Horas">24 Horas</option>
                    <option value="1 Dia">1 Dia</option>
                    <option value="1 semana">1 semana</option>
                    <option value="2 semanas">2 semanas</option>
                    <option value="1 Mes">1 Mes</option>
                </select>
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Localización</h4>
                <select onChange={handleLocationChange} className='busquedaAside' value={location}>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                </select>
            </div>
        </nav >
    );
};

export default AsideFilter;