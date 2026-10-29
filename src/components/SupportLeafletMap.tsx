import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SupportPoint, SupportCategory } from '../types';

interface SupportLeafletMapProps {
  points: SupportPoint[];
  selectedPoint: SupportPoint | null;
  onSelectPoint: (point: SupportPoint) => void;
  centerLat: number;
  centerLon: number;
  userGps?: { lat: number; lon: number } | null;
  zoom?: number;
}

const CATEGORY_COLORS: Record<SupportCategory, string> = {
  water: '#0284C7',     // Sky Blue
  shade: '#15803D',     // Forest Green
  cooling: '#0D9488',   // Teal
  clinic: '#DC2626',    // Crimson Red
  facility: '#7C3AED',  // Purple
};

const CATEGORY_ICONS: Record<SupportCategory, string> = {
  water: '💧',
  shade: '🌳',
  cooling: '❄️',
  clinic: '🏥',
  facility: '🚻',
};

export const SupportLeafletMap: React.FC<SupportLeafletMapProps> = ({
  points,
  selectedPoint,
  onSelectPoint,
  centerLat,
  centerLon,
  userGps,
  zoom = 13,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLon], zoom);
    }
  }, [centerLat, centerLon, zoom]);

  // Update user GPS location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userGps && userGps.lat && userGps.lon) {
      const userHtml = `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: rgba(59, 130, 246, 0.4);
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: absolute;
            top: 4px;
            left: 4px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #2563EB;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          "></div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: userHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([userGps.lat, userGps.lon], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; font-weight: 600; color: #1E40AF; padding: 2px;">
          📍 Your Exact GPS Location<br />
          <span style="font-size: 10px; color: #6B7280; font-weight: 400;">
            ${userGps.lat.toFixed(4)}, ${userGps.lon.toFixed(4)}
          </span>
        </div>
      `);
      userMarkerRef.current = marker;
    }
  }, [userGps]);

  // Update resource markers when points or selectedPoint changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add marker for each point
    points.forEach((point) => {
      const color = CATEGORY_COLORS[point.category] || '#15803D';
      const iconEmoji = CATEGORY_ICONS[point.category] || '📍';
      const isSelected = selectedPoint?.id === point.id;

      const customHtml = `
        <div style="
          background-color: ${color};
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          font-size: ${isSelected ? '18px' : '14px'};
          cursor: pointer;
          transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
          transition: transform 0.15s ease;
        ">
          ${iconEmoji}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: customHtml,
        iconSize: isSelected ? [38, 38] : [32, 32],
        iconAnchor: isSelected ? [19, 19] : [16, 16],
      });

      const marker = L.marker([point.lat, point.lon], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectPoint(point);
      });

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px; min-width: 180px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${color}; margin-bottom: 2px;">
            ${point.category.toUpperCase()} ${point.isDemo ? '· DEMO' : '· VERIFIED'}
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px;">
            ${point.name}
          </div>
          <div style="font-size: 12px; color: #4B5563; margin-bottom: 6px;">
            ${point.address}
          </div>
          <div style="font-size: 11px; color: #047857; font-weight: 500;">
            🕒 ${point.operatingHours}
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      markersRef.current[point.id] = marker;
    });

    // If selected point is active, pan to it and open popup
    if (selectedPoint && markersRef.current[selectedPoint.id]) {
      const selectedMarker = markersRef.current[selectedPoint.id];
      map.panTo([selectedPoint.lat, selectedPoint.lon], { animate: true });
      selectedMarker.openPopup();
    }
  }, [points, selectedPoint, onSelectPoint]);

  const handleCenterOnUser = () => {
    if (userGps && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userGps.lat, userGps.lon], 15, { animate: true });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '380px' }} />
      {userGps && (
        <button
          onClick={handleCenterOnUser}
          className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-white text-blue-700 text-xs font-bold rounded-lg shadow-md border border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Recenter map to your live GPS position"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
          <span>My GPS Position</span>
        </button>
      )}
    </div>
  );
};
