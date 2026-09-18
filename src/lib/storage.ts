import { get, set, del } from 'idb-keyval';
import type { BoardDocument, BoardPage } from '../types';
import { newId } from './id';

const ACTIVE_BOARD_KEY = 'smart-board:active-board-id';
const boardKey = (id: string) => `smart-board:board:${id}`;

export function createEmptyPage(): BoardPage {
  return { id: newId(), elements: [] };
}

export function createEmptyBoard(name = 'الدرس الأول'): BoardDocument {
  const now = Date.now();
  return {
    id: newId(),
    name,
    pages: [createEmptyPage()],
    currentPageIndex: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export async function loadActiveBoard(): Promise<BoardDocument | null> {
  try {
    const activeId = await get<string>(ACTIVE_BOARD_KEY);
    if (!activeId) return null;
    const board = await get<BoardDocument>(boardKey(activeId));
    return board ?? null;
  } catch (err) {
    console.error('فشل تحميل السبورة المحفوظة', err);
    return null;
  }
}

export async function saveBoard(board: BoardDocument): Promise<void> {
  try {
    await set(boardKey(board.id), board);
    await set(ACTIVE_BOARD_KEY, board.id);
  } catch (err) {
    console.error('فشل حفظ السبورة', err);
  }
}

export async function deleteBoard(id: string): Promise<void> {
  await del(boardKey(id));
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
