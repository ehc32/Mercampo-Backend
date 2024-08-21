import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './styles.css'
import { useEffect, useState } from 'react';

interface locationStatus {
    address: string;
    darkMode: boolean;
}

const Map: React.FC<locationStatus> = ({ address, darkMode }) => {

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: 'AIzaSyDWmh4H4O1AqdP5-nzLJft-EdFo9m6TDk8' // tener en cuenta de que esto puede variar
    });

    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const geocodeAddress = async () => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDWmh4H4O1AqdP5-nzLJft-EdFo9m6TDk8`);
        const data = await response.json();
        console.log(data)
        if (data.results.length > 0) {
            const coordinates = data.results[0].geometry.location;
            console.log(coordinates)
            setLat(coordinates.lat);
            setLng(coordinates.lng);
        }
    };

    useEffect(() => {
        geocodeAddress();
    }, [address]);

    if (loadError) {
        return <div>Error al cargar el mapa</div>;
    }

    if (!isLoaded) {
        return <div>Cargando...</div>;
    }

    return (
        <section className="sectionMap">
            <h2 className={darkMode ? 'titulo-sala-compra-dark' : 'titulo-sala-compra-light'}>Localización</h2>
            <h4 className={darkMode ? 'sub-titulo-sala-compra-dark' : 'sub-titulo-sala-compra-light'}>Encuentra lo que te gusta de manera eficiente</h4>

            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: lat, lng: lng }}
                zoom={12}
            >
                {lat && lng && (
                    <Marker
                        position={{ lat: lat, lng: lng }}
                        icon={{
                            url: 'https://sena.edu.co/Style%20Library/alayout/images/logoSena.png',
                            scaledSize: new window.google.maps.Size(40, 40),
                        }}
                    />
                )}
            </GoogleMap>
        </section>
    );
};

export default Map;