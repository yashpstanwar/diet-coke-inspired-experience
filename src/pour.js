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
