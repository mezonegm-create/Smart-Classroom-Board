export type ToolId = 'pen' | 'highlighter' | 'eraser' | 'select';

export type PagePoint = [x: number, y: number, pressure: number];

export interface StrokeElement {
  id: string;
  kind: 'stroke';
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  size: number;
  opacity: number;
  points: PagePoint[];
}

export interface LibraryElement {
  id: string;
  kind: 'library';
  itemId: string;
  svg: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  lockAspect: boolean;
}

export type BoardElement = StrokeElement | LibraryElement;

export interface BoardPage {
  id: string;
  elements: BoardElement[];
}

export interface BoardDocument {
  id: string;
  name: string;
  pages: BoardPage[];
  currentPageIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface ToolSettings {
  tool: ToolId;
  color: string;
  penSize: number;
  highlighterSize: number;
  eraserSize: number;
}

export const DEFAULT_COLORS = [
  '#1e293b',
  '#dc2626',
  '#2563eb',
  '#16a34a',
  '#ea580c',
  '#7c3aed',
  '#ffffff',
] as const;

export const DEFAULT_HIGHLIGHTER_COLORS = [
  '#fde047',
  '#86efac',
  '#93c5fd',
  '#fca5a5',
  '#f0abfc',
] as const;
