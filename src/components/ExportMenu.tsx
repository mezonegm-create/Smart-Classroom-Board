import { useState } from 'react';
import { FaFileImage, FaFilePdf } from 'react-icons/fa';
import type { BoardPage } from '../types';
import { exportLessonAsPDF, exportPageAsPNG } from '../lib/exportBoard';

interface Props {
  open: boolean;
  onClose: () => void;
  currentPage: BoardPage;
  currentPageNumber: number;
  allPages: BoardPage[];
  boardName: string;
}

export default function ExportMenu({ open, onClose, currentPage, currentPageNumber, allPages, boardName }: Props) {
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);

  if (!open) return null;

  const handlePng = async () => {
    setBusy('png');
    try {
      await exportPageAsPNG(currentPage, `${boardName}-صفحة-${currentPageNumber}.png`);
    } finally {
      setBusy(null);
      onClose();
    }
  };

  const handlePdf = async () => {
    setBusy('pdf');
    try {
      await exportLessonAsPDF(allPages, `${boardName}.pdf`);
    } finally {
      setBusy(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-800 mb-4">تصدير</h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={busy !== null}
            onClick={handlePng}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          >
            <FaFileImage className="text-blue-600 text-xl" />
            <div className="text-right">
              <div className="font-medium text-slate-800">{busy === 'png' ? 'جارٍ التصدير…' : 'تصدير الصفحة الحالية PNG'}</div>
              <div className="text-xs text-slate-500">صورة لصفحة السبورة الحالية فقط</div>
            </div>
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={handlePdf}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          >
            <FaFilePdf className="text-red-600 text-xl" />
            <div className="text-right">
              <div className="font-medium text-slate-800">{busy === 'pdf' ? 'جارٍ التصدير…' : 'تصدير الدرس كاملًا PDF'}</div>
              <div className="text-xs text-slate-500">كل صفحات السبورة في ملف واحد</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
