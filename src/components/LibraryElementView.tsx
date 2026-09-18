import { useCallback, useRef, useState } from 'react';
import type { LibraryElement } from '../types';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from '../lib/boardGeometry';

interface Props {
  element: LibraryElement;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selected: boolean;
  interactive: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<LibraryElement>) => void;
  onDelete: (id: string) => void;
}

const MIN_SIZE = 30;

export default function LibraryElementView({
  element,
  containerRef,
  selected,
  interactive,
  onSelect,
  onChange,
  onDelete,
}: Props) {
  const dragState = useRef<{ startX: number; startY: number; el: LibraryElement; mode: 'move' | 'resize' } | null>(null);
  const [preview, setPreview] = useState<Partial<LibraryElement> | null>(null);

  const toLogical = useCallback(
    (clientDx: number, clientDy: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { dx: 0, dy: 0 };
      return {
        dx: (clientDx / rect.width) * LOGICAL_WIDTH,
        dy: (clientDy / rect.height) * LOGICAL_HEIGHT,
      };
    },
    [containerRef],
  );

  const onPointerDownMove = (e: React.PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    onSelect(element.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, el: { ...element }, mode: 'move' };
  };

  const onPointerDownResize = (e: React.PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, el: { ...element }, mode: 'resize' };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag) return;
    const { dx, dy } = toLogical(e.clientX - drag.startX, e.clientY - drag.startY);
    if (drag.mode === 'move') {
      setPreview({ x: drag.el.x + dx, y: drag.el.y + dy });
    } else {
      const aspect = drag.el.width / drag.el.height;
      const newWidth = Math.max(MIN_SIZE, drag.el.width + dx);
      const newHeight = drag.el.lockAspect ? newWidth / aspect : Math.max(MIN_SIZE, drag.el.height + dy);
      setPreview({ width: newWidth, height: newHeight });
    }
  };

  const endDrag = () => {
    if (dragState.current && preview) {
      onChange(element.id, preview);
    }
    dragState.current = null;
    setPreview(null);
  };

  const live = { ...element, ...preview };
  const leftPct = (live.x / LOGICAL_WIDTH) * 100;
  const topPct = (live.y / LOGICAL_HEIGHT) * 100;
  const widthPct = (live.width / LOGICAL_WIDTH) * 100;
  const heightPct = (live.height / LOGICAL_HEIGHT) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        transform: `rotate(${element.rotation}deg)`,
        pointerEvents: interactive ? 'auto' : 'none',
        touchAction: 'none',
        outline: selected ? '2px dashed #2563eb' : 'none',
        outlineOffset: '4px',
      }}
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="w-full h-full select-none"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: element.svg }}
      />
      {selected && interactive && (
        <>
          <button
            type="button"
            aria-label="حذف العنصر"
            className="absolute -top-4 -right-4 w-7 h-7 rounded-full bg-red-600 text-white text-sm flex items-center justify-center shadow"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(element.id)}
          >
            ×
          </button>
          <div
            role="presentation"
            className="absolute -bottom-2 -left-2 w-5 h-5 bg-blue-600 rounded-full cursor-nwse-resize shadow"
            onPointerDown={onPointerDownResize}
          />
        </>
      )}
    </div>
  );
}
