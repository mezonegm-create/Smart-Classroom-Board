import { describe, expect, it } from 'vitest';
import { boundsOfPoints, strokeToPath2D } from './strokeRenderer';
import type { PagePoint } from '../types';

describe('boundsOfPoints', () => {
  it('computes the bounding box of a set of points', () => {
    const points: PagePoint[] = [
      [0, 0, 0.5],
      [10, -5, 0.5],
      [-3, 8, 0.5],
    ];
    expect(boundsOfPoints(points)).toEqual({ minX: -3, minY: -5, maxX: 10, maxY: 8 });
  });
});

describe('strokeToPath2D', () => {
  it('returns null for an empty point list', () => {
    expect(strokeToPath2D([], { tool: 'pen', size: 4 })).toBeNull();
  });

  it('returns a dot path for a single point', () => {
    const path = strokeToPath2D([[5, 5, 0.5]], { tool: 'pen', size: 4 });
    expect(path).toBeInstanceOf(Path2D);
  });

  it('produces a path for a multi-point pen stroke', () => {
    const points: PagePoint[] = [
      [0, 0, 0.5],
      [10, 0, 0.6],
      [20, 10, 0.7],
      [30, 10, 0.8],
    ];
    const path = strokeToPath2D(points, { tool: 'pen', size: 6 });
    expect(path).toBeInstanceOf(Path2D);
  });

  it('produces a path for a highlighter stroke', () => {
    const points: PagePoint[] = [
      [0, 0, 0.5],
      [10, 5, 0.5],
      [20, 0, 0.5],
    ];
    const path = strokeToPath2D(points, { tool: 'highlighter', size: 20 });
    expect(path).toBeInstanceOf(Path2D);
  });
});
