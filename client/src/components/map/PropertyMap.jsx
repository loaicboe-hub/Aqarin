import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react';

// Fix default leaflet marker icon issue in Webpack/Vite
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to auto-pan when center changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
}

export default function PropertyMap({ 
  properties = [], 
  center = [30.0444, 31.2357], 
  zoom = 11,
  selectedProperty = null,
  onSelectProperty = () => {}
}) {
  const defaultCenter = properties.length > 0 && properties[0].lat && properties[0].lng
    ? [properties[0].lat, properties[0].lng]
    : center;

  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden relative border border-slate-200 shadow-sm bg-slate-50">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={defaultCenter} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop) => {
          if (!prop.lat || !prop.lng) return null;
          return (
            <Marker
              key={prop.id}
              position={[prop.lat, prop.lng]}
              icon={customMarkerIcon}
              eventHandlers={{
                click: () => onSelectProperty(prop),
              }}
            >
              <Popup>
                <div className="w-56 p-2 bg-white text-slate-900 rounded-xl">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                    alt={prop.titleEn}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div className="font-black text-xs text-[#0B1C3D] mb-1">
                    {new Intl.NumberFormat().format(prop.price)} EGP
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 mb-1">
                    {prop.titleEn}
                  </h4>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    <span>{prop.district}</span>
                  </div>
                  <Link
                    to={`/property/${prop.id}`}
                    className="block w-full py-1 text-center bg-[#0B1C3D] hover:bg-[#122B5C] text-white rounded text-[11px] font-bold"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

