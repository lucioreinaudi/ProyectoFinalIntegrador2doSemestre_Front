import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Icon from './Icon';

// Importamos los estilos de Leaflet necesarios para que no se vea desarmado
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Solución al problema de las imágenes de los pines en React + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Este sub-componente captura los clicks del usuario adentro del mapa
const ClickHandler = ({ setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng); // Guarda latitud y longitud donde tocó
        },
    });
    return null;
};

const LocationPicker = ({ position, setPosition }) => {
    // Coordenadas centrales de Laboulaye
    const centerLaboulaye = [-34.1266, -63.3912];

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => {
                    alert("No se pudo obtener la ubicación. Revisá los permisos de tu navegador o activá el GPS.");
                    console.error(err);
                }
            );
        } else {
            alert("Tu dispositivo o navegador no soporta geolocalización.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            {/* Botón de Ubicación Actual */}
            <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={handleGetLocation}
            >
                <Icon name="map" size={18} /> Usar mi ubicación actual
            </button>

            {/* Contenedor del Mapa */}
            <div style={{ height: '280px', width: '100%', borderRadius: 'var(--radius-m)', overflow: 'hidden', border: '1px solid var(--borde-fuerte)', zIndex: 0 }}>
                <MapContainer
                    center={centerLaboulaye}
                    zoom={14}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    {position && <Marker position={position} />}
                    <ClickHandler setPosition={setPosition} />
                </MapContainer>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--texto-3)', margin: 0 }}>
                {position
                    ? `📍 Coordenadas: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
                    : 'Toca en el mapa para marcar el lugar exacto del problema.'}
            </p>
        </div>
    );
};

export default LocationPicker;