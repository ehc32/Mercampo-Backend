import React from 'react';
import './Style.css';
import Card from './Card/Cards'

interface Producto {
    nombre?: string;
    foto?: string;
    precio?: number;
    description?: string;
    locate?: string;
}

interface CarrouselLast12Props {
    productos: Producto[];
    darkMode: boolean;
}

const RandomProducts: React.FC<CarrouselLast12Props> = ({ productos, darkMode }) => {
    return (
        <>
            <h4 className={darkMode ? 'card-name-dark' : 'card-name-light'}>Descubre lo mejor</h4>
            <h6 className={darkMode ? 'card-subname-dark' : 'card-subname-light'}>Explora nuestra selección de productos de alta calidad</h6>
            <div className='productContainer'>
                {productos.map((producto) => (
                    <Card producto={producto} darkMode={darkMode} />
                ))}

            </div>
        </>
    );
};

export default RandomProducts;