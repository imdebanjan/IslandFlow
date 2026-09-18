import React from 'react';
import { 
  DollarSign, 
  Ticket, 
  Users, 
  Clock, 
  Ship, 
  TrendingUp, 
  ArrowRightLeft, 
  Snowflake, 
  Calendar, 
  ArrowUpRight, 
  Layers 
} from 'lucide-react';
import { MAINLAND_TERMINAL } from '../types/ferryConstants';

export default function KpiMetrics({ simState }) {
  const {
    totalRevenueCAD,
    totalTicketsSold,
    totalRedemptions,
    totalIslandReturns,
    islandCurrentVisitors,
    jackLaytonHoldingPen,
    hourlyHistory,
    gates,
    scenario,
  } = simState;

  // Latest hour record
  const currentHourData = hourlyHistory[hourlyHistory.length - 1] || {
    sales: 2650,
    redemptions: 2510,
    returns: 1340,
    revenue: 21950,
  };

  // KPI 1: Tickets Sold per Hour
  const ticketsSoldPerHour = currentHourData.sales;

  // KPI 2: Tickets Redeemed per Hour
  const ticketsRedeemedPerHour = currentHourData.redemptions;

  // KPI 3: Net Passenger Movement (Sales - Redemptions)
  // Reflects tickets purchased awaiting redemption at gates + net park holding
  const netHourlyMovement = ticketsSoldPerHour - ticketsRedeemedPerHour;
  const netCumulativeMovement = totalTicketsSold - totalRedemptions;

  // KPI 4: Peak Demand Windows
  const peakWindow = {
    label: scenario.id === 'winter_commute' ? '07:30 – 09:00 & 16:30 – 18:00' : '11:00 – 13:30 EDT',
    subtext: scenario.id === 'winter_commute' ? 'Commuter Peak (Ward’s Island)' : 'Outbound Peak (Centreville Rush)',
    surgeFactor: scenario.id === 'saturday_peak' ? '2.8x' : scenario.id === 'winter_commute' ? '0.4x' : '1.8x',
  };

  // KPI 5: Off-Season Utilization Index
  // Ratio of baseline essential ridership (residents, park maintenance, year-round ferry) vs peak summer capacity
  const offSeasonIndex = scenario.id === 'winter_commute' 
    ? 24.8 
    : scenario.id === 'saturday_peak' 
      ? 94.2 
      : 68.5; // % seasonal efficiency rating

  const formatNum = (val) => new Intl.NumberFormat('en-CA').format(val);

  return (
    <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      {/* KPI 1: Tickets Sold per Hour */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <div>
            <span className="kpi-title">Tickets Sold / Hour</span>
            <div className="kpi-value">{formatNum(ticketsSoldPerHour)}</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
            <Ticket size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e2e8f0', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700 }}>{formatNum(totalTicketsSold)}</span>
          <span style={{ color: '#94a3b8' }}>total issued today</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            color: '#34d399',
            fontSize: '11px',
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            <ArrowUpRight size={12} /> Live
          </span>
        </div>
        <div className="kpi-footer">
          <span>Current Gross: ${(totalRevenueCAD).toLocaleString()} CAD</span>
          <span>Web/App: 78%</span>
        </div>
      </div>

      {/* KPI 2: Tickets Redeemed per Hour */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <div>
            <span className="kpi-title">Tickets Redeemed / Hour</span>
            <div className="kpi-value">{formatNum(ticketsRedeemedPerHour)}</div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#e2e8f0', marginBottom: '8px' }}>
          <div>
            <span style={{ color: '#34d399', fontWeight: 700 }}>
              {((totalRedemptions / (totalTicketsSold || 1)) * 100).toFixed(1)}%
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '4px' }}>scanned today</span>
          </div>
          <span style={{ color: '#64748b' }}>•</span>
          <div>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
              {formatNum(totalRedemptions)}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '4px' }}>total redemptions</span>
          </div>
        </div>
        <div className="kpi-footer">
          <span>Jack Layton Gates: 8/8 Active</span>
          <span>Scans: {Math.round(ticketsRedeemedPerHour / 60)}/min</span>
        </div>
      </div>

      {/* KPI 3: Net Passenger Movement (Sales − Redemptions) */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <div>
            <span className="kpi-title">Net Passenger Movement</span>
            <div className="kpi-value" style={{ color: netHourlyMovement >= 0 ? '#38bdf8' : '#f59e0b' }}>
              {netHourlyMovement >= 0 ? `+${formatNum(netHourlyMovement)}` : formatNum(netHourlyMovement)}
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500, marginLeft: '6px' }}>/ hr</span>
            </div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
            <ArrowRightLeft size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e2e8f0', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: '#c084fc' }}>+{formatNum(netCumulativeMovement)}</span>
          <span style={{ color: '#94a3b8' }}>cumulative unredeemed buffer</span>
        </div>
        <div className="kpi-footer">
          <span>In-Park Island Net: {formatNum(islandCurrentVisitors)}</span>
          <span>Holding Pen: {formatNum(jackLaytonHoldingPen)}</span>
        </div>
      </div>

      {/* KPI 4: Peak Demand Windows */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <div>
            <span className="kpi-title">Peak Demand Windows</span>
            <div className="kpi-value" style={{ fontSize: '20px', letterSpacing: '-0.01em', color: '#f8fafc' }}>
              {peakWindow.label}
            </div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' }}>
            <Clock size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Surge: {peakWindow.surgeFactor} Baseline</span>
          <span>•</span>
          <span>{peakWindow.subtext}</span>
        </div>
        <div className="kpi-footer">
          <span>Return Peak Window: 16:30 – 19:45</span>
          <span>Headway: 15 min</span>
        </div>
      </div>

      {/* KPI 5: Off-Season Utilization Index */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <div>
            <span className="kpi-title">Off-Season Utilization Index</span>
            <div className="kpi-value" style={{ color: offSeasonIndex < 40 ? '#38bdf8' : '#34d399' }}>
              {offSeasonIndex}%
            </div>
          </div>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
            <Snowflake size={20} />
          </div>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
            <span>Year-Round Transit Efficiency</span>
            <span>{scenario.id === 'winter_commute' ? 'Winter Lifeline Active' : 'Summer High Season'}</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${offSeasonIndex}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06b6d4, #38bdf8)',
              borderRadius: '3px'
            }} />
          </div>
        </div>
        <div className="kpi-footer">
          <span>Ward's Commuter Base: 700 Res.</span>
          <span>MV Ongiara: Active</span>
        </div>
      </div>
    </div>
  );
}
