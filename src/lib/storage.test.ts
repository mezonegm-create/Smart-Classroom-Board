import { describe, expect, it, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { createEmptyBoard, createEmptyPage, loadActiveBoard, saveBoard } from './storage';

describe('board storage', () => {
  it('createEmptyBoard produces one blank page and sane defaults', () => {
    const board = createEmptyBoard('اختبار');
    expect(board.name).toBe('اختبار');
    expect(board.pages).toHaveLength(1);
    expect(board.pages[0].elements).toHaveLength(0);
    expect(board.currentPageIndex).toBe(0);
  });

  it('createEmptyPage produces a page with a unique id and no elements', () => {
    const a = createEmptyPage();
    const b = createEmptyPage();
    expect(a.id).not.toBe(b.id);
    expect(a.elements).toEqual([]);
  });

  describe('with a fake IndexedDB backend', () => {
    beforeEach(() => {
      // idb-keyval caches its store handle; each test gets a fresh DB via fake-indexeddb/auto's reset.
    });

    it('round-trips a board through save and load', async () => {
      const board = createEmptyBoard('درس الاختبار');
      await saveBoard(board);
      const loaded = await loadActiveBoard();
      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe(board.id);
      expect(loaded?.name).toBe('درس الاختبار');
    });
  });
});
