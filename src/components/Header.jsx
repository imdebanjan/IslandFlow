import React from 'react';
import { 
  Anchor, 
  Wind, 
  Droplets, 
  Thermometer, 
  Play, 
  Pause, 
  FastForward, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Download, 
  Ship, 
  Compass, 
  RefreshCw 
} from 'lucide-react';
import { OPERATIONAL_SCENARIOS } from '../types/ferryConstants';
import { soundEffects } from '../services/soundEffects';

export default function Header({
  simState,
  onUpdateSpeed,
  onSelectScenario,
  onOpenFleetModal,
  onOpenEvacuationModal,
  onExportData,
  soundMuted,
  onToggleSound,
}) {
  const scenario = simState.scenario;
  const simTime = new Date(simState.simTime);
  const timeFormatted = simTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const getStatusBadge = () => {
    if (scenario.id === 'storm_evacuation') {
      return (
        <span className="status-badge badge-critical">
          <span className="pulsing-dot" /> EVACUATION PROTOCOL ACTIVE
        </span>
      );
    }
    if (simState.jackLaytonHoldingPen > 2800) {
      return (
        <span className="status-badge badge-warning">
          <span className="pulsing-dot" /> GATE FLOW METERED (CONGESTION)
        </span>
      );
    }
    return (
      <span className="status-badge badge-live">
        <span className="pulsing-dot" /> ALL ROUTES OPERATIONAL
      </span>
    );
  };

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
          }}>
            <Ship size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                TORONTO ISLAND FERRY SERVICE
              </h1>
              {getStatusBadge()}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>City of Toronto Parks, Forestry & Recreation</span>
              <span>•</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Jack Layton Ferry Terminal Operations Center</span>
              <span>•</span>
              <span className="font-mono" style={{ color: '#e2e8f0' }}>TORONTO {timeFormatted} EDT</span>
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onToggleSound} 
            title={soundMuted ? "Enable Audio Scan Telemetry" : "Mute Audio Telemetry"}
            style={{ padding: '8px 12px' }}
          >
            {soundMuted ? <VolumeX size={16} color="#94a3b8" /> : <Volume2 size={16} color="#38bdf8" />}
            <span>{soundMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onOpenFleetModal}
            style={{ padding: '8px 14px' }}
          >
            <Compass size={16} color="#38bdf8" />
            <span>Fleet Dispatch ({simState.fleet.filter(v => !v.isStandby).length}/5)</span>
          </button>

          <button 
            className={scenario.id === 'storm_evacuation' ? "btn btn-danger" : "btn btn-secondary"}
            onClick={onOpenEvacuationModal}
            style={{ padding: '8px 14px' }}
          >
            <AlertTriangle size={16} color={scenario.id === 'storm_evacuation' ? '#fb7185' : '#f59e0b'} />
            <span>Emergency / Surge</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onExportData}
            style={{ padding: '8px 14px' }}
          >
            <Download size={16} color="#94a3b8" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Harbour Weather Telemetry & Simulation Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {/* Weather & Lake Conditions Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={15} color="#38bdf8" />
            <span>Air: <strong style={{ color: '#f1f5f9' }}>{scenario.weather.temp}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={15} color="#06b6d4" />
            <span>Lake Ontario: <strong style={{ color: '#f1f5f9' }}>{scenario.weather.lakeTemp}</strong> ({scenario.weather.waterCondition})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={15} color="#a855f7" />
            <span>Wind: <strong style={{ color: '#f1f5f9' }}>{scenario.weather.wind}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Anchor size={15} color="#10b981" />
            <span>Nav Status: <strong style={{ color: '#34d399' }}>Inner Harbour Clear</strong></span>
          </div>
        </div>

        {/* Operational Scenarios & Sim Engine Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Scenario Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Scenario:</span>
            <select
              value={scenario.id}
              onChange={(e) => {
                const found = Object.values(OPERATIONAL_SCENARIOS).find(s => s.id === e.target.value);
                if (found) onSelectScenario(found);
              }}
              style={{
                background: 'rgba(15, 26, 47, 0.9)',
                color: '#f8fafc',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {Object.values(OPERATIONAL_SCENARIOS).map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(11, 20, 37, 0.8)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.15)'
          }}>
            <button
              onClick={() => onUpdateSpeed(simState.simSpeed === 0 ? 1 : 0)}
              style={{
                padding: '5px 8px',
                background: simState.simSpeed === 0 ? 'rgba(244, 63, 94, 0.3)' : 'transparent',
                color: simState.simSpeed === 0 ? '#fb7185' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}
              title={simState.simSpeed === 0 ? "Resume Simulation" : "Pause Simulation"}
            >
              {simState.simSpeed === 0 ? <Play size={12} fill="#fb7185" /> : <Pause size={12} />}
              <span>{simState.simSpeed === 0 ? 'Paused' : 'Pause'}</span>
            </button>

            {[1, 5, 15].map(spd => (
              <button
                key={spd}
                onClick={() => onUpdateSpeed(spd)}
                style={{
                  padding: '5px 9px',
                  background: simState.simSpeed === spd ? '#0284c7' : 'transparent',
                  color: simState.simSpeed === spd ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  transition: 'all 0.15s'
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
