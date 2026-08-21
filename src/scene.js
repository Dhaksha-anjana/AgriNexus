import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { dataEngine } from './agents.js';

export class AntigravityScene {
  constructor(container) {
    this.container = container;
    this.agentNodes = [];
    this.connectionLines = [];
    this.hoveredNode = null;
    this.selectedNode = null;
    this.onNodeSelectCallback = null;
    this.onNodeHoverCallback = null;

    // Mouse tracking for Kinetic Parallax
    this.mouseParallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.initScene();
    this.createSubstrateGrid();
    this.createAgentConstellation();
    this.createTelemetryParticles();
    this.setupLighting();
    this.setupRaycasterAndParallax();
    this.animate();
    this.handleResize();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0c10); // Deep Carbon Black
    this.scene.fog = new THREE.FogExp2(0x0a0c10, 0.025); // Deep space fog

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2.5, 10);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Restrict camera below grid
    this.controls.minDistance = 4;
    this.controls.maxDistance = 26;

    this.clock = new THREE.Clock();
  }

  createSubstrateGrid() {
    const gridExtent = 120;
    const gridDivisions = 120;
    
    // Ambient Architectural Grid Floor
    const gridHelper = new THREE.GridHelper(gridExtent, gridDivisions, 0x00FF66, 0x141822);
    gridHelper.position.y = -3.5;
    gridHelper.material.opacity = 0.18;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // Fine Detail Secondary Grid
    const fineGrid = new THREE.GridHelper(gridExtent, gridDivisions * 2, 0x00F0FF, 0x0e131d);
    fineGrid.position.y = -3.51;
    fineGrid.material.opacity = 0.08;
    fineGrid.material.transparent = true;
    this.scene.add(fineGrid);

    // Origin Pulse Ring
    const originGeo = new THREE.RingGeometry(0.1, 4.5, 32);
    const originMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12
    });
    const originRing = new THREE.Mesh(originGeo, originMat);
    originRing.rotation.x = Math.PI / 2;
    originRing.position.y = -3.49;
    this.scene.add(originRing);
  }

  createAgentConstellation() {
    this.agentNetwork = new THREE.Group();
    this.scene.add(this.agentNetwork);

    // Central Planner Core
    this.coreGroup = new THREE.Group();

    const coreGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00FF66,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.plannerCore = new THREE.Mesh(coreGeo, coreMat);
    this.coreGroup.add(this.plannerCore);

    const nucGeo = new THREE.IcosahedronGeometry(0.65, 2);
    const nucMat = new THREE.MeshStandardMaterial({
      color: 0x00FF66,
      emissive: 0x00FF66,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.75
    });
    this.plannerNucleus = new THREE.Mesh(nucGeo, nucMat);
    this.coreGroup.add(this.plannerNucleus);

    const coreLight = new THREE.PointLight(0x00FF66, 2.5, 9);
    this.coreGroup.add(coreLight);

    this.agentNetwork.add(this.coreGroup);

    // Satellite Sub-Agents (Orbital System)
    this.radius = 4.2;
    const agentArray = Object.values(dataEngine.agents).filter((a) => a.angle !== undefined);

    agentArray.forEach((agent) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.userData = { agentData: agent };

      // Ring Boundary Vector
      const ringGeo = new THREE.RingGeometry(0.48, 0.52, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: agent.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = 0.02;
      nodeGroup.add(ring);

      // Translucent Glass Interior Base
      const discGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.04, 32);
      const discMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
        transmission: 0.6,
        roughness: 0.15,
        metalness: 0.1,
        clearcoat: 1.0
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = Math.PI / 2;
      nodeGroup.add(disc);

      // Hover Highlight Ring
      const hoverRingGeo = new THREE.RingGeometry(0.53, 0.60, 32);
      const hoverRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const hoverRing = new THREE.Mesh(hoverRingGeo, hoverRingMat);
      hoverRing.position.z = 0.025;
      nodeGroup.add(hoverRing);

      // Inner Core Gem
      const gemGeo = new THREE.OctahedronGeometry(0.18);
      const gemMat = new THREE.MeshBasicMaterial({
        color: agent.color,
        wireframe: true
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      nodeGroup.add(gem);

      // Position Node in 3D Space Ring
      nodeGroup.position.x = Math.cos(agent.angle) * this.radius;
      nodeGroup.position.z = Math.sin(agent.angle) * this.radius;
      nodeGroup.position.y = 0;

      this.agentNetwork.add(nodeGroup);

      // Connecting Laser Vector Lines to Central Core
      const lineMat = new THREE.LineDashedMaterial({
        color: agent.color,
        dashSize: 0.3,
        gapSize: 0.2,
        linewidth: 2,
        transparent: true,
        opacity: 0.45
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        nodeGroup.position.clone()
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      this.scene.add(line);

      this.connectionLines.push({ line, targetNode: nodeGroup, color: agent.color });
      this.agentNodes.push({
        id: agent.id,
        name: agent.name,
        mesh: nodeGroup,
        disc: disc,
        ring: ring,
        hoverRing: hoverRing,
        gem: gem,
        baseAngle: agent.angle,
        agentData: agent
      });
    });
  }

  createTelemetryParticles() {
    this.particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    this.particleSpeeds = [];

    for (let i = 0; i < this.particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 24; // X
      positions[i + 1] = -3.5 + Math.random() * 8.0; // Y
      positions[i + 2] = (Math.random() - 0.5) * 24; // Z
      this.particleSpeeds.push(0.008 + Math.random() * 0.015);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00F0FF, // Neon cyan
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    this.telemetryParticles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.telemetryParticles);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00FF66, 1.2);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    const blueSpotlight = new THREE.SpotLight(0x00F0FF, 3, 22, Math.PI / 4, 0.5, 1);
    blueSpotlight.position.set(-8, 5, -5);
    this.scene.add(blueSpotlight);
  }

  setupRaycasterAndParallax() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouseParallax.targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      this.mouseParallax.targetY = (e.clientY / window.innerHeight - 0.5) * 1.0;

      this.checkHover();
    };

    const onClick = () => {
      if (this.hoveredNode) {
        this.selectNode(this.hoveredNode);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onClick);
  }

  checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshesToTest = this.agentNodes.map((n) => n.mesh.children[1]); // Cylinder disc
    const intersects = this.raycaster.intersectObjects(meshesToTest);

    if (intersects.length > 0) {
      const parentGroup = intersects[0].object.parent;
      const foundNode = this.agentNodes.find((n) => n.mesh === parentGroup);

      if (foundNode !== this.hoveredNode) {
        if (this.hoveredNode) {
          gsap.to(this.hoveredNode.hoverRing.material, { opacity: 0, duration: 0.2 });
          gsap.to(this.hoveredNode.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
        }

        this.hoveredNode = foundNode;
        this.container.style.cursor = 'pointer';

        gsap.to(foundNode.hoverRing.material, { opacity: 0.95, duration: 0.2 });
        gsap.to(foundNode.mesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.2 });

        if (this.onNodeHoverCallback) {
          this.onNodeHoverCallback(foundNode.agentData);
        }
      }
    } else {
      if (this.hoveredNode) {
        gsap.to(this.hoveredNode.hoverRing.material, { opacity: 0, duration: 0.2 });
        gsap.to(this.hoveredNode.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
        this.hoveredNode = null;
        this.container.style.cursor = 'default';
        if (this.onNodeHoverCallback) {
          this.onNodeHoverCallback(null);
        }
      }
    }
  }

  selectNode(nodeItem) {
    this.selectedNode = nodeItem;
    const targetPos = new THREE.Vector3();
    nodeItem.mesh.getWorldPosition(targetPos);

    gsap.to(this.controls.target, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.2,
      ease: 'power3.out'
    });

    if (this.onNodeSelectCallback) {
      this.onNodeSelectCallback(nodeItem.agentData);
    }
  }

  resetCamera() {
    gsap.to(this.controls.target, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power3.out' });
    gsap.to(this.camera.position, { x: 0, y: 2.5, z: 10, duration: 1.4, ease: 'power3.out' });
  }

  // -------------------------------------------------------------
  // GSAP CONSTELLATION ANIMATION SEQUENCES
  // -------------------------------------------------------------

  triggerPlannerActivation() {
    gsap.to(this.coreGroup.scale, {
      x: 1.35,
      y: 1.35,
      z: 1.35,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });

    gsap.to(this.plannerNucleus.material, {
      emissiveIntensity: 2.2,
      duration: 0.8
    });
  }

  triggerSubAgentConvergence(activeIds) {
    this.agentNodes.forEach((node) => {
      const isActive = activeIds.includes(node.id);
      const targetRadius = isActive ? 1.8 : 6.5;
      const targetY = isActive ? 0.3 : -1.5;
      const targetOpacity = isActive ? 1.0 : 0.1;
      const targetScale = isActive ? 1.3 : 0.75;

      const targetX = Math.cos(node.baseAngle) * targetRadius;
      const targetZ = Math.sin(node.baseAngle) * targetRadius;

      gsap.to(node.mesh.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 1.2,
        ease: 'power2.out'
      });

      gsap.to(node.mesh.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 1.0
      });

      gsap.to(node.ring.material, {
        opacity: targetOpacity,
        duration: 0.8
      });
    });
  }

  triggerConflictFlash(agentAId, agentBId) {
    const nodeA = this.agentNodes.find((n) => n.id === agentAId);
    const nodeB = this.agentNodes.find((n) => n.id === agentBId);

    if (nodeA && nodeB) {
      gsap.to([nodeA.ring.material, nodeB.ring.material], {
        opacity: 1.0,
        repeat: 7,
        yoyo: true,
        duration: 0.1,
        onComplete: () => {
          nodeA.ring.material.color.setHex(0xFF3366);
          nodeB.ring.material.color.setHex(0xFFB800);
        }
      });
    }
  }

  triggerResolveConflict(winnerId, overriddenId) {
    const winnerNode = this.agentNodes.find((n) => n.id === winnerId);
    const overriddenNode = this.agentNodes.find((n) => n.id === overriddenId);

    if (winnerNode) {
      winnerNode.ring.material.color.setHex(winnerNode.agentData.color);
      gsap.to(winnerNode.ring.material, { opacity: 1.0, duration: 0.5 });
      gsap.to(winnerNode.mesh.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.5 });
    }

    if (overriddenNode) {
      overriddenNode.ring.material.color.setHex(0x0066FF);
      gsap.to(overriddenNode.ring.material, { opacity: 0.2, duration: 0.5 });
      gsap.to(overriddenNode.mesh.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.5 });
    }
  }

  resetConstellationLayout() {
    gsap.to(this.coreGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8 });
    gsap.to(this.plannerNucleus.material, { emissiveIntensity: 0.85, duration: 0.8 });

    this.agentNodes.forEach((node) => {
      const targetX = Math.cos(node.baseAngle) * this.radius;
      const targetZ = Math.sin(node.baseAngle) * this.radius;

      node.ring.material.color.setHex(node.agentData.color);

      gsap.to(node.mesh.position, {
        x: targetX,
        y: 0,
        z: targetZ,
        duration: 1.0,
        ease: 'power2.inOut'
      });

      gsap.to(node.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.8 });
      gsap.to(node.ring.material, { opacity: 0.7, duration: 0.8 });
    });

    this.resetCamera();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    // 1. Kinetic Parallax Lerp
    this.mouseParallax.x += (this.mouseParallax.targetX - this.mouseParallax.x) * 0.05;
    this.mouseParallax.y += (this.mouseParallax.targetY - this.mouseParallax.y) * 0.05;

    if (this.agentNetwork) {
      this.agentNetwork.rotation.y = this.mouseParallax.x * 0.12;
      this.agentNetwork.rotation.x = -this.mouseParallax.y * 0.08;
      this.agentNetwork.position.y = Math.sin(elapsed * 0.5) * 0.1;
    }

    // 2. Slow Core Rotation
    if (this.plannerCore) {
      this.plannerCore.rotation.y = elapsed * 0.1;
      this.plannerCore.rotation.x = elapsed * 0.05;
      this.plannerNucleus.rotation.y = -elapsed * 0.25;
    }

    // 3. Enforce Billboarding so satellite discs consistently confront viewport lens
    this.agentNodes.forEach((node) => {
      node.mesh.quaternion.copy(this.camera.quaternion);
      node.gem.rotation.y = elapsed * 0.8;
    });

    // 4. Update Laser Beam Lines
    this.connectionLines.forEach((item) => {
      const nodePos = item.targetNode.position;
      const positions = item.line.geometry.attributes.position.array;

      positions[3] = nodePos.x;
      positions[4] = nodePos.y;
      positions[5] = nodePos.z;

      item.line.geometry.attributes.position.needsUpdate = true;
      item.line.computeLineDistances();
      item.line.material.dashOffset = -elapsed * 0.8;
    });

    // 5. Telemetry Dust Particles Ascend Mapping (Y = -3.5 to Y = 4.5)
    if (this.telemetryParticles) {
      const pts = this.telemetryParticles.geometry.attributes.position.array;
      for (let i = 1; i < pts.length; i += 3) {
        pts[i] += this.particleSpeeds[(i - 1) / 3 | 0];
        if (pts[i] > 4.5) pts[i] = -3.5;
      }
      this.telemetryParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
