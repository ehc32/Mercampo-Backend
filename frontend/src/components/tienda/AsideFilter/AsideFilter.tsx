import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import './Aside.css';
interface CarrouselLast12Props {
    darkMode: boolean;
    estadoAside: boolean;
}

const AsideFilter: React.FC<CarrouselLast12Props> = ({ darkMode, estadoAside }) => {
    const [showNav, setShowNav] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [timeRange, setTimeRange] = useState('');
    const [maxPrice, setMaxPrice] = useState(0)
    const [minPrice, setMinPrice] = useState(0)
    const [fechaInicio, setFechaInicio] = useState(Date)
    const [fechaFin, setFechaFin] = useState(Date)

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

    const handleSetPricesValues = () => {

    }

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
        <>{estadoAside && (
            <nav className={darkMode ? 'asideCardDark' : 'asideCard'}>
                <div className='asideBox'>
                    <h4 className='cardTitles'>Busqueda de productos</h4>
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
                <div className='asideBox'>
                    <h4 className='cardTitles'>Categoría</h4>
                    {
                        categorias.map((categoria, index) => (
                            <div key={index} className='asideBox input-text-check'>
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
                <div className='asideBox'>
                    <h4 className='cardTitles'>price máximo</h4>
                    <ul>
                        <li><p>Menos de $ 100.000</p></li>
                        <li><p>Entre $100.000 y $150.000</p></li>
                        <li><p>Más de $150.000</p></li>
                        <div className='box-inputs'>
                            <input type="text" className='min-price' placeholder='Minimo' />
                            <i className='bi bi-dash'></i>
                            <input type="text" className='max-price' placeholder='Maximo' /> <i className="bi bi-arrow-right"></i>
                        </div>
                    </ul>
                </div>
                <div className='asideBox'>
                    <h4 className='cardTitles'>Rango de tiempo</h4>
                    <ul>
                        <li><p>Publicados hoy</p></li>
                        <li><p>Esta semana</p></li>
                        <li><p>Este mes</p></li>
                        <button>Establecer manualmente</button>
                    </ul>
                </div>
                <div className='asideBox'>
                    <h4 className={darkMode ? 'title-dark cardTitles' : 'title-card cardTitles'}>Localización</h4>
                    <select onChange={handleLocationChange} className='busquedaAside' value={location}>
                        {
                            categorias.map((categoria, index) => (
                                <option key={index} className='asideBox input-text-check'>
                                    {categoria}
                                </option>
                            ))

                        }
                    </select>
                </div>
            </nav >
        )}
        </>
    );
};

export default AsideFilter;