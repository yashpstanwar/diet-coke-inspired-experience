import * as THREE from 'three';

/**
 * Generates an ultra-crisp 2048x2048 procedural texture for the Diet Coke can.
 * Features realistic brushed aluminum specular gradients, crisp brand typography,
 * and procedural condensation droplets.
 */
export function createCanLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const markImg = new Image();
  let imgLoaded = false;

  function renderTexture() {
    // 1. Brushed aluminum background gradient
    const gradient = ctx.createLinearGradient(0, 0, 2048, 0);
    gradient.addColorStop(0, '#b8bec0');
    gradient.addColorStop(0.14, '#f4f4f1');
    gradient.addColorStop(0.28, '#aeb4b6');
    gradient.addColorStop(0.44, '#f8f8f5');
    gradient.addColorStop(0.6, '#c2c7c7');
    gradient.addColorStop(0.76, '#f5f5f2');
    gradient.addColorStop(1, '#b8bec0');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);

    // 2. Front and back labels
    [0, 1024, 2048].forEach(x => {
      if (imgLoaded) {
        ctx.drawImage(markImg, x - 480, 300, 960, 367);
      } else {
        ctx.fillStyle = '#e4001b';
        ctx.textAlign = 'center';
        ctx.font = 'bold 250px Georgia, serif';
        ctx.fillText('Coke', x, 570);
      }

      ctx.fillStyle = '#d90018';
      ctx.textAlign = 'center';
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.fillText('NO SUGAR', x, 1570);
      ctx.fillText('NO CALORIES', x, 1630);

      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText('12 FL OZ  •  355 mL', x, 1870);
    });

    // 3. Realistic condensation water droplets
    for (let i = 0; i < 180; i++) {
      const dropX = (i * 163 + 71) % 2048;
      const dropY = (i * 281 + 115) % 2048;
      if (dropY > 250 && dropY < 720) continue; // Keep logo area relatively clear

      const radius = 2 + (i % 5);
      ctx.beginPath();
      ctx.arc(dropX, dropY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 90, 90, 0.16)';
      ctx.stroke();
    }

    texture.needsUpdate = true;
  }

  renderTexture();

  markImg.onload = () => {
    imgLoaded = true;
    renderTexture();
  };
  markImg.src = '/assets/diet-coke-mark.png';

  return texture;
}


/**
 * Builds a photorealistic 3D Diet Coke can using procedural geometries.
 * Includes cylindrical body with brushed label, beveled neck, double-rolled top rim,
 * bottom chime, and an articulated pull-tab with a revealable mouth aperture.
 */
export function createCanMesh() {
  const can = new THREE.Group();

  // Materials
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xc3c7ca,
    metalness: 0.68,
    roughness: 0.29
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0x7f8587,
    metalness: 0.65,
    roughness: 0.34
  });

  const bodyMaterial = new THREE.MeshStandardMaterial({
    map: createCanLabelTexture(),
    metalness: 0.28,
    roughness: 0.34
  });

  // Main cylindrical body
  const bodyGeo = new THREE.CylinderGeometry(0.76, 0.76, 3.42, 128, 1, true);
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
  can.add(bodyMesh);

  // Helper for cylindrical transitions
  function addCylinder(topR, botR, height, posY, mat = metalMaterial) {
    const geo = new THREE.CylinderGeometry(topR, botR, height, 96);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = posY;
    can.add(mesh);
    return mesh;
  }

  // Helper for rim toruses
  function addTorus(radius, tube, posY, mat = metalMaterial) {
    const geo = new THREE.TorusGeometry(radius, tube, 12, 96);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = posY;
    can.add(mesh);
    return mesh;
  }

  // Top neck taper & rims
  addCylinder(0.64, 0.76, 0.22, 1.82);
  addCylinder(0.64, 0.64, 0.04, 1.95, rimMaterial);
  addTorus(0.64, 0.04, 1.98);
  addCylinder(0.62, 0.62, 0.025, 1.98);
  addTorus(0.49, 0.012, 2.0, rimMaterial);

  // Bottom chine & bevel
  addCylinder(0.76, 0.67, 0.14, -1.78);
  addTorus(0.67, 0.036, -1.86);

  // Opening aperture (starts closed/hidden)
  const apertureGeo = new THREE.CircleGeometry(0.12, 32);
  const apertureMat = new THREE.MeshBasicMaterial({
    color: 0x292b2b,
    side: THREE.DoubleSide
  });
  const aperture = new THREE.Mesh(apertureGeo, apertureMat);
  aperture.rotation.x = -Math.PI / 2;
  aperture.scale.y = 1.55;
  aperture.position.set(0, 2.008, -0.25);
  aperture.visible = false;
  can.add(aperture);

  // Articulated Pull-Tab
  const tabPivot = new THREE.Group();
  tabPivot.position.set(0, 2.025, -0.06);
  can.add(tabPivot);

  const tabRingGeo = new THREE.TorusGeometry(0.14, 0.035, 12, 48);
  const tabRing = new THREE.Mesh(tabRingGeo, rimMaterial);
  tabRing.rotation.x = Math.PI / 2;
  tabRing.scale.set(0.7, 1.35, 1);
  tabRing.position.z = 0.11;
  tabPivot.add(tabRing);

  // Rivet
  const rivetGeo = new THREE.SphereGeometry(0.045, 20, 12);
  const rivet = new THREE.Mesh(rivetGeo, metalMaterial);
  rivet.position.set(0, 2.03, -0.06);
  rivet.scale.y = 0.3;
  can.add(rivet);

  return { can, tabPivot, aperture };
}
