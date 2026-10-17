import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { searchPlaces } from '../api';
import type { GeocodedAddress, LatLng } from '../types';

const SEARCH_DEBOUNCE_MS = 600;
const MIN_QUERY_LENGTH = 3;
const LOCATION_TIMEOUT_MS = 10000;
const FOCUSED_ZOOM = 16;

const pinIcon = L.divIcon({
  className: 'pin-icon',
  html: `<svg width="32" height="40" viewBox="0 0 24 30"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 30 12 30s12-10 12-18.3C24 5.2 18.6 0 12 0z" fill="#1F6FEB"/><circle cx="12" cy="11.5" r="4.5" fill="#fff"/></svg>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
});

type MapPickerProps = {
  position: LatLng;
  onPick: (position: LatLng) => void;
  onSearchSelect: (place: GeocodedAddress) => void;
};

const FlyToPosition = ({ position }: { position: LatLng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, Math.max(map.getZoom(), FOCUSED_ZOOM), { duration: 0.6 });
  }, [map, position]);
  return null;
};

const ClickToPick = ({ onPick }: { onPick: (position: LatLng) => void }) => {
  useMapEvents({ click: (event) => onPick(event.latlng) });
  return null;
};

const useDebouncedSearch = (query: string) => {
  const [results, setResults] = useState<GeocodedAddress[]>([]);

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchPlaces(query).then(setResults).catch(() => setResults([]));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return results;
};

export const MapPicker = ({ position, onPick, onSearchSelect }: MapPickerProps) => {
  const [query, setQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const results = useDebouncedSearch(query);

  const selectResult = (place: GeocodedAddress) => {
    setQuery('');
    onSearchSelect(place);
  };

  const useCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Location is not supported on this device.');
      return;
    }
    setIsLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIsLocating(false);
        onPick({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        setIsLocating(false);
        setLocationError('Could not get your location. Please enter the address manually.');
      },
      { timeout: LOCATION_TIMEOUT_MS, enableHighAccuracy: true }
    );
  };

  return (
    <div className="map-card">
      <MapContainer center={position} zoom={FOCUSED_ZOOM} className="map" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{ dragend: (event) => onPick(event.target.getLatLng()) }}
        />
        <FlyToPosition position={position} />
        <ClickToPick onPick={onPick} />
      </MapContainer>

      <div className="map-search">
        <input
          type="search"
          placeholder="Search an area or address"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {results.length > 0 && (
          <ul className="map-search-results">
            {results.map((place) => (
              <li key={`${place.lat},${place.lng}`}>
                <button type="button" onClick={() => selectResult(place)}>
                  {place.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="button" className="locate-button" onClick={useCurrentLocation} disabled={isLocating}>
        ◎ {isLocating ? 'Locating…' : 'Use Current Location'}
      </button>
      {locationError && <p className="map-error">{locationError}</p>}
    </div>
  );
};
