import React, { useState } from 'react';
import { Ship, Anchor, Compass, Navigation, Users, Gauge, Wind, AlertCircle, X, CheckCircle } from 'lucide-react';
import { MAINLAND_TERMINAL, ROUTES } from '../types/ferryConstants';

export default function HarbourRadar({ simState, onSelectVessel }) {
  const { fleet, jackLaytonHoldingPen, routeDemands, scenario } = simState;
  const [selectedVesselId, setSelectedVesselId] = useState(null);

  const selectedVessel = fleet.find(v => v.id === selectedVesselId) || null;

  // Calculate coordinates for vessels along their route
  const getVesselCoords = (vessel) => {
    const routeKey = vessel.route.toUpperCase();
    const route = ROUTES[routeKey] || ROUTES.CENTRE;

    const startX = MAINLAND_TERMINAL.coords.x;
    const startY = MAINLAND_TERMINAL.coords.y;
    const endX = route.endCoords.x;
    const endY = route.endCoords.y;

    // Slight route curve offset for visual separation between inbound and outbound
    const progress = vessel.progress;
    const offset = vessel.direction === 'island' ? 14 : -14;

    const currentX = startX + (endX - startX) * progress + (Math.sin(progress * Math.PI) * offset);
    const currentY = startY + (endY - startY) * progress;

    // Angle of movement
    const dx = endX - startX;
    const dy = endY - startY;
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (vessel.direction === 'mainland') {
      angleDeg += 180;
    }

    return { x: currentX, y: currentY, angle: angleDeg };
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Radar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Navigation size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
              Toronto Inner Harbour Live Radar & Fleet Movement
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              AIS GPS telemetry tracking between Jack Layton Terminal and Toronto Islands
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
            <span>Centre Island Line</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Hanlan's Point Line</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
            <span>Ward's Island Line</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Nautical Radar Map */}
      <div className="radar-container" style={{ position: 'relative' }}>
        {/* Sweeping radar beam */}
        <div className="radar-sweep-line" />

        <svg
          viewBox="0 0 960 480"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Water gradient */}
            <radialGradient id="waterGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#081b36" />
              <stop offset="100%" stopColor="#040b17" />
            </radialGradient>

            {/* Vessel glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Radar concentric rings pattern */}
            <pattern id="radarGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Water Base Background */}
          <rect width="960" height="480" fill="url(#waterGlow)" />
          <rect width="960" height="480" fill="url(#radarGrid)" />

          {/* Range rings from Jack Layton Terminal */}
          <circle cx="460" cy="50" r="100" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeDasharray="3 3" />
          <circle cx="460" cy="50" r="200" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeDasharray="4 4" />
          <circle cx="460" cy="50" r="320" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeDasharray="5 5" />
          <text x="565" y="55" fill="rgba(56, 189, 248, 0.4)" fontSize="9" fontFamily="JetBrains Mono">0.5 NM</text>
          <text x="665" y="55" fill="rgba(56, 189, 248, 0.4)" fontSize="9" fontFamily="JetBrains Mono">1.0 NM</text>
          <text x="785" y="55" fill="rgba(56, 189, 248, 0.4)" fontSize="9" fontFamily="JetBrains Mono">1.6 NM</text>

          {/* Mainland Shoreline (Toronto Harbourfront / Queen's Quay) */}
          <path
            d="M 0 0 L 960 0 L 960 55 L 820 50 L 680 52 L 480 62 L 440 62 L 320 52 L 180 50 L 0 45 Z"
            fill="#0f1f38"
            stroke="#1e3a66"
            strokeWidth="2"
          />
          <text x="30" y="32" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="0.1em">
            TORONTO MAINLAND • QUEENS QUAY WEST
          </text>

          {/* Toronto Islands Geography (Hanlan's, Centre Island, Ward's Island, Algonquin) */}
          {/* Hanlan's Point & Airport strip */}
          <path
            d="M 50 260 C 90 240, 160 250, 210 270 C 240 285, 270 320, 260 380 C 230 430, 160 450, 100 420 C 60 400, 40 330, 50 260 Z"
            fill="#122844"
            stroke="#1d4375"
            strokeWidth="1.5"
          />
          {/* Billy Bishop Airport Runway reference */}
          <rect x="70" y="275" width="110" height="12" rx="3" fill="#1e324d" stroke="#334155" strokeWidth="1" transform="rotate(-15 125 281)" />
          <text x="80" y="310" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">YTZ RUNWAY</text>

          {/* Centre Island & Middle Islands */}
          <path
            d="M 280 340 C 330 300, 420 310, 530 320 C 610 330, 640 370, 620 420 C 580 460, 440 470, 340 450 C 280 430, 270 380, 280 340 Z"
            fill="#122844"
            stroke="#1d4375"
            strokeWidth="1.5"
          />

          {/* Ward's Island & Algonquin Island */}
          <path
            d="M 650 330 C 700 290, 800 300, 870 340 C 910 370, 910 420, 860 450 C 790 470, 710 450, 670 410 C 640 370, 645 345, 650 330 Z"
            fill="#122844"
            stroke="#1d4375"
            strokeWidth="1.5"
          />

          {/* Island Labels */}
          <text x="140" y="360" fill="#94a3b8" fontSize="11" fontWeight="700">HANLAN'S POINT</text>
          <text x="140" y="375" fill="#64748b" fontSize="9">Beaches & Park</text>

          <text x="420" y="390" fill="#94a3b8" fontSize="12" fontWeight="800">CENTRE ISLAND</text>
          <text x="420" y="405" fill="#64748b" fontSize="9">Centreville & Gardens</text>

          <text x="730" y="370" fill="#94a3b8" fontSize="11" fontWeight="700">WARD'S ISLAND</text>
          <text x="730" y="385" fill="#64748b" fontSize="9">Year-Round Community</text>

          {/* Navigation Route Paths (Dashed Glowing Lines) */}
          {/* Jack Layton -> Centre Island */}
          <path
            d="M 460 55 Q 470 190 480 340"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeOpacity="0.4"
          />
          {/* Jack Layton -> Hanlan's Point */}
          <path
            d="M 460 55 Q 330 170 220 290"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeOpacity="0.4"
          />
          {/* Jack Layton -> Ward's Island */}
          <path
            d="M 460 55 Q 600 180 740 320"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeOpacity="0.4"
          />

          {/* Mainland Terminal Dock Marker: Jack Layton */}
          <g transform="translate(460, 55)">
            <circle r="12" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
            <circle r="5" fill="#38bdf8" />
            <text x="18" y="4" fill="#f8fafc" fontSize="11" fontWeight="800">
              JACK LAYTON TERMINAL
            </text>
            <text x="18" y="16" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono">
              Queue: {jackLaytonHoldingPen} pax
            </text>
          </g>

          {/* Island Docks */}
          {/* Centre Island Dock */}
          <g transform="translate(480, 340)">
            <circle r="10" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
            <circle r="4" fill="#38bdf8" />
            <text x="-60" y="-12" fill="#38bdf8" fontSize="10" fontWeight="700">CENTRE DOCK</text>
            <text x="-60" y="2" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              Park: {routeDemands.centre.currentOnIsland} pax
            </text>
          </g>

          {/* Hanlan's Point Dock */}
          <g transform="translate(220, 290)">
            <circle r="10" fill="#059669" fillOpacity="0.25" stroke="#34d399" strokeWidth="2" />
            <circle r="4" fill="#34d399" />
            <text x="-70" y="-12" fill="#34d399" fontSize="10" fontWeight="700">HANLAN DOCK</text>
            <text x="-70" y="2" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              Park: {routeDemands.hanlan.currentOnIsland} pax
            </text>
          </g>

          {/* Ward's Island Dock */}
          <g transform="translate(740, 320)">
            <circle r="10" fill="#8b5cf6" fillOpacity="0.25" stroke="#c084fc" strokeWidth="2" />
            <circle r="4" fill="#c084fc" />
            <text x="16" y="-10" fill="#c084fc" fontSize="10" fontWeight="700">WARD DOCK</text>
            <text x="16" y="4" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
              Park: {routeDemands.ward.currentOnIsland} pax
            </text>
          </g>

          {/* Live Moving Ferries */}
          {fleet.map((vessel) => {
            if (vessel.isStandby) return null; // not on map

            const { x, y, angle } = getVesselCoords(vessel);
            const isSelected = selectedVesselId === vessel.id;
            const routeColor = ROUTES[vessel.route.toUpperCase()]?.color || '#38bdf8';
            const loadPct = Math.round((vessel.passengersOnboard / vessel.capacity) * 100);

            return (
              <g
                key={vessel.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => setSelectedVesselId(vessel.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection pulse ring */}
                {isSelected && (
                  <circle r="22" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Wake ripple behind moving boat */}
                {vessel.speedKnots > 0 && (
                  <ellipse
                    rx="14"
                    ry="6"
                    fill="rgba(56, 189, 248, 0.15)"
                    transform={`rotate(${angle}) translate(-14, 0)`}
                  />
                )}

                {/* Vessel Icon / Polygon rotated by heading */}
                <g transform={`rotate(${angle})`}>
                  <path
                    d="M 12 0 L -8 -7 L -5 0 L -8 7 Z"
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    stroke={routeColor}
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                </g>

                {/* Vessel Label Pill */}
                <g transform="translate(14, -14)">
                  <rect
                    x="-4"
                    y="-12"
                    width="120"
                    height="22"
                    rx="4"
                    fill="rgba(7, 13, 24, 0.85)"
                    stroke={isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.2)'}
                    strokeWidth="1"
                  />
                  <text x="4" y="2" fill="#f8fafc" fontSize="10" fontWeight="700">
                    {vessel.name.replace('MV ', '')}
                  </text>
                  <text x="82" y="2" fill={loadPct > 85 ? '#fbbf24' : '#34d399'} fontSize="9" fontFamily="JetBrains Mono">
                    {loadPct}%
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Vessel Quick-Selector Bar & Live Telemetry Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        {fleet.map((v) => {
          const isSelected = selectedVesselId === v.id;
          const loadPct = Math.round((v.passengersOnboard / v.capacity) * 100);

          return (
            <div
              key={v.id}
              onClick={() => setSelectedVesselId(v.id)}
              style={{
                background: isSelected ? 'rgba(2, 132, 199, 0.25)' : 'rgba(11, 20, 37, 0.65)',
                border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.12)'}`,
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#38bdf8' : '#f1f5f9' }}>
                  {v.name}
                </span>
                {v.isStandby ? (
                  <span style={{ fontSize: '9px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    STANDBY
                  </span>
                ) : (
                  <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Route: {ROUTES[v.route.toUpperCase()]?.name || v.route}</span>
                <span className="font-mono" style={{ color: '#e2e8f0' }}>
                  {v.isStandby ? '0 / 800' : `${v.passengersOnboard} / ${v.capacity}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Vessel Telemetry Detail Modal / Drawer */}
      {selectedVessel && (
        <div style={{
          background: 'rgba(11, 20, 37, 0.95)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ship size={20} color="#38bdf8" />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                  {selectedVessel.name} — Live AIS Telemetry
                </h4>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Built: {selectedVessel.yearBuilt} • Class: {selectedVessel.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedVesselId(null)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '12px' }}>
            <div className="glass-card-compact">
              <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Current Status</span>
              <div style={{ fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>{selectedVessel.status}</div>
            </div>
            <div className="glass-card-compact">
              <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Speed</span>
              <div className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>
                {selectedVessel.speedKnots} knots
              </div>
            </div>
            <div className="glass-card-compact">
              <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Passenger Load</span>
              <div className="font-mono" style={{ fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                {selectedVessel.passengersOnboard} / {selectedVessel.capacity} (
                {Math.round((selectedVessel.passengersOnboard / selectedVessel.capacity) * 100)}%)
              </div>
            </div>
            <div className="glass-card-compact">
              <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Crew On Duty</span>
              <div style={{ fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>
                {selectedVessel.crewOnDuty} certified officers
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
