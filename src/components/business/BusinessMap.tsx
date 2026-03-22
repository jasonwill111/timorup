'use client';

import { useEffect, useRef } from 'react';
import type { BusinessPage } from '@/types';

// Use dynamic import for SSR compatibility
let L: typeof import('leaflet') | null = null;

interface BusinessMapProps {
  lat: number | null;
  lng: number | null;
  address?: string;
  businessName?: string;
  height?: string;
  className?: string;
}

export default function BusinessMap({
  lat,
  lng,
  address,
  businessName,
  height = '250px',
  className = '',
}: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || lat === null || lng === null) return;

    const initMap = async () => {
      // Dynamic import to avoid SSR issues
      if (!L) {
        const leaflet = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        L = leaflet.default ?? leaflet;
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current!).setView([lat, lng], 15);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon
      const markerIcon = L.divIcon({
        html: `<div style="
          width: 36px; height: 36px;
          background: #FFD150;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        "><span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">📍</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
        className: '',
      });

      const popup = L.popup({ closeButton: true, className: 'business-map-popup' })
        .setContent(`
          <div style="min-width: 120px">
            ${businessName ? `<strong>${businessName}</strong><br>` : ''}
            ${address ? `<span style="font-size: 12px; color: #666">${address}</span>` : ''}
          </div>
        `);

      L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(popup);

      // Directions link — opens device's default maps app
      const directionsUrl = `https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`;
      map.on('click', () => {
        window.open(directionsUrl, '_blank');
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, address, businessName]);

  if (lat === null || lng === null) {
    return null;
  }

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className={`rounded-lg overflow-hidden border ${className}`}
    />
  );
}
