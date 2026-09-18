import React from 'react';
import { Ship, X, Check, Compass, AlertCircle, ArrowRight, Gauge, Clock, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../types/ferryConstants';

export default function FleetDispatchModal({ fleet, onClose, onToggleStandby, onReassignRoute, onUpdateFrequency }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ship size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                Ferry Fleet Dispatch & Schedule Optimization
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Operational decision support for headway timing, vessel routing, and standby fleet deployment
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Fleet Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {fleet.map((vessel) => {
            const route = ROUTES[vessel.route.toUpperCase()] || ROUTES.CENTRE;
            const loadPct = Math.round((vessel.passengersOnboard / vessel.capacity) * 100);

            return (
              <div
                key={vessel.id}
                style={{
                  background: 'rgba(13, 23, 42, 0.75)',
                  border: `1px solid ${vessel.isStandby ? 'rgba(245, 158, 11, 0.25)' : 'rgba(56, 189, 248, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                      {vessel.name}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: vessel.isStandby ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: vessel.isStandby ? '#fbbf24' : '#34d399',
                    }}>
                      {vessel.isStandby ? 'STANDBY AT PIER 6' : 'DEPLOYED / IN ROTATION'}
                    </span>
                    {vessel.yearRoundCritical && (
                      <span style={{ fontSize: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        YEAR-ROUND ESSENTIAL
                      </span>
                    )}
                  </div>

                  {/* Standby Toggle Button */}
                  {vessel.id === 'trillium' && (
                    <button
                      className={vessel.isStandby ? "btn btn-primary" : "btn btn-secondary"}
                      onClick={() => onToggleStandby(vessel.id)}
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      {vessel.isStandby ? 'Deploy Standby (+800 Seats)' : 'Return to Standby'}
                    </button>
                  )}
                </div>

                {/* Telemetry and Controls Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '12px' }}>
                  <div className="glass-card-compact">
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Assigned Route</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <select
                        value={vessel.route}
                        disabled={vessel.isStandby}
                        onChange={(e) => onReassignRoute(vessel.id, e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          borderRadius: '4px',
                          color: route.color,
                          fontWeight: 700,
                          fontSize: '11px',
                          padding: '3px 6px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="centre">Centre Island</option>
                        <option value="hanlan">Hanlan's Point</option>
                        <option value="ward">Ward's Island</option>
                      </select>
                    </div>
                  </div>

                  <div className="glass-card-compact">
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Capacity</span>
                    <div className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', marginTop: '3px' }}>
                      {vessel.capacity} passengers
                    </div>
                  </div>

                  <div className="glass-card-compact">
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Current Load</span>
                    <div className="font-mono" style={{ fontWeight: 700, color: loadPct > 80 ? '#fbbf24' : '#34d399', marginTop: '3px' }}>
                      {vessel.isStandby ? '0' : `${vessel.passengersOnboard} (${loadPct}%)`}
                    </div>
                  </div>

                  <div className="glass-card-compact">
                    <span style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Cruise Speed</span>
                    <div className="font-mono" style={{ fontWeight: 700, color: '#f1f5f9', marginTop: '3px' }}>
                      {vessel.speedKnots} kts
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Headway Recommendations */}
        <div style={{
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
            <Clock size={16} />
            <span>Recommended Headway Frequencies for Peak Period</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', color: '#94a3b8' }}>
            <div>
              <strong style={{ color: '#f1f5f9' }}>Centre Island:</strong> Every 15 min (2 vessels cycling)
            </div>
            <div>
              <strong style={{ color: '#f1f5f9' }}>Hanlan’s Point:</strong> Every 25 min (1 vessel)
            </div>
            <div>
              <strong style={{ color: '#f1f5f9' }}>Ward’s Island:</strong> Every 30 min (MV Ongiara)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 22px' }}>
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
