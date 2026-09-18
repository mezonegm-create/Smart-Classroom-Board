import { FaPlus, FaTrash } from 'react-icons/fa';

interface Props {
  pageCount: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

export default function PageTabs({ pageCount, currentIndex, onSelect, onAdd, onDelete }: Props) {
  return (
    <div className="w-full bg-slate-100 border-t border-slate-200 px-2 sm:px-4 py-1.5 flex items-center gap-2 overflow-x-auto">
      {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
        <div key={i} className="relative shrink-0 group">
          <button
            type="button"
            onClick={() => onSelect(i)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium border ${
              i === currentIndex ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            صفحة {i + 1}
          </button>
          {pageCount > 1 && (
            <button
              type="button"
              aria-label="حذف الصفحة"
              onClick={() => onDelete(i)}
              className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <FaTrash size={7} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        title="إضافة صفحة"
        className="shrink-0 w-8 h-8 rounded-md bg-white border border-dashed border-slate-400 text-slate-600 flex items-center justify-center hover:bg-slate-50"
      >
        <FaPlus size={12} />
      </button>
    </div>
  );
}
