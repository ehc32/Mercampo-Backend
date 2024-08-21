import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import './styles.css'

interface locationStatus {
    lat: number;
    lng: number;
    darkMode: boolean;
}

const Map: React.FC<locationStatus> = ({ lat, lng, darkMode }) => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: 'AIzaSyDWmh4H4O1AqdP5-nzLJft-EdFo9m6TDk8' // tener en cuenta de que esto puede variar
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
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
                {/* Marcadores o otros componentes del mapa */}
            </GoogleMap>


        </section>
    );
};

export default Map;