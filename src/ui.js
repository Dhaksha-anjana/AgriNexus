import { dataEngine } from './agents.js';
import { sound } from './sound.js';

export class AntigravityUI {
  constructor(sceneInstance) {
    this.scene = sceneInstance;
    this.isPipelineRunning = false;

    this.bindEvents();
    this.startIoTUpdates();
    this.renderTrustMatrix();
    this.startFPSCounter();
  }

  bindEvents() {
    // 1. Audio Toggle
    const btnAudio = document.getElementById('btn-audio-toggle');
    const iconOn = document.getElementById('icon-sound-on');
    const iconOff = document.getElementById('icon-sound-off');

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const enabled = sound.toggleSound();
        if (enabled) {
          iconOn.classList.remove('hidden');
          iconOff.classList.add('hidden');
          sound.playSelect('#00ff66');
        } else {
          iconOn.classList.add('hidden');
          iconOff.classList.remove('hidden');
        }
      });
    }

    // 2. Reset Orbit View Button
    const btnReset = document.getElementById('btn-reset-view');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        sound.playSelect('#00ff66');
        this.scene.resetConstellationLayout();
        this.closeTrustDrawer();
        this.appendLog('[SYSTEM] Orbit layout reset to orbital equilibrium.', 'active');
      });
    }

    // 3. Open/Close Agent Trust Matrix Drawer
    const btnTrust = document.getElementById('btn-open-trust-matrix');
    if (btnTrust) {
      btnTrust.addEventListener('click', () => {
        sound.playSelect('#A855F7');
        this.openTrustDrawer();
      });
    }

    const btnCloseTrust = document.getElementById('btn-close-trust-drawer');
    if (btnCloseTrust) {
      btnCloseTrust.addEventListener('click', () => {
        this.closeTrustDrawer();
      });
    }

    // 4. ASK PLANNER ENGINE Button
    const queryBtn = document.getElementById('query-btn');
    if (queryBtn) {
      queryBtn.addEventListener('click', () => {
        if (this.isPipelineRunning) return;
        this.runAgenticPipeline();
      });
    }

    // 5. 3D Node Select & Hover Callbacks
    this.scene.onNodeSelectCallback = (agentData) => {
      sound.playSelect(agentData.colorHex);
      this.openTrustDrawer();
      this.appendLog(`[INSPECT] Selected Node: ${agentData.name} (${agentData.code}) | Trust Score: ${agentData.trustScore}%`, 'active');
    };

    this.scene.onNodeHoverCallback = (agentData) => {
      if (agentData) {
        sound.playHover();
      }
    };
  }

  // -------------------------------------------------------------
  // INTERACTIVE AGENT PIPELINE PIPELINE CONTROL
  // -------------------------------------------------------------
  runAgenticPipeline() {
    this.isPipelineRunning = true;
    const queryBtn = document.getElementById('query-btn');
    const logsBox = document.getElementById('terminal-logs');
    const explainBox = document.getElementById('explainability-box');

    queryBtn.disabled = true;
    queryBtn.innerText = "PROCESSING...";

    // Clean interface workspace logs
    logsBox.innerHTML = '';
    explainBox.innerHTML = `
      <div class="animate-pulse flex space-x-2 items-center text-[#00f0ff] font-mono text-xs h-full justify-center">
        <span>🤖 Running Multi-Agent Validation Cycle...</span>
      </div>
    `;

    // 1. Initial Query Log
    sound.playSelect('#00ff66');
    this.appendLog("📥 [QUERY RECEIVED]: Farmer asked: 'What crop should I grow today?'", "active");

    // 2. Planner Agent activation animation sequence
    setTimeout(() => {
      sound.playSelect('#00ff66');
      this.appendLog("🧠 [PLANNER AGENT]: Processing objective. Assembling high-trust orbital agent cluster.");
      this.scene.triggerPlannerActivation();
      this.scene.triggerSubAgentConvergence(['weather', 'soil', 'market', 'crop']);
    }, 1000);

    // 3. Parallel Processing Log Entries Sequence
    setTimeout(() => {
      sound.playHover();
      this.appendLog("🌦️ [WEATHER AGENT]: Mapping air columns... Cloud cluster arriving. Rain expected in 3 days.");
    }, 2200);

    setTimeout(() => {
      sound.playHover();
      this.appendLog("🌱 [SOIL AGENT]: Polling register fields... Moisture Low (58%), pH 6.8. Safe baseline verified.");
    }, 3200);

    setTimeout(() => {
      sound.playHover();
      this.appendLog("🦠 [DISEASE AGENT]: Cross-analyzing moisture trends... Low pathogen propagation risks.");
    }, 4200);

    setTimeout(() => {
      sound.playHover();
      this.appendLog("💰 [MARKET AGENT]: Tracking state trading indices... Groundnut: ₹82/kg. Cotton: ₹69/kg.");
    }, 5200);

    // 4. The Validator Conflict Intervention Sequence
    setTimeout(() => {
      sound.playConflictWarning();
      this.scene.triggerConflictFlash('weather', 'irrigation');
      this.appendLog("⚠️ [CONFLICT DETECTED]: Weather states Rain inside 72 hrs. Local Irrigation loop requested hydration today.", "warn");
    }, 6400);

    setTimeout(() => {
      sound.playValidatorResolve();
      this.scene.triggerResolveConflict('weather', 'irrigation');
      this.appendLog("⚖️ [VALIDATOR AGENT]: Conflict Intercepted. Suppressing Irrigation task node to avoid soil supersaturation.", "warn");
    }, 7600);

    // 5. Structural layout reconstitution & Reveal Explainable Manifest
    setTimeout(() => {
      sound.playValidatorResolve();
      this.appendLog("👁️ [EXPLAINABILITY AGENT]: Causal processing maps verified. Writing dashboard telemetry package.", "active");

      // Display structured Explainability Web elements
      explainBox.className = "col-span-7 h-full flex flex-col justify-between pl-2";
      explainBox.innerHTML = `
        <div class="grid grid-cols-12 gap-3 h-full items-center">
          <div class="col-span-7">
            <div class="text-xs font-mono tracking-wider text-[#ccff00] uppercase mb-1 flex justify-between">
              <span>👁️ Causal Rationale Matrix</span>
              <span class="text-white/40 font-normal">Confidence: 94%</span>
            </div>
            <ul class="text-[11px] text-white/80 space-y-1.5 list-none pl-0 font-sans">
              <li class="flex items-start gap-1 font-sans"><span class="text-[#00ff66]">✔</span> <span>Soil Moisture 58% matches leguminous parameters.</span></li>
              <li class="flex items-start gap-1 font-sans"><span class="text-[#00ff66]">✔</span> <span>pH index 6.8 supports root germination.</span></li>
              <li class="flex items-start gap-1 font-sans"><span class="text-[#00ff66]">✔</span> <span>Rain expected; local watering halted by Validator.</span></li>
              <li class="flex items-start gap-1 font-sans"><span class="text-[#00ff66]">✔</span> <span>Commodity demand yields optimized pricing at ₹82/kg.</span></li>
            </ul>
          </div>
          <div class="col-span-5 border-l border-white/5 pl-3 space-y-1.5">
            <div class="text-xs font-mono tracking-wider text-[#ff3366] uppercase mb-1">🎯 Actions</div>
            <div class="bg-white/5 border-l-2 border-[#00f0ff] p-1 text-[10px] font-mono text-white/90">Grow Groundnut.</div>
            <div class="bg-white/5 border-l-2 border-[#00f0ff] p-1 text-[10px] font-mono text-white/90">Water only today.</div>
            <div class="bg-white/5 border-l-2 border-[#00f0ff] p-1 text-[10px] font-mono text-white/90">No immediate fertilizers.</div>
          </div>
        </div>
      `;

      queryBtn.disabled = false;
      queryBtn.innerText = "ASK PLANNER ENGINE";
      this.isPipelineRunning = false;
    }, 9000);
  }

  // Render Agent Security & Trust Matrix
  renderTrustMatrix() {
    const container = document.getElementById('trust-matrix-list');
    if (!container) return;

    const allAgents = Object.values(dataEngine.agents);

    container.innerHTML = allAgents
      .map((agent) => {
        const trustPercent = agent.trustScore;
        const color = agent.colorHex || '#A855F7';
        return `
          <div class="glass-card p-3 rounded-lg border border-white/5 space-y-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${color}"></span>
                <span class="font-bold font-display text-white text-xs">${agent.name}</span>
              </div>
              <span class="text-[10px] text-gray-400 font-mono">${agent.code || 'CORE'}</span>
            </div>

            <div class="flex justify-between items-center text-[11px]">
              <span class="text-gray-400 font-sans">Trust Factor</span>
              <span class="font-bold font-mono text-[#00ff66]">${trustPercent}%</span>
            </div>

            <div class="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div class="h-full rounded-full transition-all duration-500" style="width: ${trustPercent}%; background-color: ${color}"></div>
            </div>

            <div class="text-[10px] text-gray-400 leading-tight font-sans">
              ${agent.role}
            </div>
          </div>
        `;
      })
      .join('');
  }

  openTrustDrawer() {
    this.renderTrustMatrix();
    const drawer = document.getElementById('trust-drawer');
    if (drawer) drawer.classList.remove('translate-x-full');
  }

  closeTrustDrawer() {
    const drawer = document.getElementById('trust-drawer');
    if (drawer) drawer.classList.add('translate-x-full');
  }

  appendLog(text, type = "normal") {
    const logsBox = document.getElementById('terminal-logs');
    if (!logsBox) return;

    const el = document.createElement('div');
    el.innerText = text;
    if (type === "active") el.className = "text-[#00ff66]";
    if (type === "warn") el.className = "text-[#ffb800]";

    logsBox.appendChild(el);
    logsBox.scrollTop = logsBox.scrollHeight;
  }

  startIoTUpdates() {
    setInterval(() => {
      const iot = dataEngine.updateIoTReadouts();

      const moistEl = document.getElementById('metric-moisture');
      if (moistEl) moistEl.textContent = `${Math.round(iot.soilMoisture)}%`;

      const tempEl = document.getElementById('metric-temp');
      if (tempEl) tempEl.textContent = `${Math.round(iot.temperature)}°C`;

      const humEl = document.getElementById('metric-humidity');
      if (humEl) humEl.textContent = `${Math.round(iot.humidity)}%`;
    }, 2500);
  }

  startFPSCounter() {
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsEl = document.getElementById('hud-fps');

    const updateFPS = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        if (fpsEl) fpsEl.textContent = fps;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFPS);
    };

    requestAnimationFrame(updateFPS);
  }
}
