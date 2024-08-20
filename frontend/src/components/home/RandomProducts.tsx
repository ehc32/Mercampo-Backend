import React from 'react';
import Card from '../shared/Card/Cards';
import './Style.css';

interface Producto {
    nombre?: string;
    foto?: string;
    price?: number;
    description?: string;
    locate?: string;
}

interface CarrouselLast12Props {
    productos: Producto[];
    darkMode: boolean;
    loading: boolean;
}

const RandomProducts: React.FC<CarrouselLast12Props> = ({ productos, darkMode, loading }) => {
    return (
        <>
            <h4 className={darkMode ? 'card-name-dark' : 'card-name-light'}>Descubre lo mejor</h4>
            <h6 className={darkMode ? 'card-subname-dark' : 'card-subname-light'}>Explora nuestra selección de productos de alta calidad</h6>
            <div className={darkMode ? 'product-container-dark' : 'product-container-light'}>
                {productos.map((producto, index) => (
                    <Card key={index} producto={producto} darkMode={darkMode} loading={loading} />
                ))}

            </div>
        </>
    );
};

export default RandomProducts;