import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { BoardElement, LibraryElement, StrokeElement } from '../types';
import { boardReducer, createBoardState } from '../lib/boardReducer';
import { createEmptyBoard, createEmptyPage, debounce, loadActiveBoard, saveBoard } from '../lib/storage';
import { newId } from '../lib/id';

export function useBoardState() {
  const [state, dispatch] = useReducer(boardReducer, undefined, () => createBoardState(createEmptyBoard()));
  const [ready, setReady] = useState(false);
  const saveDebounced = useRef(debounce(saveBoard, 500));

  useEffect(() => {
    let cancelled = false;
    loadActiveBoard().then((board) => {
      if (cancelled) return;
      if (board && board.pages.length > 0) {
        dispatch({ type: 'HYDRATE', board });
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDebounced.current(state.board);
  }, [state.board, ready]);

  const currentPage = state.board.pages[state.board.currentPageIndex] ?? state.board.pages[0];

  const commitElements = useCallback(
    (pageIndex: number, elements: BoardElement[]) => {
      const pages = state.board.pages.map((p, i) => (i === pageIndex ? { ...p, elements } : p));
      dispatch({ type: 'COMMIT_PAGES', pages });
    },
    [state.board.pages],
  );

  const addStroke = useCallback(
    (stroke: StrokeElement) => {
      const idx = state.board.currentPageIndex;
      const page = state.board.pages[idx];
      commitElements(idx, [...page.elements, stroke]);
    },
    [commitElements, state.board.currentPageIndex, state.board.pages],
  );

  const addLibraryItem = useCallback(
    (element: LibraryElement) => {
      const idx = state.board.currentPageIndex;
      const page = state.board.pages[idx];
      commitElements(idx, [...page.elements, element]);
    },
    [commitElements, state.board.currentPageIndex, state.board.pages],
  );

  const updateLibraryElement = useCallback(
    (id: string, patch: Partial<LibraryElement>) => {
      const idx = state.board.currentPageIndex;
      const page = state.board.pages[idx];
      const elements = page.elements.map((el) => (el.id === id && el.kind === 'library' ? { ...el, ...patch } : el));
      commitElements(idx, elements);
    },
    [commitElements, state.board.currentPageIndex, state.board.pages],
  );

  const deleteElement = useCallback(
    (id: string) => {
      const idx = state.board.currentPageIndex;
      const page = state.board.pages[idx];
      commitElements(idx, page.elements.filter((el) => el.id !== id));
    },
    [commitElements, state.board.currentPageIndex, state.board.pages],
  );

  const clearCurrentPage = useCallback(() => {
    commitElements(state.board.currentPageIndex, []);
  }, [commitElements, state.board.currentPageIndex]);

  const addPage = useCallback(() => {
    const pages = [...state.board.pages, createEmptyPage()];
    dispatch({ type: 'COMMIT_PAGES', pages });
    dispatch({ type: 'SET_CURRENT_PAGE', index: pages.length - 1 });
  }, [state.board.pages]);

  const deletePage = useCallback(
    (index: number) => {
      if (state.board.pages.length <= 1) return;
      const pages = state.board.pages.filter((_, i) => i !== index);
      dispatch({ type: 'COMMIT_PAGES', pages });
      const newIndex = Math.max(0, Math.min(state.board.currentPageIndex, pages.length - 1));
      dispatch({ type: 'SET_CURRENT_PAGE', index: newIndex });
    },
    [state.board.currentPageIndex, state.board.pages],
  );

  const setCurrentPage = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', index });
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const startNewBoard = useCallback(() => {
    dispatch({ type: 'HYDRATE', board: createEmptyBoard(`الدرس ${new Date().toLocaleDateString('ar-EG')}`) });
  }, []);

  return {
    ready,
    board: state.board,
    currentPage,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    addStroke,
    addLibraryItem: (itemId: string, svg: string, width: number, height: number) =>
      addLibraryItem({
        id: newId(),
        kind: 'library',
        itemId,
        svg,
        x: 700 - width / 2,
        y: 450 - height / 2,
        width,
        height,
        rotation: 0,
        lockAspect: true,
      }),
    updateLibraryElement,
    deleteElement,
    clearCurrentPage,
    addPage,
    deletePage,
    setCurrentPage,
    undo,
    redo,
    startNewBoard,
  };
}
