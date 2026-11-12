import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix leaflet default icon in Vite/Webpack bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LeafletMap({ latitude, longitude, farmName, onLocationSelect }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [latitude || 17.2473, longitude || 80.1514],
        zoom: 12,
        zoomControl: true,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Marker
      const marker = L.marker([latitude || 17.2473, longitude || 80.1514], {
        icon: defaultIcon,
        draggable: !!onLocationSelect,
      }).addTo(map);

      marker.bindPopup(`<b>${farmName || 'Farm Location'}</b><br>Lat: ${latitude?.toFixed(4)}, Lon: ${longitude?.toFixed(4)}`);

      if (onLocationSelect) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          marker.getPopup().setContent(`<b>Selected Farm Location</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`).openOn(map);
          onLocationSelect(lat, lng);
        });

        marker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          marker.getPopup().setContent(`<b>Selected Farm Location</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`).openOn(map);
          onLocationSelect(lat, lng);
        });
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      // Update existing map
      const map = mapInstanceRef.current;
      const marker = markerRef.current;
      if (latitude && longitude && map && marker) {
        map.setView([latitude, longitude], 12);
        marker.setLatLng([latitude, longitude]);
        marker.getPopup().setContent(`<b>${farmName || 'Farm Location'}</b><br>Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      }
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, farmName]);

  return (
    <div className="relative w-full h-80 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute bottom-2 right-2 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] text-stone-600 border border-stone-200 shadow-xs pointer-events-none">
        OpenStreetMap • Click or drag marker to set coordinates
      </div>
    </div>
  );
}
