# 🚢 IslandFlow | Toronto Island Ferry Analytics & Operations Platform

[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.38+-FF4B4B?logo=streamlit&logoColor=white)](https://streamlit.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

**IslandFlow** is an enterprise-grade dual telemetry and operations platform for the **Toronto Island Ferry Service**, combining over 10 years of historical ridership records (2015–2025) with a live, simulated harbour command center.

---

## 🌟 Key Architectures

IslandFlow provides two complementary subsystems:

### 1. 🛰️ Live Real-Time Operations Command Center (`src/`)
Built with **React 19**, **Vite**, and **Tailored Glassmorphic UI**:
- **Harbour Radar & Fleet Tracking**: Real-time vector positioning of ferry vessels (Sam McBride, Ongiara, Trillium, Thomas Rennie).
- **Gate Turnstile Live Redemptions**: Real-time barcode scan telemetry, gate flow balance, and peak queue detection.
- **Dynamic Operations Simulator**: Configurable stress tests including *Canada Day Surge*, *Severe Weather Fog*, and *Harbour Evacuation Protocol*.
- **Live Sound Telemetry**: Audio feedback for successful gate redemptions, rejections, and priority dispatch alarms.

### 2. 📊 Historical Intelligence & Capacity Analytics (`app.py`)
Built with **Python**, **Streamlit**, and **Plotly**:
- **10-Year Dataset Analysis**: Over 261,500 continuous 15-minute interval observations from City of Toronto Open Data.
- **Turnstile vs. Online Sales Reconciliation**: Deep dive into ticket pre-purchases vs. physical turnstile redemptions.
- **Seasonal & Diurnal Profiles**: Automated peak detection across summer surges, holiday weekends, and winter commuter baselines.
- **Interactive Filtering**: Filter by year range, season, day of the week, and peak operational hours.

---

## 🚀 Quick Start (Local Development)

### React Real-Time Dashboard

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Python Streamlit Analytics Dashboard

```bash
# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Launch Streamlit app
streamlit run app.py
```

---

## 🐳 Docker Deployment

The application includes a production-ready `Dockerfile` for containerized hosting:

```bash
# Build the container
docker build -t islandflow-analytics .

# Run on port 8501
docker run -d -p 8501:8501 --name islandflow islandflow-analytics
```

---

## ☁️ Cloud Deployment Options

### Streamlit Community Cloud (Analytics App)
1. Sign in to [share.streamlit.io](https://share.streamlit.io/) with your GitHub account.
2. Select repository: `imdebanjan/IslandFlow`.
3. Set main file path: `app.py`.
4. Click **Deploy**!

### Vercel / Netlify (React Dashboard)
1. Import repository `imdebanjan/IslandFlow` into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Click **Deploy**!

---

## 📂 Project Structure

```
IslandFlow/
├── src/                        # React real-time telemetry frontend
│   ├── components/             # Radar, Turnstiles, KPIs, Fleet Dispatch
│   ├── services/               # Simulation engine & sound effects
│   └── App.jsx                 # Main operations interface
├── app.py                      # Streamlit 10-year historical analytics engine
├── Toronto Island Ferry Tickets.csv # Official City of Toronto telemetry dataset
├── Dockerfile                  # Production container definition
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies & scripts
└── vite.config.js              # Vite configuration
```

---

## 📄 License & Attribution
- Data Source: [City of Toronto Open Data Portal](https://open.toronto.ca/)
- Developed for Toronto Island Ferry Transit Analytics & Real-Time Operations.
