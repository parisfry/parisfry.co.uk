function mountMouseReactiveSketch(containerId, variant) {
  const container = document.getElementById(containerId);
  if (!container || typeof window.p5 !== "function") return;

  new p5((p) => {
    const cols = variant === 1 ? 50 : 60;
    const rows = variant === 1 ? 50 : 60;
    const points = 3;
    let resizeObserver;

    function resizeCanvasToContainer() {
      const width = container.clientWidth;
      if (!width) return;
      p.resizeCanvas(width, width * 0.66);
    }

    p.setup = () => {
      p.pixelDensity(1);
      const canvas = p.createCanvas(container.clientWidth, container.clientWidth * 0.66);
      canvas.parent(container);
      p.stroke(255);
      p.noFill();

      resizeObserver = new ResizeObserver(resizeCanvasToContainer);
      resizeObserver.observe(container);
    };

    p.draw = () => {
      p.background(0);
      p.stroke(255);
      p.noFill();

      const t = p.frameCount * (variant === 1 ? 0.04 : 0.05);
      const inside = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
      const mouseX = inside ? p.mouseX : p.width / 2;
      const mouseY = inside ? p.mouseY : p.height / 2;

      if (variant === 1) {
        for (let x = 0; x < cols; x += 1) {
          for (let y = 0; y < rows; y += 1) {
            const px = x * (p.width / cols);
            const py = y * (p.height / rows);
            const distance = p.dist(px, py, mouseX, mouseY);
            const influence = p.map(distance, 0, 400, 20, 0);
            const offset = p.sin(t + distance * 0.02) * influence;
            p.circle(px + offset, py + offset, 3);
          }
        }
        return;
      }

      const xStep = p.width / cols;
      const yStep = p.height / rows;
      const influences = [];

      for (let i = 0; i < points; i += 1) {
        influences.push({
        x: mouseX + p.cos(t * (0.5 + i * 0.3) + i) * 120,
        y: mouseY + p.sin(t * (0.3 + i * 0.2) + i) * 120,
        });
      }

      for (let x = 0; x < cols; x += 1) {
        for (let y = 0; y < rows; y += 1) {
          const px = x * xStep;
          const py = y * yStep;
          let offsetX = 0;
          let offsetY = 0;
          let minDistance = Infinity;

          for (const point of influences) {
            const dx = px - point.x;
            const dy = py - point.y;
            const distance = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
            minDistance = Math.min(minDistance, distance);
            const strength = p.map(distance, 0, 300, 10, 0);
            offsetX += (dx / distance) * strength;
            offsetY += (dy / distance) * strength;
          }

          const size = p.constrain(p.map(minDistance, 0, 200, 6, 2), 2, 6);
          const wave = p.sin(px * 0.015 + py * 0.015 + t) * 1.5;
          p.circle(px + offsetX + wave, py + offsetY + wave, size);
        }
      }
    };
  }, container);
}

mountMouseReactiveSketch("sketch1", 1);
mountMouseReactiveSketch("sketch2", 2);
