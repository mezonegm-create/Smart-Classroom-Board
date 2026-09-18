import { useCallback, useState } from 'react';
import Toolbar from './components/Toolbar';
import PageTabs from './components/PageTabs';
import CanvasStage from './components/CanvasStage';
import ElementsLibraryPanel from './components/ElementsLibraryPanel';
import ExportMenu from './components/ExportMenu';
import { useBoardState } from './hooks/useBoardState';
import { findLibraryItem } from './data/elementsLibrary';
import type { ToolSettings } from './types';

const DEFAULT_ELEMENT_WIDTH = 220;

function App() {
  const board = useBoardState();
  const [settings, setSettings] = useState<ToolSettings>({
    tool: 'pen',
    color: '#1e293b',
    penSize: 6,
    highlighterSize: 22,
    eraserSize: 26,
  });
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const updateSettings = useCallback((patch: Partial<ToolSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleInsertLibraryItem = useCallback(
    (itemId: string) => {
      const found = findLibraryItem(itemId);
      if (!found) return;
      const width = DEFAULT_ELEMENT_WIDTH;
      const height = width / found.item.aspect;
      board.addLibraryItem(itemId, found.item.svg, width, height);
      setSettings((prev) => ({ ...prev, tool: 'select' }));
    },
    [board],
  );

  const handleClearPage = useCallback(() => {
    if (window.confirm('هل تريد مسح كل محتوى هذه الصفحة؟ لا يمكن التراجع عن هذا بعد الحفظ.')) {
      board.clearCurrentPage();
      setSelectedElementId(null);
    }
  }, [board]);

  const handleNewBoard = useCallback(() => {
    if (window.confirm('سيتم إنشاء سبورة جديدة فارغة. هل تريد المتابعة؟ (السبورة الحالية محفوظة تلقائيًا)')) {
      board.startNewBoard();
      setSelectedElementId(null);
    }
  }, [board]);

  if (!board.ready) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        جارٍ تحميل السبورة…
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-50" dir="rtl">
      <Toolbar
        settings={settings}
        onSettingsChange={updateSettings}
        canUndo={board.canUndo}
        canRedo={board.canRedo}
        onUndo={board.undo}
        onRedo={board.redo}
        onClearPage={handleClearPage}
        onOpenLibrary={() => setLibraryOpen(true)}
        onOpenExport={() => setExportOpen(true)}
        onNewBoard={handleNewBoard}
      />

      <div className="flex-1 min-h-0">
        <CanvasStage
          page={board.currentPage}
          settings={settings}
          onStrokeComplete={board.addStroke}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateLibraryElement={board.updateLibraryElement}
          onDeleteLibraryElement={(id) => {
            board.deleteElement(id);
            setSelectedElementId(null);
          }}
        />
      </div>

      <PageTabs
        pageCount={board.board.pages.length}
        currentIndex={board.board.currentPageIndex}
        onSelect={board.setCurrentPage}
        onAdd={board.addPage}
        onDelete={board.deletePage}
      />

      <ElementsLibraryPanel open={libraryOpen} onClose={() => setLibraryOpen(false)} onInsert={handleInsertLibraryItem} />

      <ExportMenu
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        currentPage={board.currentPage}
        currentPageNumber={board.board.currentPageIndex + 1}
        allPages={board.board.pages}
        boardName={board.board.name}
      />
    </div>
  );
}

export default App;
