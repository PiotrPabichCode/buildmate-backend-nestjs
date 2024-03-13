import { nanoid } from 'nanoid';

export function generateUUID(size: number = 21): string {
  return nanoid(size);
}

export function randomValue(
  size = 16,
  dict = 'FVJKGQZBUSHMINDBWOLFXYP75PX340198257Jqzgrdybfghjklvwtcmu',
): string {
  let id = '';
  let i = size;
  const len = dict.length;
  while (i--) id += dict[(Math.random() * len) | 0];
  return id;
}
