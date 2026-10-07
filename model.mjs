export const LEVELS = [
  { name: 'A little turn', size: 5, row: 2, mirrors: [[2, 2, '\\']], flowers: [[2, 0]], solution: ['/'] },
  { name: 'Around the corner', size: 6, row: 4, mirrors: [[2, 4, '\\'], [2, 1, '\\']], flowers: [[2, 2], [5, 1]], solution: ['/', '/'] },
  { name: 'The long way home', size: 6, row: 4, mirrors: [[1, 4, '\\'], [1, 1, '\\'], [4, 1, '/'], [4, 4, '/']], flowers: [[1, 2], [3, 1], [4, 3], [5, 4]], solution: ['/', '/', '\\', '\\'] },
  { name: 'Thread the garden', size: 7, row: 5, mirrors: [[1, 5, '\\'], [1, 1, '\\'], [5, 1, '/'], [5, 5, '\\'], [3, 5, '/'], [3, 3, '\\']], flowers: [[1, 3], [3, 1], [5, 3], [4, 5], [6, 3]], solution: ['/', '/', '\\', '/', '\\', '/'] }
];
export const setup = index => ({ ...LEVELS[index], mirrors: LEVELS[index].mirrors.map(m => [...m]), flowers: LEVELS[index].flowers.map(f => [...f]) });
export function turn(board, index) {
  if (!Number.isInteger(index) || !board.mirrors[index]) return board;
  return { ...board, mirrors: board.mirrors.map((m, i) => i === index ? [m[0], m[1], m[2] === '/' ? '\\' : '/'] : [...m]) };
}
export function trace(board) {
  let x = -1, y = board.row, dx = 1, dy = 0;
  const path = [[x, y]], lit = new Set(), visited = new Set();
  for (let n = 0; n < board.size * board.size * 4 + 1; n++) {
    x += dx; y += dy; path.push([x, y]);
    if (x < 0 || y < 0 || x >= board.size || y >= board.size) return { path, lit: [...lit], end: 'edge', won: lit.size === board.flowers.length };
    const key = `${x},${y},${dx},${dy}`;
    if (visited.has(key)) return { path, lit: [...lit], end: 'loop', won: lit.size === board.flowers.length };
    visited.add(key);
    board.flowers.forEach(([fx, fy], i) => { if (fx === x && fy === y) lit.add(i); });
    const mirror = board.mirrors.find(m => m[0] === x && m[1] === y);
    if (mirror) [dx, dy] = mirror[2] === '/' ? [-dy, -dx] : [dy, dx];
  }
  return { path, lit: [...lit], end: 'limit', won: false };
}
