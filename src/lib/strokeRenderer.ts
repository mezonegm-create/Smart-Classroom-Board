import getStroke from 'perfect-freehand';
import type { PagePoint, StrokeElement } from '../types';

function strokeOptions(el: Pick<StrokeElement, 'tool' | 'size'>) {
  if (el.tool === 'highlighter') {
    return {
      size: el.size,
      thinning: 0,
      smoothing: 0.4,
      streamline: 0.35,
      simulatePressure: false,
      last: true,
    };
  }
  if (el.tool === 'eraser') {
    return {
      size: el.size,
      thinning: 0,
      smoothing: 0.5,
      streamline: 0.4,
      simulatePressure: false,
      last: true,
    };
  }
  // pen
  return {
    size: el.size,
    thinning: 0.6,
    smoothing: 0.5,
    streamline: 0.5,
    easing: (t: number) => Math.sin((t * Math.PI) / 2),
    simulatePressure: true,
    last: true,
  };
}

/** Converts perfect-freehand's outline points into a Path2D for canvas fill(). */
export function strokeToPath2D(points: PagePoint[], el: Pick<StrokeElement, 'tool' | 'size'>): Path2D | null {
  if (points.length === 0) return null;
  if (points.length === 1) {
    const [x, y] = points[0];
    const r = el.size / 2;
    const p = new Path2D();
    p.arc(x, y, r, 0, Math.PI * 2);
    return p;
  }

  const input = points.map(([x, y, pressure]) => [x, y, pressure]);
  const outline = getStroke(input, strokeOptions(el));
  if (outline.length === 0) return null;

  const path = new Path2D();
  path.moveTo(outline[0][0], outline[0][1]);
  for (let i = 1; i < outline.length; i++) {
    path.lineTo(outline[i][0], outline[i][1]);
  }
  path.closePath();
  return path;
}

/** Draws a single stroke element onto a canvas context. */
export function drawStroke(ctx: CanvasRenderingContext2D, el: StrokeElement): void {
  const path = strokeToPath2D(el.points, el);
  if (!path) return;

  ctx.save();
  if (el.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = el.opacity;
    ctx.fillStyle = el.color;
  }
  ctx.fill(path);
  ctx.restore();
}

/** Bounding box for a set of points, used for quick hit-testing / thumbnails. */
export function boundsOfPoints(points: PagePoint[]): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}
