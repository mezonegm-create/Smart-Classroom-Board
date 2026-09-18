// jsdom does not implement the Canvas/Path2D APIs. The whiteboard's rendering
// code only needs `moveTo`/`lineTo`/`closePath`/`arc` to exist so its logic
// can run in tests without a real browser canvas.
class Path2DPolyfill {
  moveTo(_x: number, _y: number): void {}
  lineTo(_x: number, _y: number): void {}
  closePath(): void {}
  arc(_x: number, _y: number, _r: number, _start: number, _end: number): void {}
}

if (typeof globalThis.Path2D === 'undefined') {
  // @ts-expect-error -- test-only polyfill, not a full Path2D implementation
  globalThis.Path2D = Path2DPolyfill;
}
