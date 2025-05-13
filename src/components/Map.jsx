import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useCities } from '../contexts/CitiesContext';
import { useMap, useMapEvent } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';
function Map() {
  const { cities, flagemojiToPNG } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = useUrlPosition();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition)
      return setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                {flagemojiToPNG(city.emoji)} <span>{city.cityName}</span>
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DectectClick />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DectectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
export default Map;
