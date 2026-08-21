// AGRI-OS Multi-Agent Constellation, ESP32 IoT Engine, and Pipeline Logic

export class AgriOSDataEngine {
  constructor() {
    // ESP32 Hardware Edge Telemetry State
    this.iotSensors = {
      soilMoisture: 58.4, // %
      temperature: 26.4,  // °C
      humidity: 72.0,     // %
      rainPresence: 'Rain Expected (88%)',
      lightLevel: 42500,  // Lux
      phLevel: 6.8,       // pH
      esp32Status: 'CONNECTED (115200 Baud)',
      batteryLevel: '98%'
    };

    // Agent Profiles with Security & Trust Scores
    this.agents = {
      weather: {
        id: 'weather',
        name: 'Weather Agent',
        code: 'WX-882',
        color: 0x00F0FF,
        colorHex: '#00F0FF',
        angle: 0,
        role: 'Atmospheric & Climate Projection',
        trustScore: 96,
        status: 'OPTIMAL',
        recommendation: 'Precipitation imminent within 18 hours. Hold overhead/drip irrigation.',
        positiveFeedbackCount: 142,
        negativeFeedbackCount: 6
      },
      soil: {
        id: 'soil',
        name: 'Soil Agent',
        code: 'SL-409',
        color: 0x00FF66,
        colorHex: '#00FF66',
        angle: (Math.PI * 2) / 6,
        role: 'Substrate & Rhizosphere Matrix',
        trustScore: 94,
        status: 'OPTIMAL',
        recommendation: 'Rhizosphere nitrogen at 142ppm. Substrate pH 6.8 ideal for legumes.',
        positiveFeedbackCount: 128,
        negativeFeedbackCount: 8
      },
      disease: {
        id: 'disease',
        name: 'Disease Agent',
        code: 'BIO-901',
        color: 0xFF3366,
        colorHex: '#FF3366',
        angle: ((Math.PI * 2) / 6) * 2,
        role: 'Pathogen & Bio-Risk Matrix',
        trustScore: 98,
        status: 'MONITORING',
        recommendation: 'Fungal spore density sub-threshold (12 spores/m³). Low blight vulnerability.',
        positiveFeedbackCount: 210,
        negativeFeedbackCount: 4
      },
      crop: {
        id: 'crop',
        name: 'Crop Agent',
        code: 'CRP-104',
        color: 0xCCFF00,
        colorHex: '#CCFF00',
        angle: ((Math.PI * 2) / 6) * 3,
        role: 'Canopy & Phenology Telemetry',
        trustScore: 92,
        status: 'ACTIVE',
        recommendation: 'Recommend: Groundnut (Arachis hypogaea) for high ROI and nitrogen fixation.',
        positiveFeedbackCount: 95,
        negativeFeedbackCount: 7
      },
      market: {
        id: 'market',
        name: 'Market Agent',
        code: 'MKT-773',
        color: 0xFFB800,
        colorHex: '#FFB800',
        angle: ((Math.PI * 2) / 6) * 4,
        role: 'Economic Arbitrage & Spot Futures',
        trustScore: 90,
        status: 'OPTIMAL',
        recommendation: 'Groundnut spot price surging at ₹82/kg (+5.2% 24h delta). High market demand.',
        positiveFeedbackCount: 88,
        negativeFeedbackCount: 9
      },
      irrigation: {
        id: 'irrigation',
        name: 'Irrigation Agent',
        code: 'IRR-305',
        color: 0x0066FF,
        colorHex: '#0066FF',
        angle: ((Math.PI * 2) / 6) * 5,
        role: 'Zero-G Fluidic Allocation',
        trustScore: 88,
        status: 'CONFLICT_OVERRIDDEN',
        recommendation: '[REQUESTING WATERING] Soil moisture at 58% suggests localized pulse dosing.',
        positiveFeedbackCount: 74,
        negativeFeedbackCount: 11
      },
      validator: {
        id: 'validator',
        name: 'Validator Agent',
        code: 'VAL-001',
        color: 0xA855F7,
        colorHex: '#A855F7',
        role: 'Rule Conflict Resolution Core',
        trustScore: 99,
        status: 'ACTIVE_RESOLVER'
      },
      explainability: {
        id: 'explainability',
        name: 'Explainability Agent',
        code: 'XAI-002',
        color: 0x3B82F6,
        colorHex: '#3B82F6',
        role: 'Causal Rationale & Transparency Engine',
        trustScore: 97,
        status: 'ACTIVE_EXPLAINER'
      }
    };

    // 5-Step Pipeline Payload Definition
    this.pipelinePayload = {
      query: 'What crop should I grow and what are today\'s operational actions?',
      activeAgents: ['weather', 'soil', 'crop', 'market', 'irrigation'],
      conflict: {
        agentA: 'weather',
        agentB: 'irrigation',
        description: '[CONFLICT] Weather predicts Rain tomorrow. Irrigation agent requesting water today.',
        resolution: '[VALIDATOR] Conflict Intercepted. Overriding local Irrigation directive. Trust factor (96% Weather vs 88% Irrigation) favors Weather projection. Halting irrigation valve activation.'
      },
      explainabilityMatrix: {
        recommendedAction: 'Plant Groundnut (Arachis hypogaea)',
        confidenceIndex: '94.2%',
        causalChecklist: [
          { factor: 'Soil Moisture', value: '58.4% (Substrate moist, optimal seed bed)' },
          { factor: 'Substrate pH', value: '6.8 (Ideal neutral zone for nitrogen fixation)' },
          { factor: 'Atmospheric Forecast', value: 'Rain Expected in 18h (Eliminates irrigation cost)' },
          { factor: 'Bio-Pathogen Risk', value: 'Low Fungal Count (12 spores/m³)' },
          { factor: 'Market Arbitrage', value: 'Spot Price ₹82/kg (+5.2% 24h surge)' }
        ]
      }
    };
  }

  // Live telemetry perturbation
  updateIoTReadouts() {
    this.iotSensors.soilMoisture = +(58.4 + (Math.random() * 0.4 - 0.2)).toFixed(1);
    this.iotSensors.temperature = +(26.4 + (Math.random() * 0.2 - 0.1)).toFixed(1);
    this.iotSensors.humidity = +(72.0 + (Math.random() * 0.6 - 0.3)).toFixed(1);
    this.iotSensors.lightLevel = Math.round(42500 + (Math.random() * 300 - 150));
    return this.iotSensors;
  }

  // Adjust trust score based on user 👍 / 👎 feedback
  adjustAgentTrust(agentId, isHelpful) {
    const agent = this.agents[agentId];
    if (!agent) return;

    if (isHelpful) {
      agent.positiveFeedbackCount++;
      agent.trustScore = Math.min(99, +(agent.trustScore + 0.5).toFixed(1));
    } else {
      agent.negativeFeedbackCount++;
      agent.trustScore = Math.max(50, +(agent.trustScore - 1.2).toFixed(1));
    }
    return agent;
  }
}

export const dataEngine = new AgriOSDataEngine();
