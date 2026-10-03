/**
 * Новый порядок части списка без перенумерации всего остального: переставленным элементам
 * раздаются их же ключи сортировки в новой последовательности. Так фильтрованный список (активные
 * цели, открытые вхідні) не сдвигает элементы, которых на экране нет.
 */
export const reorderKeys = (ids: string[], keyOf: Map<string, number>): Map<string, number> => {
  const keys = ids.map((id) => keyOf.get(id) ?? 0).sort((a, b) => a - b);
  return new Map(ids.map((id, index) => [id, keys[index] ?? 0]));
};
