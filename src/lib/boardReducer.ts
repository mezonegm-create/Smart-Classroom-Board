import type { BoardDocument, BoardPage } from '../types';

export interface BoardState {
  board: BoardDocument;
  past: BoardPage[][];
  future: BoardPage[][];
}

export type BoardAction =
  | { type: 'HYDRATE'; board: BoardDocument }
  | { type: 'COMMIT_PAGES'; pages: BoardPage[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_CURRENT_PAGE'; index: number };

const HISTORY_LIMIT = 60;

export function createBoardState(board: BoardDocument): BoardState {
  return { board, past: [], future: [] };
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'HYDRATE':
      return createBoardState(action.board);

    case 'COMMIT_PAGES': {
      const past = [...state.past, state.board.pages];
      if (past.length > HISTORY_LIMIT) past.shift();
      return {
        board: { ...state.board, pages: action.pages, updatedAt: Date.now() },
        past,
        future: [],
      };
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const past = state.past.slice(0, -1);
      const future = [state.board.pages, ...state.future];
      const currentPageIndex = Math.min(state.board.currentPageIndex, previous.length - 1);
      return {
        board: { ...state.board, pages: previous, currentPageIndex, updatedAt: Date.now() },
        past,
        future,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const future = state.future.slice(1);
      const past = [...state.past, state.board.pages];
      const currentPageIndex = Math.min(state.board.currentPageIndex, next.length - 1);
      return {
        board: { ...state.board, pages: next, currentPageIndex, updatedAt: Date.now() },
        past,
        future,
      };
    }

    case 'SET_CURRENT_PAGE':
      return { ...state, board: { ...state.board, currentPageIndex: action.index } };

    default:
      return state;
  }
}
