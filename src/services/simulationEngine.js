import { TICKET_TYPES, CHANNELS, ROUTES, MAINLAND_TERMINAL, INITIAL_FLEET, INITIAL_GATES, OPERATIONAL_SCENARIOS } from '../types/ferryConstants';

export function createInitialSimulationState() {
  // Generate realistic historical hourly data from 07:00 to current time (14:00)
  const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const hourlyData = [
    { hour: '07:00', sales: 420, redemptions: 110, returns: 15, revenue: 3410 },
    { hour: '08:00', sales: 780, redemptions: 340, returns: 40, revenue: 6380 },
    { hour: '09:00', sales: 1450, redemptions: 890, returns: 90, revenue: 11920 },
    { hour: '10:00', sales: 2350, redemptions: 1720, returns: 180, revenue: 19410 },
    { hour: '11:00', sales: 3100, redemptions: 2680, returns: 320, revenue: 25680 },
    { hour: '12:00', sales: 3420, redemptions: 3180, returns: 580, revenue: 28240 },
    { hour: '13:00', sales: 2980, redemptions: 2890, returns: 920, revenue: 24650 },
    { hour: '14:00', sales: 2650, redemptions: 2510, returns: 1340, revenue: 21950 },
  ];

  const totalSalesTickets = hourlyData.reduce((acc, h) => acc + h.sales, 0);
  const totalRevenue = hourlyData.reduce((acc, h) => acc + h.revenue, 0);
  const totalRedemptions = hourlyData.reduce((acc, h) => acc + h.redemptions, 0);
  const totalReturns = hourlyData.reduce((acc, h) => acc + h.returns, 0);

  // In-park visitors = Outbound mainland scanned - Return island scanned
  const islandCurrentVisitors = totalRedemptions - totalReturns;

  return {
    scenario: OPERATIONAL_SCENARIOS.NORMAL,
    simSpeed: 1, // 0 = paused, 1 = 1x, 5 = 5x, 15 = 15x
    simTime: new Date(2026, 8, 18, 14, 25, 0),
    totalRevenueCAD: totalRevenue,
    totalTicketsSold: totalSalesTickets,
    totalRedemptions: totalRedemptions,
    totalIslandReturns: totalReturns,
    islandCurrentVisitors: islandCurrentVisitors,
    jackLaytonHoldingPen: 480, // waiting in pen behind gates
    maxHoldingPen: MAINLAND_TERMINAL.holdingPenMaxCapacity,
    emergencyAlert: null,
    
    // Detailed distribution buckets
    ticketTypeSales: {
      adult: Math.round(totalSalesTickets * 0.58),
      senior: Math.round(totalSalesTickets * 0.12),
      youth: Math.round(totalSalesTickets * 0.14),
      child: Math.round(totalSalesTickets * 0.13),
      infant: Math.round(totalSalesTickets * 0.03),
      commuter: 350,
    },
    channelSales: {
      online: Math.round(totalSalesTickets * 0.52),
      app: Math.round(totalSalesTickets * 0.26),
      kiosk: Math.round(totalSalesTickets * 0.16),
      booth: Math.round(totalSalesTickets * 0.06),
    },
    routeDemands: {
      centre: { sold: Math.round(totalSalesTickets * 0.62), redeemed: Math.round(totalRedemptions * 0.62), currentOnIsland: Math.round(islandCurrentVisitors * 0.64) },
      hanlan: { sold: Math.round(totalSalesTickets * 0.25), redeemed: Math.round(totalRedemptions * 0.24), currentOnIsland: Math.round(islandCurrentVisitors * 0.24) },
      ward: { sold: Math.round(totalSalesTickets * 0.13), redeemed: Math.round(totalRedemptions * 0.14), currentOnIsland: Math.round(islandCurrentVisitors * 0.12) },
    },

    fleet: INITIAL_FLEET.map(v => ({ ...v })),
    gates: INITIAL_GATES.map(g => ({ ...g, recentScans: 0, lastEvent: null })),
    
    hourlyHistory: hourlyData,
    recentSalesEvents: [],
    recentRedemptionEvents: [],
    scannerAnomaliesCount: 14,
  };
}

let ticketCounter = 84920;
let transactionCounter = 34100;

export function generateRandomSalesEvent(scenario) {
  ticketCounter += 1;
  transactionCounter += 1;

  // Channels probability
  const channels = ['online', 'app', 'kiosk', 'booth'];
  const channelWeights = [0.52, 0.26, 0.16, 0.06];
  const randC = Math.random();
  let channel = 'online';
  let accumC = 0;
  for (let i = 0; i < channels.length; i++) {
    accumC += channelWeights[i];
    if (randC <= accumC) {
      channel = channels[i];
      break;
    }
  }

  // Items in transaction (1 to 4 tickets typically)
  const count = Math.floor(Math.random() * 3) + 1;
  const items = [];
  let totalOrder = 0;

  // Routes
  const rKeys = ['centre', 'hanlan', 'ward'];
  const weights = scenario.routeWeights;
  const rRand = Math.random();
  let routeKey = 'centre';
  if (rRand < weights.centre) {
    routeKey = 'centre';
  } else if (rRand < weights.centre + weights.hanlan) {
    routeKey = 'hanlan';
  } else {
    routeKey = 'ward';
  }

  for (let i = 0; i < count; i++) {
    const tRand = Math.random();
    let typeKey = 'adult';
    if (tRand < 0.60) typeKey = 'adult';
    else if (tRand < 0.75) typeKey = 'child';
    else if (tRand < 0.87) typeKey = 'youth';
    else if (tRand < 0.96) typeKey = 'senior';
    else typeKey = 'infant';

    const tDef = Object.values(TICKET_TYPES).find(t => t.id === typeKey) || TICKET_TYPES.ADULT;
    items.push({
      ticketId: `TO-FRY-${ticketCounter}-${i}`,
      type: typeKey,
      price: tDef.price,
    });
    totalOrder += tDef.price;
  }

  return {
    orderId: `ORD-${transactionCounter}`,
    channel,
    route: routeKey,
    timestamp: new Date(),
    itemsCount: items.length,
    items,
    totalCAD: Number(totalOrder.toFixed(2)),
  };
}

export function generateTurnstileScanEvent(gates, scenario) {
  // Pick an active gate based on traffic
  const activeGates = gates.filter(g => g.status === 'active');
  if (activeGates.length === 0) return null;

  const gateIndex = Math.floor(Math.random() * activeGates.length);
  const gate = activeGates[gateIndex];

  const types = ['adult', 'adult', 'child', 'youth', 'senior', 'commuter'];
  const pType = types[Math.floor(Math.random() * types.length)];

  // Anomaly check (duplicate scan, invalid barcode, or gate misdirection)
  const isAnomaly = Math.random() < 0.025; // 2.5% chance of scan incident
  let status = 'SUCCESS';
  let message = 'Validated - Turnstile Unlocked';

  if (isAnomaly) {
    const aType = Math.random();
    if (aType < 0.5) {
      status = 'DUPLICATE_SCAN';
      message = 'Alert: Barcode already redeemed at 14:18:22';
    } else if (aType < 0.8) {
      status = 'PASS_EXPIRED';
      message = 'Alert: Ticket expired or prior date stamp';
    } else {
      status = 'WRONG_GATE_ROUTE';
      message = `Notice: Ticket destination mismatch (Routed to ${gate.route.toUpperCase()})`;
    }
  }

  const barcode = `CAD-TIF-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    scanId: `SCN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 99)}`,
    gateId: gate.id,
    gateName: gate.name,
    route: gate.route === 'all' ? 'centre' : gate.route,
    ticketType: pType,
    barcode,
    status,
    message,
    latencyMs: Math.floor(120 + Math.random() * 110),
    timestamp: new Date(),
  };
}

export function tickSimulation(state) {
  if (state.simSpeed === 0) return state;

  const speed = state.simSpeed;
  const scenario = state.scenario;

  // Advance clock: each real second represents (simSpeed * 2) seconds
  const newSimTime = new Date(state.simTime.getTime() + speed * 2000);

  // 1. Generate Ticket Sales
  const salesChance = 0.45 * scenario.salesMultiplier * (speed >= 5 ? 2.0 : 1.0);
  let newRevenue = state.totalRevenueCAD;
  let newTicketsSold = state.totalTicketsSold;
  const newRecentSales = [...state.recentSalesEvents];
  const newTypeSales = { ...state.ticketTypeSales };
  const newChannelSales = { ...state.channelSales };
  const newRouteDemands = {
    centre: { ...state.routeDemands.centre },
    hanlan: { ...state.routeDemands.hanlan },
    ward: { ...state.routeDemands.ward },
  };

  const salesEventsToGenerate = Math.floor(salesChance) + (Math.random() < (salesChance % 1) ? 1 : 0);
  for (let s = 0; s < salesEventsToGenerate; s++) {
    const sale = generateRandomSalesEvent(scenario);
    newRevenue += sale.totalCAD;
    newTicketsSold += sale.itemsCount;
    newRecentSales.unshift(sale);

    sale.items.forEach(it => {
      newTypeSales[it.type] = (newTypeSales[it.type] || 0) + 1;
    });
    newChannelSales[sale.channel] = (newChannelSales[sale.channel] || 0) + sale.itemsCount;
    newRouteDemands[sale.route].sold += sale.itemsCount;
  }
  if (newRecentSales.length > 30) newRecentSales.splice(30);

  // 2. Generate Turnstile Scans at Jack Layton Terminal
  // Holding pen cap check: if holding pen is full (> 3200), turnstiles automatically slow down
  const penCongestionFactor = state.jackLaytonHoldingPen > 2800 ? 0.4 : 1.0;
  const scanChance = 0.50 * scenario.redemptionMultiplier * penCongestionFactor * (speed >= 5 ? 2.0 : 1.0);
  let newRedemptions = state.totalRedemptions;
  let newHoldingPen = state.jackLaytonHoldingPen;
  let newAnomalies = state.scannerAnomaliesCount;
  const newRecentRedemptions = [...state.recentRedemptionEvents];
  const updatedGates = state.gates.map(g => ({ ...g }));

  const scansToGenerate = Math.floor(scanChance) + (Math.random() < (scanChance % 1) ? 1 : 0);
  for (let sc = 0; sc < scansToGenerate; sc++) {
    const scan = generateTurnstileScanEvent(updatedGates, scenario);
    if (scan) {
      newRecentRedemptions.unshift(scan);
      const targetGate = updatedGates.find(g => g.id === scan.gateId);
      if (targetGate) {
        targetGate.lastEvent = scan;
      }

      if (scan.status === 'SUCCESS') {
        newRedemptions += 1;
        newHoldingPen += 1; // enters holding pen waiting for boat
        newRouteDemands[scan.route].redeemed += 1;
      } else {
        newAnomalies += 1;
      }
    }
  }
  if (newRecentRedemptions.length > 30) newRecentRedemptions.splice(30);

  // Island return scans (passengers heading back to mainland)
  // Higher returns in late afternoon or during storm evacuation!
  const returnChance = (scenario.id === 'storm_evacuation' ? 2.5 : 0.28) * (speed >= 5 ? 2.0 : 1.0);
  let newIslandReturns = state.totalIslandReturns;
  const returnBatches = Math.floor(returnChance) + (Math.random() < (returnChance % 1) ? 1 : 0);
  for (let r = 0; r < returnBatches; r++) {
    const batchSize = Math.floor(Math.random() * 4) + 1;
    newIslandReturns += batchSize;
  }

  // 3. Update Ferry Fleet Movement & Passenger Boarding/Debarking
  let totalBoardedFromHoldingPen = 0;
  const updatedFleet = state.fleet.map(vessel => {
    if (vessel.isStandby) return vessel;

    const route = ROUTES[vessel.route.toUpperCase()] || ROUTES.CENTRE;
    // Base speed step
    const step = (0.012 * (vessel.speedKnots / 10) * speed);

    let progress = vessel.progress;
    let direction = vessel.direction;
    let status = vessel.status;
    let passengersOnboard = vessel.passengersOnboard;

    if (direction === 'island') {
      progress += step;
      if (progress >= 1.0) {
        // Reached Island dock
        progress = 1.0;
        status = 'DISEMBARKING';
        // Passengers disembark onto island
        passengersOnboard = Math.max(0, passengersOnboard - Math.floor(180 * speed));
        if (passengersOnboard === 0) {
          // Board return passengers from island
          const returningWaiting = Math.min(vessel.capacity * 0.75, Math.floor(Math.random() * 400 + 100));
          passengersOnboard = Math.floor(returningWaiting);
          direction = 'mainland';
          status = 'EN ROUTE TO MAINLAND';
        }
      } else {
        status = 'EN ROUTE TO ISLAND';
      }
    } else {
      // Mainland bound
      progress -= step;
      if (progress <= 0.0) {
        // Reached Jack Layton Ferry Terminal
        progress = 0.0;
        status = 'DOCKING';
        // Disembark return passengers
        passengersOnboard = Math.max(0, passengersOnboard - Math.floor(180 * speed));
        if (passengersOnboard === 0) {
          // Board waiting queue from Jack Layton holding pen!
          const availableToBoard = Math.min(newHoldingPen, vessel.capacity - 50);
          if (availableToBoard > 0) {
            passengersOnboard = availableToBoard;
            newHoldingPen -= availableToBoard;
            totalBoardedFromHoldingPen += availableToBoard;
          }
          direction = 'island';
          status = 'BOARDING MAINLAND';
        }
      } else {
        status = 'EN ROUTE TO MAINLAND';
      }
    }

    return {
      ...vessel,
      progress,
      direction,
      status,
      passengersOnboard,
    };
  });

  // Calculate current in-park island population
  const netIslandVisitors = Math.max(0, newRedemptions - newIslandReturns);

  // Update route stats for island populations
  newRouteDemands.centre.currentOnIsland = Math.round(netIslandVisitors * (scenario.routeWeights.centre || 0.6));
  newRouteDemands.hanlan.currentOnIsland = Math.round(netIslandVisitors * (scenario.routeWeights.hanlan || 0.25));
  newRouteDemands.ward.currentOnIsland = Math.round(netIslandVisitors * (scenario.routeWeights.ward || 0.15));

  // Hourly data updates: append or update current hour
  const currentHourString = `${newSimTime.getHours().toString().padStart(2, '0')}:00`;
  const updatedHourly = [...state.hourlyHistory];
  const lastH = updatedHourly[updatedHourly.length - 1];
  if (lastH && lastH.hour === currentHourString) {
    lastH.sales += salesEventsToGenerate;
    lastH.redemptions += scansToGenerate;
    lastH.returns += returnBatches;
    lastH.revenue = Number(newRevenue.toFixed(0));
  }

  // Check safety conditions
  let emergencyAlert = state.emergencyAlert;
  if (newHoldingPen >= MAINLAND_TERMINAL.emergencyThreshold && !emergencyAlert) {
    emergencyAlert = {
      level: 'WARNING',
      title: 'Holding Pen Capacity Advisory',
      message: `Jack Layton Terminal queue has exceeded ${newHoldingPen} passengers. Turnstiles auto-metering. Suggest dispatching MV Trillium or increasing vessel turnaround speed.`,
      timestamp: newSimTime,
    };
  } else if (scenario.id === 'storm_evacuation') {
    emergencyAlert = {
      level: 'CRITICAL',
      title: 'Public Safety Priority: Severe Weather Evacuation',
      message: 'Environment Canada marine wind warning in effect. Outbound sales suspended. All fleet units assigned to rapid island dock pickups.',
      timestamp: newSimTime,
    };
  } else if (newHoldingPen < 1800 && emergencyAlert && emergencyAlert.level === 'WARNING') {
    emergencyAlert = null; // cleared
  }

  return {
    ...state,
    simTime: newSimTime,
    totalRevenueCAD: Number(newRevenue.toFixed(2)),
    totalTicketsSold: newTicketsSold,
    totalRedemptions: newRedemptions,
    totalIslandReturns: newIslandReturns,
    islandCurrentVisitors: netIslandVisitors,
    jackLaytonHoldingPen: Math.max(40, newHoldingPen),
    ticketTypeSales: newTypeSales,
    channelSales: newChannelSales,
    routeDemands: newRouteDemands,
    fleet: updatedFleet,
    gates: updatedGates,
    hourlyHistory: updatedHourly,
    recentSalesEvents: newRecentSales,
    recentRedemptionEvents: newRecentRedemptions,
    scannerAnomaliesCount: newAnomalies,
    emergencyAlert,
  };
}
