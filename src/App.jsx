import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import KpiMetrics from './components/KpiMetrics';
import PassengerFlowIntelligence from './components/PassengerFlowIntelligence';
import HarbourRadar from './components/HarbourRadar';
import GateTurnstiles from './components/GateTurnstiles';
import PassengerExperiencePanel from './components/PassengerExperiencePanel';
import AnalyticsCharts from './components/AnalyticsCharts';
import LiveTelemetryStream from './components/LiveTelemetryStream';
import FleetDispatchModal from './components/FleetDispatchModal';
import EvacuationModal from './components/EvacuationModal';

import { createInitialSimulationState, tickSimulation } from './services/simulationEngine';
import { soundEffects } from './services/soundEffects';

export default function App() {
  const [simState, setSimState] = useState(() => createInitialSimulationState());
  const [soundMuted, setSoundMuted] = useState(true);
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);

  // Keep ref to latest state for interval tick
  const stateRef = useRef(simState);
  stateRef.current = simState;

  // Real-time telemetry simulation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setSimState(prev => {
        const next = tickSimulation(prev);

        // Sound triggers on new events
        if (!soundMuted) {
          if (next.recentRedemptionEvents.length > prev.recentRedemptionEvents.length) {
            const latest = next.recentRedemptionEvents[0];
            if (latest.status === 'SUCCESS') {
              soundEffects.playScanSuccess();
            } else {
              soundEffects.playScanReject();
            }
          }
          if (next.emergencyAlert && !prev.emergencyAlert) {
            soundEffects.playAlertSound();
          }
        }

        return next;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [soundMuted]);

  // Simulation controls
  const handleUpdateSpeed = (newSpeed) => {
    setSimState(prev => ({ ...prev, simSpeed: newSpeed }));
  };

  const handleSelectScenario = (newScenario) => {
    setSimState(prev => ({
      ...prev,
      scenario: newScenario,
      emergencyAlert: newScenario.id === 'storm_evacuation' ? {
        level: 'CRITICAL',
        title: 'Severe Weather Evacuation Protocol',
        message: 'High wind squall warning active. Ferry mainland sales suspended; prioritizing return boarding.',
        timestamp: new Date()
      } : null
    }));
  };

  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setSoundMuted(muted);
  };

  // Fleet controls
  const handleToggleStandby = (vesselId) => {
    setSimState(prev => ({
      ...prev,
      fleet: prev.fleet.map(v => {
        if (v.id === vesselId) {
          const newStandby = !v.isStandby;
          return {
            ...v,
            isStandby: newStandby,
            status: newStandby ? 'STANDBY AT PIER 6' : 'EN ROUTE TO CENTRE',
            speedKnots: newStandby ? 0 : 8.5,
            direction: 'island',
            progress: 0.1,
          };
        }
        return v;
      })
    }));
  };

  const handleReassignRoute = (vesselId, newRoute) => {
    setSimState(prev => ({
      ...prev,
      fleet: prev.fleet.map(v => v.id === vesselId ? { ...v, route: newRoute } : v)
    }));
  };

  const handleReassignGate = (gateId, newRoute) => {
    setSimState(prev => ({
      ...prev,
      gates: prev.gates.map(g => g.id === gateId ? { ...g, route: newRoute } : g)
    }));
  };

  // CSV Data Export
  const handleExportData = () => {
    const headers = ["Timestamp", "Tickets_Sold", "Turnstile_Redemptions", "Island_Returns", "Net_Passenger_Movement", "Revenue_CAD"];
    const rows = simState.hourlyHistory.map(h => [
      `2026-09-18 ${h.hour}`,
      h.sales,
      h.redemptions,
      h.returns,
      h.sales - h.redemptions,
      h.revenue
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `toronto_ferry_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* 1. Header & Operational Control Bar */}
      <Header
        simState={simState}
        onUpdateSpeed={handleUpdateSpeed}
        onSelectScenario={handleSelectScenario}
        onOpenFleetModal={() => setShowFleetModal(true)}
        onOpenEvacuationModal={() => setShowEvacuationModal(true)}
        onExportData={handleExportData}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* 2. Headline 5 KPIs (Requested by User) */}
      <KpiMetrics simState={simState} />

      {/* 3. Core 15-Minute Passenger Flow & Net Movement Intelligence (Directly solving the 3 problem statement pillars) */}
      <PassengerFlowIntelligence
        simState={simState}
        onDeployStandby={() => handleToggleStandby('trillium')}
      />

      {/* 4. Two-Column Operational Visualizer: Toronto Harbour Radar + Gate Turnstiles */}
      <div className="ops-grid">
        <HarbourRadar simState={simState} />
        <GateTurnstiles gates={simState.gates} onReassignGate={handleReassignGate} />
      </div>

      {/* 5. Passenger Experience & Peak Hour Terminal Operations */}
      <PassengerExperiencePanel simState={simState} />

      {/* 6. Analytical Deep Dives & Distribution Curves */}
      <AnalyticsCharts simState={simState} />

      {/* 7. Real-time Telemetry Stream (Turnstile Scans & Ticket Sales Feed) */}
      <LiveTelemetryStream
        recentSales={simState.recentSalesEvents}
        recentScans={simState.recentRedemptionEvents}
        anomaliesCount={simState.scannerAnomaliesCount}
      />

      {/* Modals */}
      {showFleetModal && (
        <FleetDispatchModal
          fleet={simState.fleet}
          onClose={() => setShowFleetModal(false)}
          onToggleStandby={handleToggleStandby}
          onReassignRoute={handleReassignRoute}
        />
      )}

      {showEvacuationModal && (
        <EvacuationModal
          onClose={() => setShowEvacuationModal(false)}
          onTriggerScenario={handleSelectScenario}
          currentScenario={simState.scenario}
        />
      )}
    </div>
  );
}
