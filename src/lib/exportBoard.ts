import { jsPDF } from 'jspdf';
import type { BoardPage, LibraryElement, StrokeElement } from '../types';
import { drawStroke } from './strokeRenderer';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from './boardGeometry';

const EXPORT_SCALE = 2;

function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export async function renderPageToCanvas(page: BoardPage): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = LOGICAL_WIDTH * EXPORT_SCALE;
  canvas.height = LOGICAL_HEIGHT * EXPORT_SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('تعذّر إنشاء سياق الرسم للتصدير');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

  for (const el of page.elements) {
    if (el.kind === 'stroke') {
      drawStroke(ctx, el as StrokeElement);
    }
  }

  const libraryItems = page.elements.filter((el): el is LibraryElement => el.kind === 'library');
  for (const item of libraryItems) {
    try {
      const img = await loadSvgImage(item.svg);
      ctx.save();
      const cx = item.x + item.width / 2;
      const cy = item.y + item.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((item.rotation * Math.PI) / 180);
      ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height);
      ctx.restore();
    } catch (err) {
      console.error('فشل رسم عنصر تعليمي أثناء التصدير', err);
    }
  }

  ctx.restore();
  return canvas;
}

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportPageAsPNG(page: BoardPage, filename = 'السبورة.png'): Promise<void> {
  const canvas = await renderPageToCanvas(page);
  const url = canvas.toDataURL('image/png');
  triggerDownload(url, filename);
}

export async function exportLessonAsPDF(pages: BoardPage[], filename = 'الدرس.pdf'): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [LOGICAL_WIDTH, LOGICAL_HEIGHT],
  });

  for (let i = 0; i < pages.length; i++) {
    const canvas = await renderPageToCanvas(pages[i]);
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    if (i > 0) pdf.addPage([LOGICAL_WIDTH, LOGICAL_HEIGHT], 'landscape');
    pdf.addImage(imgData, 'JPEG', 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  }

  pdf.save(filename);
}
