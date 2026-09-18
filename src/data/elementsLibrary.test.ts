import { describe, expect, it } from 'vitest';
import { ELEMENTS_LIBRARY, findLibraryItem } from './elementsLibrary';

describe('elements library', () => {
  it('has at least one subject with items', () => {
    expect(ELEMENTS_LIBRARY.length).toBeGreaterThan(0);
    for (const subject of ELEMENTS_LIBRARY) {
      expect(subject.items.length).toBeGreaterThan(0);
    }
  });

  it('has globally unique item ids', () => {
    const ids = ELEMENTS_LIBRARY.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every item has a valid svg string and positive aspect ratio', () => {
    for (const subject of ELEMENTS_LIBRARY) {
      for (const item of subject.items) {
        expect(item.svg).toContain('<svg');
        expect(item.svg).toContain('</svg>');
        expect(item.aspect).toBeGreaterThan(0);
      }
    }
  });

  it('findLibraryItem locates an existing item and returns its subject', () => {
    const result = findLibraryItem('math-circle');
    expect(result).not.toBeNull();
    expect(result?.subject.id).toBe('math');
    expect(result?.item.id).toBe('math-circle');
  });

  it('findLibraryItem returns null for an unknown id', () => {
    expect(findLibraryItem('does-not-exist')).toBeNull();
  });
});
