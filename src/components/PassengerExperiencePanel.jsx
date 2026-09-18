import React from 'react';
import { Smile, Clock, Zap, AlertCircle, Info, Radio, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import { MAINLAND_TERMINAL } from '../types/ferryConstants';

export default function PassengerExperiencePanel({ simState }) {
  const { jackLaytonHoldingPen, gates, scenario } = simState;

  // Queue wait calculation
  const holdingCapacity = MAINLAND_TERMINAL.holdingPenMaxCapacity;
  const holdingPct = Math.min(100, Math.round((jackLaytonHoldingPen / holdingCapacity) * 100));

  let comfortRating = 'EXCELLENT';
  let comfortScore = 94;
  let comfortColor = '#10b981';

  if (holdingPct > 75 || scenario.id === 'storm_evacuation') {
    comfortRating = 'CONGESTED';
    comfortScore = 52;
    comfortColor = '#f43f5e';
  } else if (holdingPct > 50) {
    comfortRating = 'MODERATE CROWDING';
    comfortScore = 78;
    comfortColor = '#f59e0b';
  }

  const estimatedWaitMin = Math.max(3, Math.round(jackLaytonHoldingPen / 170));

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
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
            <Smile size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
              Peak-Hour Passenger Experience & Terminal Operations
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Real-time line wait monitoring, passenger comfort metrics, and express gate guidance
            </span>
          </div>
        </div>

        {/* Comfort Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: `${comfortColor}20`,
          border: `1px solid ${comfortColor}40`,
          color: comfortColor,
          fontSize: '11px',
          fontWeight: 700
        }}>
          <span>Passenger Comfort Index: {comfortScore}/100 ({comfortRating})</span>
        </div>
      </div>

      {/* 3 Metric Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {/* Metric 1: Average Queue Wait */}
        <div className="glass-card-compact">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Clock size={15} />
            <span>Estimated Terminal Wait Time</span>
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: estimatedWaitMin > 15 ? '#fbbf24' : '#f8fafc' }}>
            ~{estimatedWaitMin} min
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            From turnstile tap to vessel gangway boarding
          </div>
        </div>

        {/* Metric 2: Express Mobile QR Lane Throughput */}
        <div className="glass-card-compact">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Smartphone size={15} />
            <span>Digital Express Lane Velocity</span>
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#34d399' }}>
            1.8 sec / scan
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Gates 1 & 4 bypass booth lines with pre-loaded Apple/Google Wallet QR
          </div>
        </div>

        {/* Metric 3: Holding Pen Crowd Density */}
        <div className="glass-card-compact">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Zap size={15} />
            <span>Mainland Holding Pen Load</span>
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: holdingPct > 75 ? '#fb7185' : '#f8fafc' }}>
            {jackLaytonHoldingPen} <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>/ 3,500 max</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Safe comfort threshold: 2,800 capacity
          </div>
        </div>
      </div>

      {/* Live Terminal Passenger Digital Signage Preview */}
      <div style={{
        background: 'rgba(2, 132, 199, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '10px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{ color: '#38bdf8', marginTop: '2px' }}>
          <Radio size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8' }}>
              Active Terminal Digital Signage (Bay St Entrance & Waterfront Esplanade)
            </span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#64748b' }}>AUTO-SYNCED</span>
          </div>
          <div className="font-mono" style={{ fontSize: '12px', color: '#f1f5f9', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
            "{scenario.id === 'storm_evacuation' 
              ? 'ALERT: ALL ISLAND DEPARTURES TEMPORARILY METERED FOR RETURN EVACUATION. PLEASE STAND BY.' 
              : `NEXT DEPARTURES: CENTRE ISLAND (12 MIN - MV THOMAS RENNIE) • HANLAN'S (18 MIN - MV WM INGLIS) • WARD'S (24 MIN - MV ONGIARA). GATES 1-8 ACTIVE. PRE-PURCHASED MOBILE TICKETS USE GATES 1 & 4 FOR EXPRESS ENTRY.`}"
          </div>
        </div>
      </div>
    </div>
  );
}
