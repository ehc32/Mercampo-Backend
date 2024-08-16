import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface locationStatus {
    lat: number;
    lng: number;
}

const Map: React.FC<locationStatus> = ({ lat, lng }) => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-maps-script',
        googleMapsApiKey: 'AIzaSyDWmh4H4O1AqdP5-nzLJft-EdFo9m6TDk8' // tener en cuenta de que esto puede variar
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <section>

            <h4>Localización</h4>
            <h6>Encuentra al provedor a través de google maps</h6>
        
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