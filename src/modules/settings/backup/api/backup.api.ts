import dayjs from 'dayjs';

import { applySnapshot, mergeSnapshots, readLocalSnapshot, snapshotSchema } from '@/modules/sync';

export const exportBackup = async () => {
  const snapshot = await readLocalSnapshot();
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `daylist-${dayjs().format('YYYY-MM-DD')}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Импорт сливается с текущими данными тем же правилом, что и синк: ничего не затирает, а
 * удалённое после бекапа не воскрешает. Возвращает число обновлённых записей.
 */
export const importBackup = async (file: File): Promise<number> => {
  const backup = snapshotSchema.parse(JSON.parse(await file.text()));
  return applySnapshot(mergeSnapshots(await readLocalSnapshot(), backup));
};
