import React, { useState } from 'react';
import { Terminal, Search, Filter, ShieldAlert, CheckCircle2, Ticket, QrCode, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '../types/ferryConstants';

export default function LiveTelemetryStream({ recentSales, recentScans, anomaliesCount }) {
  const [activeTab, setActiveTab] = useState('scans'); // 'scans', 'sales', 'anomalies'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter scans
  const filteredScans = recentScans.filter(s => {
    if (activeTab === 'anomalies' && s.status === 'SUCCESS') return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.barcode.toLowerCase().includes(term) ||
      s.gateName.toLowerCase().includes(term) ||
      s.ticketType.toLowerCase().includes(term) ||
      s.route.toLowerCase().includes(term)
    );
  });

  // Filter sales
  const filteredSales = recentSales.filter(s => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.orderId.toLowerCase().includes(term) ||
      s.channel.toLowerCase().includes(term) ||
      s.route.toLowerCase().includes(term)
    );
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Stream Header */}
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
            <Terminal size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                Real-Time Telemetry Stream
              </h3>
              <span className="status-badge badge-live" style={{ padding: '2px 8px', fontSize: '10px' }}>
                <span className="pulsing-dot" /> STREAMING
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Sub-second event bus capturing turnstile optical scans and ticket transactions
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(11, 20, 37, 0.8)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.15)'
        }}>
          <button
            onClick={() => setActiveTab('scans')}
            style={{
              padding: '6px 12px',
              background: activeTab === 'scans' ? '#0284c7' : 'transparent',
              color: activeTab === 'scans' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <QrCode size={13} />
            <span>Turnstile Scans ({recentScans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            style={{
              padding: '6px 12px',
              background: activeTab === 'sales' ? '#0284c7' : 'transparent',
              color: activeTab === 'sales' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Ticket size={13} />
            <span>Ticket Sales ({recentSales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('anomalies')}
            style={{
              padding: '6px 12px',
              background: activeTab === 'anomalies' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
              color: activeTab === 'anomalies' ? '#fb7185' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={13} />
            <span>Incidents ({anomaliesCount})</span>
          </button>
        </div>
      </div>

      {/* Search Filter Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '10px' }} />
        <input
          type="text"
          placeholder="Filter by barcode, order ID, gate number, or route..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(11, 20, 37, 0.6)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '8px',
            padding: '8px 12px 8px 36px',
            color: '#f8fafc',
            fontSize: '12px',
            outline: 'none'
          }}
        />
      </div>

      {/* Stream Items Container */}
      <div className="stream-container">
        {activeTab === 'scans' || activeTab === 'anomalies' ? (
          filteredScans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '12px' }}>
              No turnstile scans match filter criteria.
            </div>
          ) : (
            filteredScans.map((scan) => {
              const isOk = scan.status === 'SUCCESS';
              const route = ROUTES[scan.route.toUpperCase()] || { name: scan.route, color: '#38bdf8' };

              return (
                <div
                  key={scan.scanId}
                  className="stream-item"
                  style={{ borderLeft: `3px solid ${isOk ? '#10b981' : '#f43f5e'}` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isOk ? (
                      <CheckCircle2 size={16} color="#10b981" />
                    ) : (
                      <ShieldAlert size={16} color="#f43f5e" />
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '12px' }}>
                          {scan.gateName}
                        </span>
                        <span className="font-mono" style={{ color: '#38bdf8', fontSize: '11px' }}>
                          {scan.barcode}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: `${route.color}20`,
                          color: route.color
                        }}>
                          {route.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: isOk ? '#94a3b8' : '#fb7185', marginTop: '2px' }}>
                        {scan.message} • Pass: {scan.ticketType.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: '#64748b' }}>
                      {new Date(scan.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                    <div style={{ fontSize: '10px', color: '#34d399' }}>
                      {scan.latencyMs}ms
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          filteredSales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '12px' }}>
              No ticket sales match filter criteria.
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div
                key={sale.orderId}
                className="stream-item"
                style={{ borderLeft: '3px solid #38bdf8' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Ticket size={16} color="#38bdf8" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono" style={{ fontWeight: 700, color: '#f8fafc', fontSize: '12px' }}>
                        {sale.orderId}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8'
                      }}>
                        {sale.channel}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        → {ROUTES[sale.route.toUpperCase()]?.name || sale.route}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {sale.itemsCount} tickets ({sale.items.map(i => i.type).join(', ')})
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>
                    ${sale.totalCAD.toFixed(2)} CAD
                  </span>
                  <div className="font-mono" style={{ fontSize: '10px', color: '#64748b' }}>
                    {new Date(sale.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
