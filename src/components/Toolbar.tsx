import {
  FaEraser,
  FaHighlighter,
  FaPen,
  FaRedo,
  FaTrash,
  FaUndo,
  FaMousePointer,
  FaShapes,
  FaFileDownload,
  FaPlus,
} from 'react-icons/fa';
import type { ToolId, ToolSettings } from '../types';
import { DEFAULT_COLORS, DEFAULT_HIGHLIGHTER_COLORS } from '../types';

interface Props {
  settings: ToolSettings;
  onSettingsChange: (patch: Partial<ToolSettings>) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearPage: () => void;
  onOpenLibrary: () => void;
  onOpenExport: () => void;
  onNewBoard: () => void;
}

const TOOL_BUTTONS: { id: ToolId; label: string; icon: React.ReactNode }[] = [
  { id: 'pen', label: 'قلم', icon: <FaPen /> },
  { id: 'highlighter', label: 'هايلايتر', icon: <FaHighlighter /> },
  { id: 'eraser', label: 'ممحاة', icon: <FaEraser /> },
  { id: 'select', label: 'تحديد', icon: <FaMousePointer /> },
];

function sizeForActiveTool(settings: ToolSettings): number {
  if (settings.tool === 'highlighter') return settings.highlighterSize;
  if (settings.tool === 'eraser') return settings.eraserSize;
  return settings.penSize;
}

function sizeKeyForActiveTool(tool: ToolId): keyof ToolSettings {
  if (tool === 'highlighter') return 'highlighterSize';
  if (tool === 'eraser') return 'eraserSize';
  return 'penSize';
}

export default function Toolbar({
  settings,
  onSettingsChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearPage,
  onOpenLibrary,
  onOpenExport,
  onNewBoard,
}: Props) {
  const colors = settings.tool === 'highlighter' ? DEFAULT_HIGHLIGHTER_COLORS : DEFAULT_COLORS;
  const showColors = settings.tool === 'pen' || settings.tool === 'highlighter';
  const showSize = settings.tool !== 'select';

  return (
    <div className="w-full bg-slate-900 text-white px-2 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-3 shadow-md z-20 relative">
      <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
        {TOOL_BUTTONS.map((btn) => (
          <button
            key={btn.id}
            type="button"
            title={btn.label}
            onClick={() => onSettingsChange({ tool: btn.id })}
            className={`w-10 h-10 rounded-md flex items-center justify-center text-lg transition ${
              settings.tool === btn.id ? 'bg-blue-600' : 'hover:bg-slate-700'
            }`}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {showColors && (
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => onSettingsChange({ color: c })}
              className={`w-7 h-7 rounded-full border-2 ${settings.color === c ? 'border-blue-400 scale-110' : 'border-slate-600'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      {showSize && (
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
          <span className="text-xs text-slate-300">السُّمك</span>
          <input
            type="range"
            min={settings.tool === 'eraser' ? 10 : 2}
            max={settings.tool === 'eraser' ? 60 : settings.tool === 'highlighter' ? 40 : 24}
            value={sizeForActiveTool(settings)}
            onChange={(e) => onSettingsChange({ [sizeKeyForActiveTool(settings.tool)]: Number(e.target.value) })}
            className="w-20 sm:w-28"
          />
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          title="تراجع"
          disabled={!canUndo}
          onClick={onUndo}
          className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-slate-700 disabled:opacity-30"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          title="إعادة"
          disabled={!canRedo}
          onClick={onRedo}
          className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-slate-700 disabled:opacity-30"
        >
          <FaRedo />
        </button>
        <button
          type="button"
          title="مسح السبورة"
          onClick={onClearPage}
          className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-red-700"
        >
          <FaTrash />
        </button>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        title="عناصر تعليمية"
        onClick={onOpenLibrary}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded-lg text-sm font-medium"
      >
        <FaShapes /> <span className="hidden sm:inline">عناصر تعليمية</span>
      </button>

      <button
        type="button"
        title="تصدير"
        onClick={onOpenExport}
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm font-medium"
      >
        <FaFileDownload /> <span className="hidden sm:inline">تصدير</span>
      </button>

      <button
        type="button"
        title="سبورة جديدة"
        onClick={onNewBoard}
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm font-medium"
      >
        <FaPlus /> <span className="hidden sm:inline">سبورة جديدة</span>
      </button>
    </div>
  );
}
