import React from 'react';
import { QrCode, CheckCircle2, AlertCircle, Users, Activity, Settings2 } from 'lucide-react';
import { ROUTES } from '../types/ferryConstants';

export default function GateTurnstiles({ gates, onReassignGate }) {
  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <QrCode size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
              Jack Layton Terminal Turnstile Gates (1–8)
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Real-time barcode/NFC optical turnstile status, validation speed, and crowd queue depth
            </span>
          </div>
        </div>

        {/* Aggregate flow badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-badge badge-live">
            <span className="pulsing-dot" /> 8 / 8 GATES ONLINE
          </span>
        </div>
      </div>

      {/* Gates Grid */}
      <div className="gates-grid">
        {gates.map((gate) => {
          const route = ROUTES[gate.route.toUpperCase()] || { name: 'All Routes / Flex', color: '#38bdf8' };
          const lastEvent = gate.lastEvent;
          const isError = lastEvent && lastEvent.status !== 'SUCCESS';

          return (
            <div
              key={gate.id}
              className={`gate-card ${lastEvent ? (isError ? 'scan-flash-error' : 'scan-flash-success') : ''}`}
            >
              {/* Top Gate Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                    {gate.name}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8'
                  }}>
                    {gate.mode}
                  </span>
                </div>

                {/* Scanner Indicator Dot */}
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: isError ? '#f43f5e' : '#10b981',
                  boxShadow: isError ? '0 0 8px #f43f5e' : '0 0 8px #10b981',
                }} title={isError ? "Scan Incident" : "Turnstile Ready / Validated"} />
              </div>

              {/* Route Assignment Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: route.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: route.color }} />
                  {route.name}
                </span>

                {/* Reassignment trigger */}
                {onReassignGate && (
                  <button
                    onClick={() => {
                      const nextRoute = gate.route === 'centre' ? 'hanlan' : gate.route === 'hanlan' ? 'ward' : 'centre';
                      onReassignGate(gate.id, nextRoute);
                    }}
                    title="Change Gate Route Assignment"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px'
                    }}
                  >
                    <Settings2 size={13} />
                  </button>
                )}
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', marginTop: '2px' }}>
                <div>
                  Throughput: <strong className="font-mono" style={{ color: '#f1f5f9' }}>{gate.scansPerMin}</strong>/min
                </div>
                <div>
                  Queue: <strong className="font-mono" style={{ color: gate.queueLength > 50 ? '#fbbf24' : '#f1f5f9' }}>{gate.queueLength}</strong> pax
                </div>
              </div>

              {/* Last Scan Status Strip */}
              <div style={{
                fontSize: '10px',
                color: isError ? '#fb7185' : '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: 'rgba(0,0,0,0.2)',
                padding: '3px 6px',
                borderRadius: '4px',
              }}>
                {lastEvent ? (
                  <span>
                    {lastEvent.status === 'SUCCESS' ? '✓ ' : '⚠ '} 
                    {lastEvent.status === 'SUCCESS' ? `${lastEvent.ticketType.toUpperCase()} (${lastEvent.latencyMs}ms)` : lastEvent.status}
                  </span>
                ) : (
                  <span>Idle / Waiting next scan</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
