import React from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Globe, Smartphone, Monitor, CreditCard } from 'lucide-react';
import { TICKET_TYPES, CHANNELS, ROUTES } from '../types/ferryConstants';

export default function AnalyticsCharts({ simState }) {
  const { hourlyHistory, ticketTypeSales, channelSales, routeDemands, totalTicketsSold } = simState;

  // Maximum scale for hourly chart
  const maxVolume = Math.max(...hourlyHistory.map(h => Math.max(h.sales, h.redemptions, h.returns)), 3500);

  // Calculate percentages for channels
  const totalChannels = Object.values(channelSales).reduce((a, b) => a + b, 0) || 1;
  const channelData = [
    { ...CHANNELS.ONLINE, count: channelSales.online || 0, pct: Math.round(((channelSales.online || 0) / totalChannels) * 100), color: '#38bdf8' },
    { ...CHANNELS.APP, count: channelSales.app || 0, pct: Math.round(((channelSales.app || 0) / totalChannels) * 100), color: '#06b6d4' },
    { ...CHANNELS.KIOSK, count: channelSales.kiosk || 0, pct: Math.round(((channelSales.kiosk || 0) / totalChannels) * 100), color: '#a855f7' },
    { ...CHANNELS.BOOTH, count: channelSales.booth || 0, pct: Math.round(((channelSales.booth || 0) / totalChannels) * 100), color: '#f59e0b' },
  ];

  // Route breakdown
  const totalRouteDemand = routeDemands.centre.sold + routeDemands.hanlan.sold + routeDemands.ward.sold || 1;
  const routePcts = {
    centre: Math.round((routeDemands.centre.sold / totalRouteDemand) * 100),
    hanlan: Math.round((routeDemands.hanlan.sold / totalRouteDemand) * 100),
    ward: Math.round((routeDemands.ward.sold / totalRouteDemand) * 100),
  };

  // Ticket categories
  const totalTypes = Object.values(ticketTypeSales).reduce((a, b) => a + b, 0) || 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      {/* Chart 1: Hourly Sales vs Gate Redemptions Lag */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                Purchase vs Redemption Lag Curve
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Hourly time series: tickets sold vs gate scans vs island return outflow
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#38bdf8', borderRadius: '2px' }} />
            <span>Tickets Sold</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }} />
            <span>Turnstile Redemptions (Inflow)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px' }} />
            <span>Island Return Outflow</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
              <line
                key={i}
                x1="30"
                y1={160 - p * 140}
                x2="490"
                y2={160 - p * 140}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2 2"
              />
            ))}

            {/* Bars for each hour */}
            {hourlyHistory.map((h, i) => {
              const x = 40 + i * 55;
              const salesH = (h.sales / maxVolume) * 140;
              const scanH = (h.redemptions / maxVolume) * 140;
              const returnH = (h.returns / maxVolume) * 140;

              return (
                <g key={i}>
                  {/* Sales bar */}
                  <rect
                    x={x}
                    y={160 - salesH}
                    width="10"
                    height={salesH}
                    rx="2"
                    fill="rgba(56, 189, 248, 0.6)"
                  />
                  {/* Scans bar */}
                  <rect
                    x={x + 12}
                    y={160 - scanH}
                    width="10"
                    height={scanH}
                    rx="2"
                    fill="rgba(16, 185, 129, 0.75)"
                  />
                  {/* Returns bar */}
                  <rect
                    x={x + 24}
                    y={160 - returnH}
                    width="8"
                    height={returnH}
                    rx="2"
                    fill="rgba(245, 158, 11, 0.75)"
                  />

                  {/* Hour text */}
                  <text x={x + 16} y="175" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">
                    {h.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Chart 2: Route Destination Demand Split */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(168, 85, 247, 0.12)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PieChart size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
              Route & Destination Distribution
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Share of ticket purchases and passenger movement by island dock
            </span>
          </div>
        </div>

        {/* Route Visual Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
          {/* Centre Island */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                Centre Island (Recreation / Family)
              </span>
              <span className="font-mono" style={{ color: '#f1f5f9' }}>
                {routePcts.centre}% ({routeDemands.centre.sold.toLocaleString()} pax)
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${routePcts.centre}%`, height: '100%', background: '#0284c7', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Hanlan's Point */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#34d399', fontWeight: 700 }}>
                Hanlan's Point (Beaches & Events)
              </span>
              <span className="font-mono" style={{ color: '#f1f5f9' }}>
                {routePcts.hanlan}% ({routeDemands.hanlan.sold.toLocaleString()} pax)
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${routePcts.hanlan}%`, height: '100%', background: '#059669', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Ward's Island */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>
                Ward's Island (Year-Round Residents & Quiet)
              </span>
              <span className="font-mono" style={{ color: '#f1f5f9' }}>
                {routePcts.ward}% ({routeDemands.ward.sold.toLocaleString()} pax)
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${routePcts.ward}%`, height: '100%', background: '#8b5cf6', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Ticket Category Matrix */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>
            Ticket Category Breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
            {Object.values(TICKET_TYPES).map(t => (
              <div key={t.id} style={{ background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '6px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '10px' }}>{t.label}</span>
                <span className="font-mono" style={{ fontWeight: 700, color: t.color }}>
                  {(ticketTypeSales[t.id] || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Sales Channel Distribution */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
              Sales Channel Mix & Issuance
            </h3>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Point of purchase origin for tickets redeemed at turnstiles
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {channelData.map(ch => (
            <div key={ch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', background: 'rgba(11, 20, 37, 0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: ch.color }}>
                  {ch.id === 'online' && <Globe size={18} />}
                  {ch.id === 'app' && <Smartphone size={18} />}
                  {ch.id === 'kiosk' && <Monitor size={18} />}
                  {ch.id === 'booth' && <CreditCard size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{ch.label}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Barcode / QR Pre-issued</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: ch.color }}>
                  {ch.pct}%
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{ch.count.toLocaleString()} tickets</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          fontSize: '11px',
          color: '#94a3b8',
          background: 'rgba(56, 189, 248, 0.06)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '8px',
          padding: '10px',
          lineHeight: '1.4'
        }}>
          💡 <strong>Operational Insight:</strong> 78% of tickets are pre-purchased digitally (Web & App). Peak online sales occur 90 minutes prior to gate redemption, providing an early warning for terminal staffing needs.
        </div>
      </div>
    </div>
  );
}
