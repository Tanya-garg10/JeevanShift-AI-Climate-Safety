# JeevanShift — AI-Powered Climate Safety & Livelihood Protection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> **Tagline:** Shift the Hours. Protect the Livelihood.

JeevanShift is an intelligent climate resilience and livelihood protection platform built for outdoor workers (street vendors, delivery riders, daily wage construction workers, and logistics laborers) facing extreme heatwaves across Indian urban centers.

Instead of issuing blanket stay-at-home advisories that force informal workers into zero-income days, JeevanShift combines live meteorological heat-index modeling with worker exposure context to generate safer split-shift schedules, locate nearby cooling and hydration infrastructure, provide immediate emergency assistance, and calculate protected income recovery.

---

## 🌟 Core Modules & Architecture

1. **Overview / Landing Page**
   - High-impact mission framing, value proposition, and the 4-step resilience loop: *Check Conditions → Plan Your Shift → Find Support → Stay Safer & Earn*.
   - Includes real climate resilience documentary visuals and clean, production-grade navigation.

2. **Today's Heat Risk Dashboard**
   - Live meteorological feed via **Open-Meteo API** (ambient temperature, apparent heat index / "feels like", relative humidity, UV index, wind speed).
   - Real-time GPS location detection from browser geolocation (`navigator.geolocation`) with automatic coordinate resolution and weather updates.
   - Transparent, explainable prototype risk assessment (Low, Moderate, High, Extreme) accounting for apparent temperature, evaporative resistance, occupational metabolic load, and daily sun exposure hours.
   - Actionable on-field precautions and interactive 24-hour heat wave timeline chart (via **Recharts**).
   - Resilient, calibrated demo fallback when offline.

3. **SmartShift Work Planner (Core Differentiator)**
   - Deterministic rule engine calculating lower-risk morning and evening work windows while avoiding dangerous midday solar radiation (12:00 PM – 4:00 PM).
   - 24-hour visual heat timeline with green, amber, and red blocks.
   - Tailored hydration schedule (milliliters and timing) and mandatory rest break intervals.

4. **JeevanPoints — Nearby Support Network**
   - Interactive **Leaflet OpenStreetMap** integration with categorized pins for Drinking Water (💧), Shaded Rest (🌳), Air-Cooled Centers (❄️), Health Clinics (🏥), and Public Restrooms (🚻).
   - Dynamic distance calculation relative to the worker's operating coordinates.
   - Search by locality, get directions in Google Maps, and submit "Report Outdated Info" feedback.
   - Explicit labeling of verified partner facilities vs calibrated demo sample locations.

5. **HeatSOS — Emergency Assistance**
   - Clear distinction between early Heat Exhaustion and life-threatening Heat Stroke.
   - One-tap direct **112 National Emergency Helpline** call trigger with clear on-site protocol.
   - One-click Emergency SMS & WhatsApp message dispatcher pre-populated with worker location and GPS coordinates.
   - Rapid evaporative cooling first-aid guidance based on public health protocols.

6. **EarnSafe — Livelihood Protection Planner**
   - Interactive income simulator comparing expected full-shift earnings, unmitigated midday loss, and cool-hour recovery.
   - Visual bar chart comparison showing net protected earnings.
   - 4 practical income defense pathways: Split-shift timing, platform heat allowances, municipal/state heat action welfare (e.g. PM-SVANidhi), and community water kiosks.

7. **Employer & Community Coordinator Portal**
   - Fleet-wide vulnerability overview, sector exposure table, and heatwave broadcast alert trigger.
   - Complete CRUD management: coordinators can add, edit, and delete community support points with persistent local storage.

8. **Bilingual Support (English & हिन्दी)**
   - Complete localization across all navigation, guidance, clinical terms, and forms, stored in `localStorage`.

---

## 🚀 Quick Local Setup Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with custom warm ivory / forest green palette
- **Icons:** Lucide React
- **Data Visualization:** Recharts (AreaChart, BarChart)
- **Mapping:** Leaflet + OpenStreetMap tiles
- **Weather Integration:** Open-Meteo REST API (free, zero API key required, reliable worldwide coverage)
- **State & Storage:** LocalStorage for profile, language, and support points persistence

---

## 🧭 Suggested 2–3 Minute Jury Demo Flow

1. **Landing Page:** Open the home page, inspect the vision, and click **"Check Today's Heat Risk"**.
2. **HeatRisk Dashboard:** Switch between city presets (e.g., Delhi NCR, Ahmedabad, Jaipur) to observe live temperatures, apparent heat index (feels like 44°C+), and the 24-hour heat wave chart.
3. **SmartShift Planner:** Adjust available hours or target duration, click **"Generate My Work Plan"**, and inspect the visual 24-hour timeline avoiding the midday danger zone.
4. **EarnSafe Planner:** Slide expected earnings and adjusted hours to demonstrate how shifting 3 hours to the evening recovers over 85% of potential lost income.
5. **JeevanPoints:** Filter by Drinking Water (💧) or Air-Cooled Centers (❄️), click on a marker on the Leaflet map to inspect operating hours, and test "Report Outdated Info".
6. **HeatSOS:** Review the Heat Stroke vs Heat Exhaustion comparison and inspect the one-click WhatsApp/SMS emergency dispatch template.
7. **Coordinator Portal:** Switch to the coordinator view to see the aggregated fleet matrix and use the **"Add New Support Point"** modal.
8. **Toggle Language:** Click the **"हिन्दी"** button in the top navigation to experience full vernacular translation.

---

## ✨ Key Features

- **Real-time Heat Risk Assessment**: Live meteorological data integration with Open-Meteo API for accurate heat index calculations
- **Smart Shift Planning**: AI-powered schedule optimization to avoid dangerous midday heat exposure
- **Interactive Support Maps**: Find nearby cooling centers, water stations, and medical facilities using Leaflet maps
- **Emergency SOS System**: One-tap emergency calls and pre-formatted emergency messages with GPS coordinates
- **Income Protection Calculator**: Quantify and recover potential income loss due to heat-related work restrictions
- **Bilingual Interface**: Complete English and Hindi language support
- **Employer Dashboard**: Fleet management and community support point coordination
- **Offline Fallback**: Resilient demo mode when network connectivity is unavailable

---

## 📸 Screenshots

*(Add screenshots of the application here)*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions, feedback, or collaboration opportunities, please reach out through the repository issues or contact the maintainers.

---

## 🙏 Acknowledgments

- Open-Meteo API for weather data
- Leaflet and OpenStreetMap for mapping services
- React and Vite communities for excellent tooling
- All contributors who help make JeevanShift better
