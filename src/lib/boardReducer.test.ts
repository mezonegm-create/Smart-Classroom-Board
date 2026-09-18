import { describe, expect, it } from 'vitest';
import { boardReducer, createBoardState } from './boardReducer';
import { createEmptyBoard } from './storage';
import type { StrokeElement } from '../types';

function makeStroke(id: string): StrokeElement {
  return {
    id,
    kind: 'stroke',
    tool: 'pen',
    color: '#000',
    size: 4,
    opacity: 1,
    points: [[0, 0, 0.5]],
  };
}

describe('boardReducer', () => {
  it('COMMIT_PAGES replaces pages and records history', () => {
    const state = createBoardState(createEmptyBoard());
    const pages = [{ ...state.board.pages[0], elements: [makeStroke('a')] }];
    const next = boardReducer(state, { type: 'COMMIT_PAGES', pages });
    expect(next.board.pages[0].elements).toHaveLength(1);
    expect(next.past).toHaveLength(1);
    expect(next.future).toHaveLength(0);
  });

  it('UNDO restores the previous pages and populates redo', () => {
    let state = createBoardState(createEmptyBoard());
    const withStroke = [{ ...state.board.pages[0], elements: [makeStroke('a')] }];
    state = boardReducer(state, { type: 'COMMIT_PAGES', pages: withStroke });

    const undone = boardReducer(state, { type: 'UNDO' });
    expect(undone.board.pages[0].elements).toHaveLength(0);
    expect(undone.future).toHaveLength(1);
  });

  it('REDO re-applies an undone change', () => {
    let state = createBoardState(createEmptyBoard());
    const withStroke = [{ ...state.board.pages[0], elements: [makeStroke('a')] }];
    state = boardReducer(state, { type: 'COMMIT_PAGES', pages: withStroke });
    state = boardReducer(state, { type: 'UNDO' });

    const redone = boardReducer(state, { type: 'REDO' });
    expect(redone.board.pages[0].elements).toHaveLength(1);
    expect(redone.future).toHaveLength(0);
  });

  it('UNDO on empty history is a no-op', () => {
    const state = createBoardState(createEmptyBoard());
    const result = boardReducer(state, { type: 'UNDO' });
    expect(result).toBe(state);
  });

  it('a new COMMIT_PAGES after UNDO clears the redo stack', () => {
    let state = createBoardState(createEmptyBoard());
    state = boardReducer(state, { type: 'COMMIT_PAGES', pages: [{ ...state.board.pages[0], elements: [makeStroke('a')] }] });
    state = boardReducer(state, { type: 'UNDO' });
    expect(state.future).toHaveLength(1);

    state = boardReducer(state, { type: 'COMMIT_PAGES', pages: [{ ...state.board.pages[0], elements: [makeStroke('b')] }] });
    expect(state.future).toHaveLength(0);
  });

  it('SET_CURRENT_PAGE changes the index without touching history', () => {
    const state = createBoardState(createEmptyBoard());
    const next = boardReducer(state, { type: 'SET_CURRENT_PAGE', index: 0 });
    expect(next.board.currentPageIndex).toBe(0);
    expect(next.past).toHaveLength(0);
  });
});
