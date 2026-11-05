import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createCanMesh } from './can.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates the 3D glassware, cola liquid mesh, foam head, and carbonation bubbles.
 */
export function createGlassware() {
  const glassGroup = new THREE.Group();
  glassGroup.position.set(1.35, -1.65, 0);

  // Lathe profile for realistic tapered beverage glass
  const lathePoints = [
    [0, 0],
    [0.47, 0],
    [0.51, 0.08],
    [0.66, 2.4],
    [0.62, 2.4],
    [0.47, 0.14],
    [0, 0.14]
  ].map(([x, y]) => new THREE.Vector2(x, y));

  // Transparent glass material
  const glassMat = new THREE.MeshPhongMaterial({
    color: 0xf3f6f6,
    specular: 0xffffff,
    shininess: 110,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const glassMesh = new THREE.Mesh(new THREE.LatheGeometry(lathePoints, 96), glassMat);
  glassMesh.renderOrder = 4;
  glassGroup.add(glassMesh);

  // Top and bottom rim highlights
  const rimMat = new THREE.MeshPhongMaterial({
    color: 0xf9ffff,
    specular: 0xffffff,
    shininess: 120,
    transparent: true,
    opacity: 0.85
  });

  const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.022, 12, 96), rimMat);
  topRim.rotation.x = Math.PI / 2;
  topRim.position.y = 2.4;
  topRim.renderOrder = 5;
  glassGroup.add(topRim);

  const baseRim = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.022, 12, 96), rimMat);
  baseRim.rotation.x = Math.PI / 2;
  baseRim.position.y = 0.07;
  baseRim.renderOrder = 5;
  glassGroup.add(baseRim);

  // Glass edge reflection lines
  const edgeLineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7
  });

  [-1, 1].forEach(dir => {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(dir * 0.48, 0.13, 0.08),
      new THREE.Vector3(dir * 0.65, 2.36, 0.08)
    ]);
    const edgeLine = new THREE.Line(lineGeo, edgeLineMat);
    edgeLine.renderOrder = 5;
    glassGroup.add(edgeLine);
  });

  // Dynamic Cola Liquid Cylinder
  const liquidGeo = new THREE.CylinderGeometry(0.6, 0.46, 1, 80);
  liquidGeo.translate(0, 0.5, 0); // Anchor pivot at base of liquid
  const liquidMat = new THREE.MeshPhongMaterial({
    color: 0x4a190a, // Rich dark amber cola
    specular: 0xa65822,
    shininess: 85
  });
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = 0.13;
  liquidMesh.renderOrder = 1;
  glassGroup.add(liquidMesh);

  // Creamy Foam Head Disc
  const foamGeo = new THREE.CylinderGeometry(0.59, 0.59, 0.1, 64);
  const foamMat = new THREE.MeshPhongMaterial({
    color: 0xd7b2ab,
    transparent: true,
    opacity: 0.88,
    shininess: 35
  });
  const foamMesh = new THREE.Mesh(foamGeo, foamMat);
  foamMesh.renderOrder = 2;
  glassGroup.add(foamMesh);

  // Carbonation Bubbles rising through the soda
  const bubbleGeo = new THREE.SphereGeometry(0.025, 10, 8);
  const bubbleMat = new THREE.MeshBasicMaterial({
    color: 0xf1c8ee,
    transparent: true,
    opacity: 0.7
  });

  const bubbles = Array.from({ length: 28 }, (_, i) => {
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    const angle = i * 2.399;
    const dist = 0.14 + (i % 4) * 0.085;
    bubble.position.x = Math.cos(angle) * dist;
    bubble.position.z = Math.sin(angle) * dist + 0.2;
    bubble.scale.setScalar(0.6 + (i % 4) * 0.18);
    bubble.renderOrder = 3;
    glassGroup.add(bubble);
    return bubble;
  });

  return { glassGroup, liquidMesh, foamMesh, bubbles };
}


/**
 * Initializes the full 3D Pour Experience stage with scroll-scrubbed physics,
 * dynamic liquid filling, and GSAP ScrollTrigger timeline orchestration.
 */
export function initPourExperience(reducedMotion = false) {
  const stage = document.querySelector('.pour-stage');
  const wrap = document.querySelector('.pour-canvas-wrap');
  const canvas = document.querySelector('#pour-canvas');

  if (!stage || !wrap || !canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    wrap.classList.add('no-webgl');
    stage.classList.add('no-webgl');
    console.warn('3D pouring is unavailable; using the product image fallback.', err);
    return;
  }

  wrap.classList.add('has-webgl');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.3, 10);
  camera.lookAt(0, 0.3, 0);

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7d8388, 2.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(-4, 6, 8);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 2.0);
  fillLight.position.set(5, 2, -3);
  scene.add(fillLight);

  // 3D Can
  const { can, tabPivot, aperture } = createCanMesh();
  can.rotation.order = 'ZYX';
  can.rotation.set(0, Math.PI, -0.12);
  can.position.set(-1.05, 0.08, 0);
  scene.add(can);

  // Glassware & Liquid
  const { glassGroup, liquidMesh, foamMesh, bubbles } = createGlassware();
  scene.add(glassGroup);

  // Pour coordinates calculation
  const canTiltPos = new THREE.Vector3(-0.82, 1.25, 0);
  const canTiltRot = new THREE.Euler(0, Math.PI, -1.05, 'ZYX');
  const mouthPos = new THREE.Vector3(0, 2.02, -0.25).applyEuler(canTiltRot).add(canTiltPos);
  const glassBaseY = glassGroup.position.y + 0.13;
  const streamDelta = new THREE.Vector3(1.35, glassBaseY, 0.25).sub(mouthPos);

  // Pour Stream Mesh
  const streamCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(streamDelta.x * 0.34, streamDelta.y * 0.28, 0),
    new THREE.Vector3(streamDelta.x * 0.78, streamDelta.y * 0.68, 0),
    streamDelta
  ]);

  const streamGeo = new THREE.TubeGeometry(streamCurve, 48, 0.055, 12, false);
  const streamMat = new THREE.MeshPhongMaterial({
    color: 0x571f0d,
    specular: 0xe7a37e,
    shininess: 100
  });
  const streamMesh = new THREE.Mesh(streamGeo, streamMat);
  streamMesh.position.copy(mouthPos);
  scene.add(streamMesh);

  // State variables for animation scrubbing
  const state = {
    fill: reducedMotion ? 0.58 : 0.02,
    flow: 0,
    phase: 0
  };

  const steps = [
    ['01', 'CRACK IT OPEN', 'THE MOMENT STARTS HERE'],
    ['02', 'THE PERFECT POUR', 'LET THE GOOD TIMES FIZZ'],
    ['03', 'MAKE IT YOURS', 'A LITTLE MOMENT OF REFRESHMENT']
  ];
  let currentStep = -1;

  function updateStepUI(progress) {
    const idx = progress < 0.24 ? 0 : progress < 0.82 ? 1 : 2;
    if (idx === currentStep) return;
    currentStep = idx;
    const [num, title, caption] = steps[idx];

    const numEl = document.querySelector('.pour-step-number');
    const titleEl = document.querySelector('.pour-step-title');
    const capEl = document.querySelector('.pour-step-caption');
    const countEl = document.querySelector('.pour-count');

    if (numEl) numEl.textContent = num;
    if (titleEl) titleEl.textContent = title;
    if (capEl) capEl.textContent = caption;
    if (countEl) countEl.textContent = `${num} / 03`;
  }

  function renderFrame() {
    const fillHeight = Math.max(0.001, state.fill * 1.9);
    liquidMesh.scale.y = fillHeight;
    foamMesh.position.y = 0.13 + fillHeight;
    foamMesh.visible = state.fill > 0.035;
    streamMesh.visible = state.flow > 0.005;

    const surfaceY = glassBaseY + fillHeight;
    const streamCut = Math.min(Math.max((mouthPos.y - surfaceY) / (mouthPos.y - glassBaseY), 0.05), 1);
    streamMesh.scale.y = Math.max(0.001, state.flow * streamCut);

    aperture.visible = tabPivot.rotation.x < -0.12;

    bubbles.forEach((bubble, i) => {
      bubble.visible = state.fill > 0.04;
      bubble.position.y = 0.15 + ((i * 0.371 + state.phase * 3) % 1) * Math.max(0.01, fillHeight - 0.08);
    });

    renderer.render(scene, camera);
  }

  function onResize() {
    const { width, height } = wrap.getBoundingClientRect();
    if (!width || !height) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const fovRad = (camera.fov * Math.PI) / 180;
    camera.position.z = Math.max(8.9, 5.9 / (2 * Math.tan(fovRad / 2) * camera.aspect));
    camera.updateProjectionMatrix();
    renderFrame();
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(wrap);
  onResize();

  if (!reducedMotion) {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progressEl = document.querySelector('.pour-progress i');
          if (progressEl) progressEl.style.transform = `scaleX(${self.progress})`;
          updateStepUI(self.progress);
        }
      }
    });

    // 1. Pull-tab opens
    tl.to(tabPivot.rotation, { x: -0.85, duration: 0.5 }, 0.12)
      // 2. Can translates & tilts toward glass
      .to(can.position, { x: canTiltPos.x, y: canTiltPos.y, duration: 0.85 }, 0.8)
      .to(can.rotation, { z: canTiltRot.z, duration: 0.85 }, 0.8)
      // 3. Liquid flows
      .to(state, { flow: 1, duration: 0.28, ease: 'power1.out' }, 1.75)
      // 4. Glass fills
      .to(state, { fill: 0.98, duration: 1.8, ease: 'none' }, 1.95)
      // 5. Stream ends
      .to(state, { flow: 0, duration: 0.25, ease: 'power1.in' }, 3.75)
      // 6. Can returns upright
      .to(can.rotation, { z: -0.18, duration: 0.65 }, 3.9)
      .to(can.position, { x: -1.05, y: 0.22, duration: 0.65 }, 3.9)
      // 7. Bubble fizz animation
      .to(state, { phase: 1, duration: 4.65, ease: 'none' }, 0);

    updateStepUI(0);
  } else {
    updateStepUI(0.5);
    renderFrame();
  }

  // Render loop with viewport culling
  let isIntersecting = true;
  const observer = new IntersectionObserver((entries) => {
    isIntersecting = entries[0].isIntersecting;
  }, { rootMargin: '100px' });
  observer.observe(stage);

  gsap.ticker.add(() => {
    if (isIntersecting) renderFrame();
  });

  return { renderer, scene, camera };
}
