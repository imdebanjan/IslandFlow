# Toronto Island Ferry Analytics & Operations (IslandFlow)

A data analytics and simulation project analyzing 10 years (2015–2025) of ferry ticket sales and turnstile redemption telemetry from the City of Toronto's Open Data portal.

The goal of this project was to understand passenger flow dynamics at the Jack Layton Ferry Terminal, identify bottleneck patterns during peak summer surges, and simulate real-time operations and fleet dispatching.

---

## What's in this Project

1. **Historical Data Analysis (`app.py`)**
   - Built with Python, Streamlit, Pandas, and Plotly.
   - Processes over 261,000 continuous 15-minute telemetry intervals recorded between May 2015 and December 2025.
   - Analyzes ticket pre-purchases vs. physical turnstile redemptions, hourly curves, seasonal variations (summer surges vs. winter commuter baselines), and peak day behaviors.

2. **Terminal Operations & Fleet Simulator (`src/`)**
   - A React-based interface modeling real-time operations at the terminal.
   - Simulates turnstile gate flows, passenger holding pen capacity limits (2,800 comfort ceiling vs. 3,500 safety max), vessel tracking across the harbour (Sam McBride, Ongiara, Trillium, Thomas Rennie), and emergency evacuation scenarios.

---

## Key Insights from the Data

- **The 82-Minute Pre-Purchase Lead Time**: Digital ticket sales consistently spike ~80–85 minutes before physical gate redemptions, providing an early warning signal for queue buildup at Queen's Quay.
- **Extreme Seasonality**: Peak summer days (e.g., Canada Day) see upwards of 25,000+ daily scans, while winter weekdays drop to under 1,000 scans/day (~18× seasonal swing).
- **Holding Pen Dynamics**: During peak hours, unchecked arrival rates can push terminal holding areas to capacity in under 30 minutes, highlighting the need for dynamic gate throttling.
- **Commuter vs. Visitor Patterns**: Winter redemptions consistently exceed sales, reflecting permanent Ward's/Algonquin Island residents using pre-issued transit passes.

---

## Tech Stack

- **Data & Analytics**: Python, Pandas, NumPy, Plotly, Streamlit
- **Frontend / Simulation**: React 19, Vite, Lucide Icons
- **Dataset**: City of Toronto Open Data — *Toronto Island Ferry Ticket Counts* (261,538 rows)

---

## Running Locally

### Python Analytics Dashboard
```bash
pip install -r requirements.txt
streamlit run app.py
```

### React Simulation Interface
```bash
npm install
npm run dev
```

---

## Repository Structure

- `app.py` - Main Streamlit analytics application
- `Toronto Island Ferry Tickets.csv` - 10-year official interval dataset
- `src/` - React simulator source code (components, simulation engine, radar view)
- `executive_summary.md` - Policy and operational summary report
- `research_paper.md` - Comprehensive technical and statistical analysis report
