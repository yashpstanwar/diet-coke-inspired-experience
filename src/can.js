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
