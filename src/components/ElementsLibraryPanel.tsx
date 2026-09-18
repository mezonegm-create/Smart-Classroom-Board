import { useState } from 'react';
import { ELEMENTS_LIBRARY } from '../data/elementsLibrary';

interface Props {
  open: boolean;
  onClose: () => void;
  onInsert: (itemId: string) => void;
}

export default function ElementsLibraryPanel({ open, onClose, onInsert }: Props) {
  const [activeSubject, setActiveSubject] = useState(ELEMENTS_LIBRARY[0].id);

  if (!open) return null;

  const subject = ELEMENTS_LIBRARY.find((s) => s.id === activeSubject) ?? ELEMENTS_LIBRARY[0];

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-3xl sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">عناصر تعليمية</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xl flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto p-3 border-b bg-slate-50">
          {ELEMENTS_LIBRARY.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSubject(s.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                s.id === activeSubject ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 overflow-y-auto">
          {subject.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onInsert(item.id);
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <div
                className="w-16 h-16 flex items-center justify-center"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: item.svg }}
              />
              <span className="text-xs text-slate-600 text-center leading-tight">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
