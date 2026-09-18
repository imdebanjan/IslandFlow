import React from 'react';
import { AlertTriangle, X, ShieldAlert, Wind, CloudLightning, CheckCircle2, RotateCcw } from 'lucide-react';
import { OPERATIONAL_SCENARIOS } from '../types/ferryConstants';

export default function EvacuationModal({ onClose, onTriggerScenario, currentScenario }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.2)',
              color: '#fb7185',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                Operational Surge & Public Safety Control
              </h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Execute contingency protocols for weather emergencies or crowd surges
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

        {/* Current Status Pill */}
        <div style={{
          background: currentScenario.id === 'storm_evacuation' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${currentScenario.id === 'storm_evacuation' ? '#f43f5e' : '#10b981'}`,
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {currentScenario.id === 'storm_evacuation' ? (
            <CloudLightning size={24} color="#fb7185" />
          ) : (
            <CheckCircle2 size={24} color="#34d399" />
          )}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
              Active Scenario: {currentScenario.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              {currentScenario.description}
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {/* Trigger 1: Severe Weather Evacuation */}
          <div
            onClick={() => {
              onTriggerScenario(OPERATIONAL_SCENARIOS.STORM_EVACUATION);
              onClose();
            }}
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CloudLightning size={16} />
                <span>Trigger Thunderstorm Island Evacuation</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Suspends outbound mainland sales. Directs all 5 vessels to island docks for rapid passenger return.
              </div>
            </div>
            <button className="btn btn-danger" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Execute Protocol
            </button>
          </div>

          {/* Trigger 2: Saturday Peak Rush */}
          <div
            onClick={() => {
              onTriggerScenario(OPERATIONAL_SCENARIOS.SATURDAY_PEAK);
              onClose();
            }}
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                <span>Simulate Saturday Peak Crowd Rush</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                2.8x sales and redemption multiplier. Stresses Jack Layton holding pen to trigger gate metering.
              </div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Simulate Surge
            </button>
          </div>

          {/* Trigger 3: Return to Normal */}
          <div
            onClick={() => {
              onTriggerScenario(OPERATIONAL_SCENARIOS.NORMAL);
              onClose();
            }}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCcw size={16} />
                <span>Reset to Standard Summer Operations</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Restores standard baseline sales curves, normal sailing intervals, and cleared weather warnings.
              </div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
              Restore Normal
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 18px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
