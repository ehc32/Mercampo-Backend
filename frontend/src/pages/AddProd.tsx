import React, { useState } from 'react';

const AddProd = () => {
    // Estados para los campos del formulario
    const [name, setName] = useState('Ejemplo de Producto');
    const [category, setCategory] = useState('Electrónica');
    const [countInStock, setCountInStock] = useState(10);
    const [price, setPrice] = useState(100);
    const [unit, setUnit] = useState('Unidad');
    const [locate, setLocate] = useState('Neiva');
    const [mapLocate, setMapLocate] = useState('Ubicación en el mapa');

    // Manejo de cambios en los campos del formulario
    const handleNameChange = (e) => setName(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleCountChange = (e) => setCountInStock(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleUnitChange = (e) => setUnit(e.target.value);
    const handleLocateChange = (e) => setLocate(e.target.value);
    const handleMapLocateChange = (e) => setMapLocate(e.target.value);

    // Manejo del envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar el formulario
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Añadir Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Nombre del Producto
                        </label>
                        <input
                            value={name}
                            onChange={handleNameChange}
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Categoría
                        </label>
                        <input
                            value={category}
                            onChange={handleCategoryChange}
                            type="text"
                            name="category"
                            id="category"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="count_in_stock"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Cantidad disponible
                        </label>
                        <input
                            value={countInStock}
                            onChange={handleCountChange}
                            type="number"
                            name="count_in_stock"
                            id="count_in_stock"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Precio
                        </label>
                        <input
                            value={price}
                            onChange={handlePriceChange}
                            type="number"
                            name="price"
                            id="price"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="unit"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Unidad
                        </label>
                        <select
                            value={unit}
                            onChange={handleUnitChange}
                            name="unit"
                            id="unit"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                            <option value="Kg">Kg</option>
                            <option value="Litro">Litro</option>
                            <option value="Unidad">Unidad</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="locate"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Ubicación
                        </label>
                        <select
                            value={locate}
                            onChange={handleLocateChange}
                            name="locate"
                            id="locate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                            <option value="Neiva">Neiva</option>
                            <option value="Bogotá">Bogotá</option>
                            <option value="Cali">Cali</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="map_locate"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Ubicación en el mapa
                        </label>
                        <input
                            value={mapLocate}
                            onChange={handleMapLocateChange}
                            id="map_locate"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Crear Producto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProd;
