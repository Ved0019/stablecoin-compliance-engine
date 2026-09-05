import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label: string;
}

export interface GlobeConfig {
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
}

interface Globe3DProps {
  markers: GlobeMarker[];
  config?: GlobeConfig;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

export default function Globe3D({
  markers,
  config = {},
  onMarkerClick,
  onMarkerHover
}: Globe3DProps) {
  const globeRef = useRef<HTMLDivElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [rotation, setRotation] = useState(0);

  const {
    atmosphereColor = '#4da6ff',
    atmosphereIntensity = 20,
    bumpScale = 5,
    autoRotateSpeed = 0.3
  } = config;

  const handleMarkerMouseEnter = (marker: GlobeMarker) => {
    setHoveredMarker(marker);
    onMarkerHover?.(marker);
  };

  const handleMarkerMouseLeave = () => {
    setHoveredMarker(null);
    onMarkerHover?.(null);
  };

  const handleMarkerClick = (marker: GlobeMarker) => {
    onMarkerClick?.(marker);
  };

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    let frameId: number;
    let currentRotation = 0;
    const animate = () => {
      currentRotation += autoRotateSpeed * 0.01;
      setRotation(currentRotation);
      globe.style.setProperty('--rotation', `${currentRotation}deg`);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup would go here if needed
    return () => cancelAnimationFrame(frameId);
  }, [autoRotateSpeed]);

  // Convert lat/lng to 3D coordinates on sphere
  const getMarkerPosition = (marker: GlobeMarker, globeSize: number) => {
    const lat = (marker.lat * Math.PI) / 180; // Convert to radians
    const lng = (marker.lng * Math.PI) / 180; // Convert to radians

    const radius = globeSize / 2;

    // 3D coordinates
    const x = radius * Math.cos(lat) * Math.cos(lng);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lng);

    // Apply rotation
    const rotatedX = x * Math.cos(rotation * Math.PI / 180) - z * Math.sin(rotation * Math.PI / 180);
    const rotatedZ = x * Math.sin(rotation * Math.PI / 180) + z * Math.cos(rotation * Math.PI / 180);

    return { x: rotatedX, y, z: rotatedZ };
  };

  // Simple 2D projection for positioning (for tooltip)
  const getMarker2DPosition = (marker: GlobeMarker, globeSize: number) => {
    const lat = marker.lat;
    const lng = marker.lng;

    // Simple equirectangular projection
    const x = ((lng + 180) / 360) * globeSize;
    const y = ((90 - lat) / 180) * globeSize;

    return { x, y };
  };

  return (
    <div
      ref={globeRef}
      className="relative w-[400px] h-[400px] mx-auto"
      style={{
        '--atmosphere-color': atmosphereColor,
        '--atmosphere-intensity': atmosphereIntensity.toString(),
        '--bump-scale': bumpScale.toString()
      } as CSSProperties}
    >
      {/* Globe sphere with enhanced styling */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Base globe */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 40%),
              radial-gradient(circle at 70% 70%, rgba(224,247,255,0.6) 0%, transparent 40%),
              conic-gradient(from 0deg at 50% 50%, var(--atmosphere-color) 0%, transparent 40%),
              radial-gradient(farthest-side at 50% 50%, #003a63, #001a33)
            `
          }}
        />

        {/* Globe texture - enhanced details */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at center,
                rgba(255,255,255,0.3) 0%,
                rgba(255,255,255,0.1) 40%,
                transparent 70%),
              radial-gradient(ellipse at 70% 30%,
                rgba(255,255,255,0.2) 0%,
                transparent 40%),
              radial-gradient(ellipse at 30% 70%,
                rgba(255,255,255,0.2) 0%,
                transparent 40%),
              repeating-radial-gradient(
                center center,
                rgba(255,255,255,0.05) 0px,
                rgba(255,255,255,0.05) 1px,
                transparent 1px,
                transparent 10px
              )
            `
          }}
        />

        {/* Atmospheric glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center,
                rgba(77,166,255,0.1) 0%,
                transparent 70%)
            `,
            filter: `blur(20px)`
          }}
        />
      </div>

      {/* Marker containers */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map((marker, index) => {
          const { z } = getMarkerPosition(marker, 200); // Increased radius for better spacing
          const { x: x2d, y: y2d } = getMarker2DPosition(marker, 400); // 400 is globe diameter

          // Only show markers on the front hemisphere (simplified)
          const isVisible = z > -80; // Adjusted threshold
          const scale = isVisible ? Math.max(0.6, (z + 200) / 280) : 0; // Scale based on depth

          return (
            <div
              key={index}
              className="absolute flex items-center justify-center"
              style={{
                left: `${x2d}px`,
                top: `${y2d}px`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => handleMarkerMouseEnter(marker)}
              onMouseLeave={handleMarkerMouseLeave}
              onClick={() => handleMarkerClick(marker)}
            >
              {/* Marker background with depth effect */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-white/20 hover:bg-white/80 transition-all duration-300 transform-gpu"
                  style={{
                    transform: `translateZ(${z * 0.1}px)`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.15)`
                  }}
                >
                  <img
                    src={marker.src}
                    alt={marker.label}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${marker.label.split(' ')[0][0]}${marker.label.split(' ')[1]?.[0] || ''}&background=random&size=128`;
                    }}
                  />

                  {/* Pulse effect for active markers */}
                  {hoveredMarker === marker && (
                    <div className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </div>

                {/* Connection lines to show global network */}
                {!hoveredMarker && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: 0.15,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    {markers.map((otherMarker, otherIndex) => {
                      if (otherIndex !== index) {
                        const { z: z2 } = getMarkerPosition(otherMarker, 200);
                        const { x: x2d2, y: y2d2 } = getMarker2DPosition(otherMarker, 400);
                        const isOtherVisible = z2 > -80;

                        return isOtherVisible && (
                          <div key={otherIndex} className="absolute"
                            style={{
                              left: `${x2d2}px`,
                              top: `${y2d2}px`,
                              width: '2px',
                              height: '2px',
                              background: 'rgba(77,166,255,0.5)',
                              transformOrigin: 'center',
                              transform: `rotate(${Math.atan2(y2d - y2d2, x2d - x2d2) * (180 / Math.PI)}deg) translateX(-50%)`,
                              boxShadow: `0 0 8px rgba(77,166,255,0.3)`
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>

              {/* Tooltip */}
              {hoveredMarker === marker && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-3 py-1.5 bg-slate-800/90 text-white text-xs rounded-md shadow-lg backdrop-blur-sm whitespace-nowrap"
                  style={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {marker.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}