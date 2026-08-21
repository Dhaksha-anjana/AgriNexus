# AgriNexus
AGRI-NEXUS 3D is a next-generation, web-based cyber-physical agricultural dashboard designed to bridge the gap between physical Internet of Things (IoT) edge hardware and multi-agent artificial intelligence.
📌 Executive Summary
AGRI-NEXUS 3D is a next-generation, web-based cyber-physical agricultural dashboard designed to bridge the gap between physical Internet of Things (IoT) edge hardware and multi-agent artificial intelligence.

Featuring a futuristic, weightless 3D WebGL user interface inspired by antigravity architecture, AGRI-NEXUS 3D aggregates live environmental sensor feeds (Soil Moisture, Temperature, Humidity, Rain Probability, Light Intensity, Substrate pH) and coordinates eight specialized AI agents to optimize crop selection, irrigation schedules, pathogen risk control, and market arbitrage.

Unlike traditional "black-box" AI tools, AGRI-NEXUS 3D incorporates a Validator Agent for automated rule-conflict resolution and an Explainability Engine that displays explicit causal evidence checklists (
Confidence
=
94
%
Confidence=94%) alongside actionable farming directives.

🌟 Key Architecture & Highlights
1. 🌌 3D Neural Constellation (WebGL & GSAP)
The Planner Core: A central wireframe icosahedron sphere acting as the main brain, floating in zero-gravity with a glowing emerald nucleus.
6 Satellite Agent Discs: Specialized domain agents (Weather, Soil, Disease, Crop, Market, Irrigation) orbiting the core, linked by dynamic 3D laser vectors.
Camera-Facing Billboarding: Satellite discs automatically align with camera quaternions (node.mesh.quaternion.copy(camera.quaternion)) for consistent view-lens clarity.
Infinite Substrate Grid: An architectural terrain plane (
Y
=
−
3.5
Y=−3.5) with 
200
+
200+ neon cyan telemetry dust particles drifting vertically upward to visualize data streaming into the cloud.
2. 🛰️ Phase 1: ESP32 Edge IoT Sensor Telemetry
Live simulated and physical hardware sensor streaming via ESP32 Edge Microcontrollers:
Soil Moisture (Volumetric Water Content depth)
Ambient Temperature & Humidity (Evapotranspiration & VPD tracking)
Rain Sensor Array (3-day pre-precipitation forecasting)
Substrate pH (Soil acidity/alkalinity for nutrient availability)
Light Array (PAR Photosynthetic flux density)
3. 🤖 Hierarchical Multi-Agent Infrastructure (IoA)
Planner Core: Parses farmer queries and orchestrates sub-agent evaluation loops.
Domain Sub-Agents:
🌦️ Weather Agent: Projections & air column mapping.
🌱 Soil Agent: Substrate pH, N-P-K nutrient balance.
🦠 Disease Agent: Pathogen spore density & leaf blight risk.
🌾 Crop Agent: NDVI canopy vigour & phenology predictions.
💰 Market Agent: Regional futures & commodity spot price arbitrage (
₹
82
/
kg
₹82/kg).
💧 Irrigation Agent: Precision drip hydro-allocation.
4. ⚖️ Validator Agent & Conflict Resolution
Automatically resolves opposing agent directives (e.g. Weather Agent predicting rain in 3 days vs Irrigation Agent requesting watering today).
Evaluates dynamic Trust Scores (
T
T) to override lower-trust directives, preventing soil waterlogging, nutrient leaching, and resource waste.
5. 👁️ Explainable AI (XAI) & Causal Rationale Matrix
Eliminates opaque AI decisions by displaying an Explicit Causal Checklist:
✔ Soil Moisture 58% matches leguminous parameters.
✔ pH index 6.8 supports root germination.
✔ Rain expected; local watering halted by Validator.
✔ Commodity demand yields optimized pricing at ₹82/kg.
Provides clear, actionable directives for farmers ("Grow Groundnut", "Water only today", "No immediate fertilizers").
🛠️ Technology Stack
Layer	Technologies Used
3D Rendering & WebGL	Three.js, OrbitControls, Custom Shaders
Kinetic Motion & State Machine	GSAP (GreenSock Animation Platform)
UI Framework & Glassmorphism	HTML5, Tailwind CSS, Space Mono & Inter Fonts
Audio Engine	Web Audio API Sci-Fi Synthesizer
Edge Hardware / IoT Protocol	ESP32 Microcontrollers, Wi-Fi, WebSockets, REST API
AI Agent Logic	Rule Validation Engine, Security Trust Weighting (
T
T-Scores), XAI Matrix
🎯 Target Use Cases & Industry Value
Autonomous Smart Greenhouse & Field Operations: Real-time closed-loop sensing and automated drip irrigation regulation.
Agronomic ROI & Risk Optimization: Crop matching based on real-time market spot prices and soil chemistry.
Transparent Decision Support: Provides agricultural extension workers and farmers with verifiable, explainable reasoning instead of untrusted black-box outputs.
