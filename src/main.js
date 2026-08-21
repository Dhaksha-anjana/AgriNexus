import './style.css';
import { AntigravityScene } from './scene.js';
import { AntigravityUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  
  // Initialize 3D WebGL Scene
  const sceneInstance = new AntigravityScene(container);

  // Initialize Glassmorphism 2D UI Overlay
  const uiInstance = new AntigravityUI(sceneInstance);

  console.log('🌌 Antigravity Agricultural OS v4.8 Dashboard Initialized');
});
