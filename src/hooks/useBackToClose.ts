import { useEffect, useRef } from 'react';

interface Entry {
  close: () => void;
  href: string;
}

// Открытые шторки, меню и диалоги снизу вверх; у каждого — своя запись в истории над текущим экраном.
const stack: Entry[] = [];
// Сколько popstate вызвали мы сами, закрывая оверлей кнопкой: их не считаем нажатием «назад».
let ownBacks = 0;
let afterOwnBacks: (() => void) | null = null;
// Закрытия кнопкой в одном рендере (шторка и её подшаг) копим и снимаем одним history.go:
// два history.back() подряд браузер может склеить в один шаг.
let pendingBacks = 0;

const flushBacks = () => {
  if (pendingBacks === 0) return;
  ownBacks += 1;
  history.go(-pendingBacks);
  pendingBacks = 0;
};

let listening = false;

const onPopState = () => {
  if (ownBacks > 0) {
    ownBacks -= 1;
    if (ownBacks === 0 && afterOwnBacks) {
      const then = afterOwnBacks;
      afterOwnBacks = null;
      then();
    }
    return;
  }
  stack.pop()?.close();
};

const listen = () => {
  if (listening) return;
  window.addEventListener('popstate', onPopState);
  listening = true;
};

/**
 * Переход на другой экран из шторки: сначала снимаем записи всех открытых оверлеев, потом
 * переходим. Иначе «назад» с нового экрана вернёт на экран под шторкой (например, удалённой цели).
 */
export const closeOverlaysThen = (then: () => void) => {
  const count = stack.length + pendingBacks;
  pendingBacks = 0;
  if (count === 0) {
    then();
    return;
  }
  stack.length = 0;
  listen();
  ownBacks += 1;
  afterOwnBacks = then;
  history.go(-count);
};

/**
 * Системная «назад» на Android закрывает верхний оверлей, а не всё приложение. Пока `open`,
 * в истории лежит запись с тем же адресом; закрытие кнопкой снимает её, если экран не сменился.
 */
export const useBackToClose = (open: boolean, onClose: () => void) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    listen();
    const entry: Entry = { close: () => onCloseRef.current(), href: location.href };
    stack.push(entry);
    // Состояние роутера сохраняем: для него это тот же экран.
    history.pushState(history.state, '');

    return () => {
      const index = stack.indexOf(entry);
      if (index === -1) return;
      stack.splice(index, 1);
      // После перехода на другой экран (replace) запись уже заменена — назад идти нельзя.
      if (location.href !== entry.href) return;
      if (pendingBacks === 0) queueMicrotask(flushBacks);
      pendingBacks += 1;
    };
  }, [open]);
};
