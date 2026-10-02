import { ENTITY_KEYS, type Snapshot } from './snapshot.schema';

export interface Versioned {
  id: string;
  updatedAt: number;
  deleted?: true;
}

/**
 * Победитель для одного id: больший `updatedAt`. При равенстве выбор всё равно должен быть
 * детерминированным, иначе два устройства сольют одно и то же по-разному и не сойдутся.
 */
export const pickNewer = <T extends Versioned>(a: T, b: T): T => {
  if (a.updatedAt !== b.updatedAt) return a.updatedAt > b.updatedAt ? a : b;
  if (Boolean(a.deleted) !== Boolean(b.deleted)) return a.deleted ? a : b;
  return stableJson(a) >= stableJson(b) ? a : b;
};

// Порядок ключей у объекта из IndexedDB и из JSON может отличаться — сравниваем без него.
const stableJson = (value: object) => JSON.stringify(value, Object.keys(value).sort());

const mergeById = <T extends Versioned>(left: T[], right: T[]): T[] => {
  const byId = new Map<string, T>();
  for (const item of [...left, ...right]) {
    const current = byId.get(item.id);
    byId.set(item.id, current ? pickNewer(current, item) : item);
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
};

export const mergeSnapshots = (left: Snapshot, right: Snapshot): Snapshot => ({
  version: 1,
  categories: mergeById(left.categories, right.categories),
  tasks: mergeById(left.tasks, right.tasks),
  templateItems: mergeById(left.templateItems, right.templateItems),
  days: mergeById(left.days, right.days),
});

/** Есть ли в `merged` что-то новее, чем в `base`, — то есть нужно ли загружать файл. */
export const hasChanges = (merged: Snapshot, base: Snapshot): boolean =>
  ENTITY_KEYS.some((key) => {
    const known = new Map<string, number>(base[key].map((item) => [item.id, item.updatedAt]));
    return merged[key].some((item) => known.get(item.id) !== item.updatedAt);
  });
