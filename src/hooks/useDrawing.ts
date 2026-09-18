import { useCallback, useEffect, useRef } from 'react';
import { LazyBrush } from 'lazy-brush';
import type { PagePoint, StrokeElement, ToolSettings } from '../types';
import { drawStroke } from '../lib/strokeRenderer';
import { newId } from '../lib/id';

interface UseDrawingOptions {
  liveCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  settings: ToolSettings;
  onStrokeComplete: (stroke: StrokeElement) => void;
}

const LAZY_RADIUS = 6;

function sizeForTool(settings: ToolSettings): number {
  if (settings.tool === 'highlighter') return settings.highlighterSize;
  if (settings.tool === 'eraser') return settings.eraserSize;
  return settings.penSize;
}

function colorForTool(settings: ToolSettings): string {
  return settings.tool === 'eraser' ? '#000000' : settings.color;
}

function opacityForTool(settings: ToolSettings): number {
  return settings.tool === 'highlighter' ? 0.45 : 1;
}

export function useDrawing({ liveCanvasRef, settings, onStrokeComplete }: UseDrawingOptions) {
  const lazyBrush = useRef(new LazyBrush({ radius: LAZY_RADIUS, enabled: true }));
  const current = useRef<StrokeElement | null>(null);
  const activePointerId = useRef<number | null>(null);
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const getCtx = useCallback((): CanvasRenderingContext2D | null => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, [liveCanvasRef]);

  const localPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>): PagePoint => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return [0, 0, 0.5];
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const pressure = e.pointerType === 'pen' && e.pressure > 0 ? e.pressure : 0.5;
    return [x, y, pressure];
  }, [liveCanvasRef]);

  const redrawLive = useCallback(() => {
    const ctx = getCtx();
    const canvas = liveCanvasRef.current;
    const stroke = current.current;
    if (!ctx || !canvas || !stroke) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStroke(ctx, stroke);
  }, [getCtx, liveCanvasRef]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerId.current !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    activePointerId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const s = settingsRef.current;
    const brush = lazyBrush.current;
    brush.setRadius(e.pointerType === 'pen' ? 0 : LAZY_RADIUS);

    const point = localPoint(e);
    brush.update({ x: point[0], y: point[1] }, { both: true });

    current.current = {
      id: newId(),
      kind: 'stroke',
      tool: s.tool === 'select' ? 'pen' : s.tool,
      color: colorForTool(s),
      size: sizeForTool(s),
      opacity: opacityForTool(s),
      points: [[brush.getBrushCoordinates().x, brush.getBrushCoordinates().y, point[2]]],
    };
    redrawLive();
  }, [localPoint, redrawLive]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerId.current !== e.pointerId || !current.current) return;

    const point = localPoint(e);
    const brush = lazyBrush.current;
    const hasMoved = brush.update({ x: point[0], y: point[1] });
    if (!hasMoved) return;

    const b = brush.getBrushCoordinates();
    current.current.points.push([b.x, b.y, point[2]]);
    redrawLive();
  }, [localPoint, redrawLive]);

  const endStroke = useCallback(() => {
    const stroke = current.current;
    const canvas = liveCanvasRef.current;
    if (stroke && stroke.points.length > 0) {
      onStrokeComplete(stroke);
    }
    current.current = null;
    activePointerId.current = null;
    const ctx = getCtx();
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [getCtx, liveCanvasRef, onStrokeComplete]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    endStroke();
  }, [endStroke]);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    endStroke();
  }, [endStroke]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onPointerCancel: onPointerUp };
}
