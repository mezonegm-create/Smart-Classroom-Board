import { useEffect, useMemo, useRef } from 'react';
import type { BoardPage, LibraryElement, StrokeElement, ToolSettings } from '../types';
import { drawStroke } from '../lib/strokeRenderer';
import { useDrawing } from '../hooks/useDrawing';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT, LOGICAL_ASPECT } from '../lib/boardGeometry';
import LibraryElementView from './LibraryElementView';

interface Props {
  page: BoardPage;
  settings: ToolSettings;
  onStrokeComplete: (stroke: StrokeElement) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateLibraryElement: (id: string, patch: Partial<LibraryElement>) => void;
  onDeleteLibraryElement: (id: string) => void;
  exportRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function CanvasStage({
  page,
  settings,
  onStrokeComplete,
  selectedElementId,
  onSelectElement,
  onUpdateLibraryElement,
  onDeleteLibraryElement,
  exportRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const liveCanvasRef = useRef<HTMLCanvasElement>(null);

  const strokes = useMemo(
    () => page.elements.filter((el): el is StrokeElement => el.kind === 'stroke'),
    [page.elements],
  );
  const libraryItems = useMemo(
    () => page.elements.filter((el): el is LibraryElement => el.kind === 'library'),
    [page.elements],
  );

  const { onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onPointerCancel } = useDrawing({
    liveCanvasRef,
    settings,
    onStrokeComplete,
  });

  // Redraw the base (already-committed) layer whenever the strokes list changes.
  useEffect(() => {
    const canvas = baseCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(canvas.width / LOGICAL_WIDTH, canvas.height / LOGICAL_HEIGHT);
    for (const stroke of strokes) {
      drawStroke(ctx, stroke);
    }
    ctx.restore();
  }, [page.id, strokes]);

  // Keep canvas pixel resolution crisp on the current device.
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const ref of [baseCanvasRef, liveCanvasRef]) {
      const canvas = ref.current;
      if (!canvas) continue;
      canvas.width = LOGICAL_WIDTH * dpr;
      canvas.height = LOGICAL_HEIGHT * dpr;
    }
    const canvas = baseCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      for (const stroke of strokes) drawStroke(ctx, stroke);
      ctx.restore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (exportRef) (exportRef as React.MutableRefObject<HTMLCanvasElement | null>).current = baseCanvasRef.current;
  });

  const isDrawingTool = settings.tool !== 'select';

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg shadow-inner border border-slate-300"
        style={{
          width: '100%',
          maxWidth: `min(100%, calc((100vh - 220px) * ${LOGICAL_ASPECT}))`,
          aspectRatio: `${LOGICAL_WIDTH} / ${LOGICAL_HEIGHT}`,
        }}
        onPointerDown={() => {
          if (!isDrawingTool) onSelectElement(null);
        }}
      >
        <canvas ref={baseCanvasRef} className="absolute inset-0 w-full h-full" />
        <canvas
          ref={liveCanvasRef}
          className="board-canvas-surface absolute inset-0 w-full h-full"
          style={{ touchAction: 'none', cursor: isDrawingTool ? 'crosshair' : 'default' }}
          onPointerDown={isDrawingTool ? onPointerDown : undefined}
          onPointerMove={isDrawingTool ? onPointerMove : undefined}
          onPointerUp={isDrawingTool ? onPointerUp : undefined}
          onPointerLeave={isDrawingTool ? onPointerLeave : undefined}
          onPointerCancel={isDrawingTool ? onPointerCancel : undefined}
        />
        {libraryItems.map((item) => (
          <LibraryElementView
            key={item.id}
            element={item}
            containerRef={containerRef}
            selected={selectedElementId === item.id}
            interactive={settings.tool === 'select'}
            onSelect={onSelectElement}
            onChange={onUpdateLibraryElement}
            onDelete={onDeleteLibraryElement}
          />
        ))}
      </div>
    </div>
  );
}
