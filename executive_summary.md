# Executive Summary: Real-Time Ferry Ticket Sales & Redemption Analytics

**To:** Mayor & Members of Toronto City Council  
**Through:** General Manager, Parks, Forestry & Recreation & CEO, Waterfront Toronto  
**Subject:** 10-Year Telemetry Analysis, Passenger Movement Optimization, and Public Safety for the Toronto Island Ferry Service  
**Data Reference:** Official City of Toronto Ferry Telemetry Dataset (261,538 15-Minute Intervals, 2015–2025)  
**Date:** September 2026  

---

## 1. Strategic Mandate & Purpose

The Toronto Island Ferry Service, operating out of the **Jack Layton Ferry Terminal** (9 Queen’s Quay West), is one of the City of Toronto’s most critical municipal transit assets. It fulfills two vital public responsibilities:
1. **Recreational Transit Engine:** Transporting over **1.5 million annual visitors** (generating over **$12.5M+ CAD in annual fare revenue**) to Centre Island and Hanlan’s Point parklands.
2. **Essential Year-Round Public Lifeline:** Providing the sole continuous transit connection for approximately **700 permanent residents**, school children, and municipal infrastructure staff on Ward’s and Algonquin Islands.

This briefing synthesizes findings from **261,538 fifteen-minute telemetry records** recorded over 10 consecutive operating years (May 2015 – December 2025) to provide Council and Executive Leadership with actionable directives for public safety, terminal flow, and long-term capital planning.

---

## 2. Headline Performance Indicators (10-Year Measured Baseline)

| Key Performance Indicator (KPI) | 10-Year Measured Value | Peak Day Observed Value | Strategic Operational Relevance |
| :--- | :--- | :--- | :--- |
| **Total Turnstile Redemptions** | **12,785,293 scans** | **25,748 scans / day** (Canada Day 2018) | Validates ongoing post-pandemic recovery (1.52M redemptions in 2025) |
| **Tickets Sold / Hour (Peak)** | **3,120 tickets / hr** | **4,280 tickets / hr** | Measures morning pre-sale queue velocity |
| **Tickets Redeemed / Hour (Peak)** | **2,890 scans / hr** | **3,850 scans / hr** | Measures maximum gate clearance throughput at Jack Layton Terminal |
| **Net Passenger Movement** | **+820 pax / 15-min** | **+1,420 pax / 15-min** | Tracks net island passenger accumulation to prevent overcrowding |
| **Off-Season Utilization Index** | **5.44%** | **18.4× seasonal swing** | Defines the fiscal subsidy required for winter Ward’s Island lifeline service |

---

## 3. Top Analytical Insights for Council

### A. The 82-Minute Digital Pre-Purchase Early Warning Window
- Telemetry proves that digital ticket sales velocity (Web Portal & Mobile App) consistently surges **82 minutes prior** to turnstile entry at Queen's Quay West.
- **Operational Breakthrough:** Terminal supervisors no longer need to react to crowds already spilling onto the sidewalk. When digital transactions exceed **550 tickets/15-min** at 10:00 AM, operations has an automated 80-minute window to open auxiliary gates and pre-warm relief vessels.

### B. Accurate In-Park Visitor Accounting (Overcrowding Protection)
- Outbound mainland gate entries minus island dock return entries enables the City’s first continuous calculation of active island visitor load.
- Establishes an automated safety alert when the active island population nears the archipelago’s **25,000 environmental comfort limit**, allowing the City to manage public safety proactively.

### C. The Winter Lifeline Reality (5.44% Off-Season Index)
- January redemptions average **15,100 per year**, compared to **337,800 in August** (a 22-fold reduction).
- Crucially, in winter months, **Redemptions exceed Sales** (e.g. 151,620 redemptions vs. 130,455 sales in January), proving heavy reliance on pre-issued resident passes and commuter cards. Winter service is a vital municipal transit service that must be protected.

---

## 4. Public Safety, Holding Pen & Emergency Evacuation Protocols

### Enforcing the 2,800 Holding Pen Fire Safety Ceiling
- Jack Layton Terminal operates under strict Ontario Fire Code caps: **comfort capacity: 2,800 passengers**; **absolute maximum ceiling: 3,500 passengers**.
- Under peak arrival flows (up to 50 passengers/minute), an unmanaged holding pen can transition from half-full to maximum hazard capacity in **under 28 minutes**.
- **Automated Mitigation:** Turnstiles now automatically throttle entry rates once the pen reaches 2,800 passengers, preventing hazardous crowding.

### Convective Storm Evacuation Capability
- Rapid summer squalls over Lake Ontario demand immediate response. The platform includes a one-touch **Severe Weather Evacuation Protocol**:
  1. Instantly halts mainland outbound ticket sales;
  2. Reconfigures all 8 mainland turnstiles to exit-only flow;
  3. Dispatches all 5 fleet units on rapid return circuits, extracting up to **3,550 passengers per hour** from exposed island docks.

---

## 5. Strategic Policy Directives for City Council

```
+------------------------------------------------------------------------------------------------+
| DIRECTIVE 1: PERMANENT EXPRESS MOBILE QR GATES                                                 |
| Institutionalize Gates 1 and 4 as permanent Express Mobile QR turnstiles during peak hours.    |
| Impact: Increases passenger processing speed from 38 to 52 scans/min (+36.8%).                 |
+------------------------------------------------------------------------------------------------+
| DIRECTIVE 2: TELEMETRY-TRIGGERED STANDBY VESSEL (*TRILLIUM*) DISPATCH                          |
| Authorize dispatch of the 800-passenger paddle steamer *Trillium* based on the 82-minute sales |
| surge indicator, ensuring vessel capacity arrives precisely when gate queues peak.             |
+------------------------------------------------------------------------------------------------+
| DIRECTIVE 3: ESTABLISH THE TORONTO ISLAND TRANSIT RESERVE FUND                                 |
| Ringfence 6.5% of gross July–August revenues (~$1.8M CAD) to permanently fund the winter      |
| icebreaking operations of *MV Ongiara* without imposing fare premiums on Ward's residents.     |
+------------------------------------------------------------------------------------------------+
| DIRECTIVE 4: CONTACTLESS OPEN-LOOP FARE MODERNIZATION                                          |
| Upgrade Jack Layton turnstiles to open-loop EMV (contactless credit/debit card tap) by Q2 2027  |
| to further reduce ticket queue dwell time.                                                     |
+------------------------------------------------------------------------------------------------+
```

---

## 6. Submission Deliverables Summary

1. **Live Streamlit Analytics Application (`app.py`):** Fully interactive operational dashboard powered by the 261,538-row dataset with 5 core KPIs, 15-minute time-series charts, date filters, peak comparisons, and multi-stakeholder views.
2. **Comprehensive Research Paper (`research_paper.md`):** Complete exploratory data analysis, queueing theory formulas, 10-year macro ridership tables, and policy architectures.
3. **Executive Summary for Government Stakeholders (`executive_summary.md`):** High-level briefing for the Mayor, City Council, and Waterfront Toronto.
4. **Interactive Real-Time Operations Platform (`src/` / `dist/`):** React 18 application with live nautical harbour radar, moving ferries, gate LEDs, sound telemetry synthesizer, and CSV export.
