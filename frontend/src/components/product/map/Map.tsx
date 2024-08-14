import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const Map = () => {
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: 'YOUR_API_KEY'
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