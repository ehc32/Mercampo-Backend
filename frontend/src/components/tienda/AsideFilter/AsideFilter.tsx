import './Aside.css';
import { useSearchStore } from '../../Header';
import { useEffect, useState } from 'react';

interface CarrouselLast12Props {
    darkMode: boolean;
}

const AsideFilter: React.FC<CarrouselLast12Props> = ({ darkMode }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Constante para guardar el término de búsqueda
    const [maxPrice, setMaxPrice] = useState(''); // Constante para guardar el precio máximo
    const [location, setLocation] = useState(''); // Constante para guardar la localización

    function buscarSimilitudes() {
        if (searchTerm.length > 0) {
            console.log("Buscar: " + searchTerm)
        }
    }

    const handlePriceChange = (e) => {
        setMaxPrice(e.target.value);
    };

    const handleLocationChange = (e) => {
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
                            />
                            <label className={darkMode ? 'label-dark' : 'label-dark'} htmlFor={categoria
                            }>{categoria}</label>
                        </div>
                    ))

                }
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Precio máximo</h4>
                <input type="range" name="" id="" onChange={handlePriceChange} />
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Rango de tiempo</h4>
                <select onChange={handleLocationChange} className='busquedaAside'>
                    <option value="prueba"selected>6 Horas</option>
                    <option value="prueba">12 Horas</option>
                    <option value="prueba">24 Horas</option>
                    <option value="prueba">1 Dia</option>
                    <option value="prueba">1 semana</option>
                    <option value="prueba">2 semanas</option>
                    <option value="prueba">1 Mes</option>
                </select>
            </div>
            <div className={darkMode ? 'asideBox' : 'asideBox'}>
                <h4 className={darkMode ? 'title-dark' : 'title-dark'}>Localización</h4>
                <select onChange={handleLocationChange} className='busquedaAside'>
                    <option value="prueba" selected>prueba</option>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                    <option value="prueba">prueba</option>
                </select>
            </div>
            <button>Filtrar</button>
        </nav >
    );
};

export default AsideFilter;