import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const Map = () => {
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: 'AIzaSyDWmh4H4O1AqdP5-nzLJft-EdFo9m6TDk8' // tener en cuenta de que esto puede variar
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <section>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: 37.7749, lng: -122.4194 }}
                zoom={12}
            >
                {/* Marcadores o otros componentes del mapa */}
            </GoogleMap>
            

        </section>
    );
};

export default Map;