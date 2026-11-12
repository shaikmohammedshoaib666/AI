// Utility helper providing sample images as Blobs/Files for quick demonstration

export function generateSampleLeafBlob(type = 'tomato_blight') {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 300, 300);

  // Leaf Base shape
  ctx.save();
  ctx.translate(150, 150);

  ctx.beginPath();
  ctx.moveTo(0, -110);
  ctx.bezierCurveTo(80, -70, 90, 70, 0, 120);
  ctx.bezierCurveTo(-90, 70, -80, -70, 0, -110);
  ctx.closePath();

  if (type === 'healthy_leaf') {
    // Vibrant Green
    const grad = ctx.createLinearGradient(0, -110, 0, 120);
    grad.addColorStop(0, '#38a169');
    grad.addColorStop(0.5, '#2f855a');
    grad.addColorStop(1, '#276749');
    ctx.fillStyle = grad;
    ctx.fill();

    // Central vein
    ctx.strokeStyle = '#68d391';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -100);
    ctx.lineTo(0, 110);
    ctx.stroke();

    // Side veins
    for (let i = -60; i < 80; i += 25) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(40, i - 15);
      ctx.moveTo(0, i);
      ctx.lineTo(-40, i - 15);
      ctx.stroke();
    }
  } else if (type === 'tomato_blight') {
    // Yellowing green with brown target spots
    const grad = ctx.createLinearGradient(0, -110, 0, 120);
    grad.addColorStop(0, '#68d391');
    grad.addColorStop(0.4, '#d69e2e');
    grad.addColorStop(1, '#744210');
    ctx.fillStyle = grad;
    ctx.fill();

    // Concentric necrotic rings
    const spots = [[-20, -30, 22], [30, 20, 28], [-15, 50, 18], [20, -60, 14]];
    spots.forEach(([x, y, r]) => {
      // Yellow chlorotic halo
      ctx.fillStyle = '#ecc94b';
      ctx.beginPath();
      ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.fill();

      // Outer brown ring
      ctx.fillStyle = '#5c3d11';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Inner ring
      ctx.strokeStyle = '#2b1803';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Center necrotic spot
      ctx.fillStyle = '#1c1002';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (type === 'rice_blast') {
    // Pale green with spindle-shaped blast lesions
    const grad = ctx.createLinearGradient(0, -110, 0, 120);
    grad.addColorStop(0, '#48bb78');
    grad.addColorStop(0.7, '#9ae6b4');
    grad.addColorStop(1, '#38a169');
    ctx.fillStyle = grad;
    ctx.fill();

    // Spindle lesions (gray center, brown margin)
    const lesions = [[-10, -40, 30, 10], [15, 10, 38, 12], [-5, 60, 25, 9]];
    lesions.forEach(([x, y, w, h]) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.2);

      // Brown halo
      ctx.fillStyle = '#7b341e';
      ctx.beginPath();
      ctx.ellipse(0, 0, w / 2 + 4, h / 2 + 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Grayish-white necrotic center
      ctx.fillStyle = '#cbd5e0';
      ctx.beginPath();
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  } else if (type === 'soil_black') {
    // Dark Vertisol / Black Cotton Soil texture
    ctx.restore();
    ctx.fillStyle = '#27201c';
    ctx.fillRect(0, 0, 300, 300);

    // Soil clods and granules
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * 300;
      const ry = Math.random() * 300;
      const radius = Math.random() * 6 + 1;
      const shade = Math.floor(Math.random() * 40 + 20);
      ctx.fillStyle = `rgb(${shade}, ${shade - 5}, ${shade - 8})`;
      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'black_cotton_soil.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg');
    });
  }

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob], `${type}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
}
